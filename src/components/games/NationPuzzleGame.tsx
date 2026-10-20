import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { CheckCircle2, Lock, Trash2, Undo2, Unlock } from 'lucide-react'
import {
  analyzeNation,
  computeNationCosts,
  createEmptyNationBoard,
  type NationPuzzleDefinition,
  type NationAnalysisById,
  type NationBoard,
} from '../../data/nationPuzzle'
import { useTheme } from '../../context/ThemeContext'
import '../../styles/nation-puzzle.css'

type GameSnapshot = {
  board: NationBoard
  states: number[]
  selectedState: number
  showCosts: boolean
  showStateSize: boolean
  lockedStates: number[]
}

type StoredGameSnapshot = Omit<GameSnapshot, 'showStateSize' | 'lockedStates'> & {
  showStateSize?: boolean
  lockedStates?: number[]
}

type SavedConfiguration = GameSnapshot & {
  id: string
  name: string
  savedAt: number
}

function getCurrentStorageKey(puzzleId: NationPuzzleDefinition['id']) {
  return puzzleId === 'large' ? 'nation-puzzle-current-v1' : `nation-puzzle-${puzzleId}-current-v1`
}

function getConfigurationsStorageKey(puzzleId: NationPuzzleDefinition['id']) {
  return puzzleId === 'large' ? 'nation-puzzle-configurations-v1' : `nation-puzzle-${puzzleId}-configurations-v1`
}

function copyBoard(board: NationBoard): NationBoard {
  return board.map(row => [...row])
}

function boardsEqual(first: NationBoard, second: NationBoard) {
  return first.every((row, rowIndex) => row.every((value, colIndex) => value === second[rowIndex][colIndex]))
}

function getNationColor(id: number) {
  const hue = (id * 137.5 + 185) % 360
  return `hsla(${hue}, 62%, 58%, 0.62)`
}

function isGameSnapshot(value: unknown, boardSize: number): value is StoredGameSnapshot {
  if (!value || typeof value !== 'object') return false
  const snapshot = value as Partial<GameSnapshot>
  const boardIsValid = Array.isArray(snapshot.board)
    && snapshot.board.length === boardSize
    && snapshot.board.every(row => Array.isArray(row)
      && row.length === boardSize
      && row.every(cell => Number.isInteger(cell) && cell >= 0))
  const statesAreValid = Array.isArray(snapshot.states)
    && snapshot.states.every(id => Number.isInteger(id) && id > 0)
    && new Set(snapshot.states).size === snapshot.states.length
  const selectionIsValid = Number.isInteger(snapshot.selectedState)
    && (snapshot.selectedState === 0 || (Array.isArray(snapshot.states)
      && snapshot.states.includes(snapshot.selectedState as number)))
  const lockListIsValid = snapshot.lockedStates === undefined || (Array.isArray(snapshot.lockedStates)
    && snapshot.lockedStates.every(id => Number.isInteger(id) && id > 0))
  return boardIsValid && statesAreValid && selectionIsValid && typeof snapshot.showCosts === 'boolean'
    && (snapshot.showStateSize === undefined || typeof snapshot.showStateSize === 'boolean')
    && lockListIsValid
}

function normalizeSnapshot(snapshot: StoredGameSnapshot): GameSnapshot {
  const states = snapshot.states.length ? [...snapshot.states] : [1]
  return {
    board: snapshot.board,
    states,
    selectedState: states.includes(snapshot.selectedState) ? snapshot.selectedState : states[0],
    showCosts: snapshot.showCosts,
    showStateSize: snapshot.showStateSize ?? false,
    lockedStates: snapshot.lockedStates?.filter(id => states.includes(id)) ?? [],
  }
}

function readCurrentSnapshot(puzzle: NationPuzzleDefinition): GameSnapshot {
  try {
    const stored = window.localStorage.getItem(getCurrentStorageKey(puzzle.id))
    if (stored) {
      const parsed: unknown = JSON.parse(stored)
      if (isGameSnapshot(parsed, puzzle.size)) return normalizeSnapshot(parsed)
    }
  } catch {
    // Fall back to a blank board when storage is unavailable or malformed.
  }
  return {
    board: createEmptyNationBoard(puzzle.size),
    states: [1],
    selectedState: 1,
    showCosts: true,
    showStateSize: false,
    lockedStates: [],
  }
}

function readSavedConfigurations(puzzle: NationPuzzleDefinition): SavedConfiguration[] {
  try {
    const stored = window.localStorage.getItem(getConfigurationsStorageKey(puzzle.id))
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap(item => {
      if (!item || typeof item !== 'object') return []
      const config = item as Partial<SavedConfiguration>
      const id = config.id
      const name = config.name
      const savedAt = config.savedAt
      if (typeof id !== 'string' || typeof name !== 'string'
        || typeof savedAt !== 'number' || !isGameSnapshot(config, puzzle.size)) return []
      return [{ ...normalizeSnapshot(config), id, name, savedAt }]
    })
  } catch {
    return []
  }
}

function makeConfigurationId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

interface NationPuzzleGameProps {
  puzzle: NationPuzzleDefinition
}

export default function NationPuzzleGame({ puzzle }: NationPuzzleGameProps) {
  const { theme } = useTheme()
  const size = puzzle.size
  const clues = puzzle.clues
  const currentStorageKey = getCurrentStorageKey(puzzle.id)
  const configurationsStorageKey = getConfigurationsStorageKey(puzzle.id)
  const [initialSnapshot] = useState(() => readCurrentSnapshot(puzzle))
  const [board, setBoard] = useState<NationBoard>(initialSnapshot.board)
  const boardRef = useRef(board)
  const [states, setStates] = useState(initialSnapshot.states)
  const [selectedState, setSelectedState] = useState(initialSnapshot.selectedState)
  const [showCosts, setShowCosts] = useState(initialSnapshot.showCosts)
  const [showStateSize, setShowStateSize] = useState(initialSnapshot.showStateSize)
  const [lockedStates, setLockedStates] = useState(initialSnapshot.lockedStates)
  const [undoStack, setUndoStack] = useState<NationBoard[]>([])
  const [savedConfigurations, setSavedConfigurations] = useState(() => readSavedConfigurations(puzzle))
  const [configurationName, setConfigurationName] = useState('')
  const paintRef = useRef<number | null>(null)
  const strokeStartRef = useRef<NationBoard | null>(null)

  useEffect(() => {
    const snapshot: GameSnapshot = { board, states, selectedState, showCosts, showStateSize, lockedStates }
    try {
      window.localStorage.setItem(currentStorageKey, JSON.stringify(snapshot))
    } catch {
      // Keep the game usable if browser storage is disabled or full.
    }
  }, [board, states, selectedState, showCosts, showStateSize, lockedStates, currentStorageKey])

  useEffect(() => {
    try {
      window.localStorage.setItem(configurationsStorageKey, JSON.stringify(savedConfigurations))
    } catch {
      // Keep saved configurations in memory for this session if storage is unavailable.
    }
  }, [savedConfigurations, configurationsStorageKey])

  const stopPainting = useCallback(() => {
    const strokeStart = strokeStartRef.current
    if (strokeStart && !boardsEqual(strokeStart, boardRef.current)) {
      setUndoStack(current => [...current, strokeStart])
    }
    strokeStartRef.current = null
    paintRef.current = null
  }, [])

  useEffect(() => {
    window.addEventListener('pointerup', stopPainting)
    window.addEventListener('pointercancel', stopPainting)
    return () => {
      window.removeEventListener('pointerup', stopPainting)
      window.removeEventListener('pointercancel', stopPainting)
    }
  }, [stopPainting])

  const analysis = useMemo<NationAnalysisById>(() => {
    const result: NationAnalysisById = {}
    for (const id of states) result[id] = analyzeNation(board, id)
    return result
  }, [board, states])
  const costs = useMemo(() => computeNationCosts(board, analysis), [board, analysis])
  const scoreBreakdown = useMemo(() => {
    const cellStateSizes = board.map(row => row.map(id => id ? analysis[id]?.size ?? 0 : 0))
    const rowSums = cellStateSizes.map(row => row.reduce((sum, size) => sum + size, 0))
    const squaredRowSums = rowSums.map(sum => sum ** 2)
    return {
      cellStateSizes,
      rowSums,
      squaredRowSums,
      finalSum: squaredRowSums.reduce((sum, value) => sum + value, 0),
    }
  }, [board, analysis])

  const paintCell = (row: number, col: number, id: number) => {
    const current = boardRef.current
    const currentState = current[row][col]
    if (currentState === id || lockedStates.includes(currentState) || lockedStates.includes(id)) return
    const next = copyBoard(current)
    next[row][col] = id
    boardRef.current = next
    setBoard(next)
  }

  const beginPaint = (row: number, col: number) => {
    const currentState = boardRef.current[row][col]
    if (lockedStates.includes(currentState) || lockedStates.includes(selectedState)) return
    const id = currentState === selectedState && selectedState !== 0 ? 0 : selectedState
    strokeStartRef.current = copyBoard(boardRef.current)
    paintRef.current = id
    paintCell(row, col, id)
  }

  const addState = () => {
    const id = Math.max(0, ...states) + 1
    setStates(current => [...current, id])
    setSelectedState(id)
  }

  const toggleStateLock = (id: number) => {
    setLockedStates(current => current.includes(id)
      ? current.filter(lockedId => lockedId !== id)
      : [...current, id])
  }

  const clearBoard = () => {
    const emptyBoard = boardRef.current.map(row => row.map(id => lockedStates.includes(id) ? id : 0))
    if (boardsEqual(boardRef.current, emptyBoard)) return
    setUndoStack(current => [...current, copyBoard(boardRef.current)])
    boardRef.current = emptyBoard
    setBoard(emptyBoard)
  }

  const undo = () => {
    const previous = undoStack[undoStack.length - 1]
    if (!previous) return
    const restored = copyBoard(previous)
    boardRef.current = restored
    setBoard(restored)
    setUndoStack(current => current.slice(0, -1))
  }

  const saveConfiguration = () => {
    const name = configurationName.trim()
    if (!name) return
    const configuration: SavedConfiguration = {
      id: makeConfigurationId(),
      name,
      savedAt: Date.now(),
      board: copyBoard(boardRef.current),
      states: [...states],
      selectedState,
      showCosts,
      showStateSize,
      lockedStates: [...lockedStates],
    }
    setSavedConfigurations(current => [...current, configuration])
    setConfigurationName('')
  }

  const loadConfiguration = (configuration: SavedConfiguration) => {
    const restored = copyBoard(configuration.board)
    boardRef.current = restored
    setBoard(restored)
    setStates([...configuration.states])
    setSelectedState(configuration.selectedState)
    setShowCosts(configuration.showCosts)
    setShowStateSize(configuration.showStateSize)
    setLockedStates([...configuration.lockedStates])
    setUndoStack([])
  }

  const deleteConfiguration = (id: string) => {
    setSavedConfigurations(current => current.filter(configuration => configuration.id !== id))
  }

  let unmatchedClues = 0
  let matchedClues = 0
  let totalClues = 0
  let unassignedCells = 0
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const id = board[row][col]
      if (!id) unassignedCells++
      const clue = clues[`${row + 1},${col + 1}`]
      if (clue !== undefined) {
        totalClues++
        if (id) {
          if (costs[row][col] === clue) matchedClues++
          else unmatchedClues++
        }
      }
    }
  }
  const isSolved = totalClues > 0 && unassignedCells === 0 && matchedClues === totalClues
  const solutionScore = scoreBreakdown.finalSum

  useEffect(() => {
    if (!isSolved) return
    console.log('Nation Puzzle score breakdown', scoreBreakdown)
  }, [isSolved, scoreBreakdown])

  return (
    <div className={`np-game ${theme}`}>
      <section className="np-board-section" aria-label="Nation puzzle board">
        <div
          className="np-board"
          role="grid"
          aria-label={`${size} by ${size} nation board`}
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
            width: `min(100%, ${Math.min(size * 46, 506)}px)`,
          }}
        >
          {board.map((line, row) => line.map((id, col) => {
            const clue = clues[`${row + 1},${col + 1}`]
            const hasClue = clue !== undefined
            const clueValue = hasClue ? clue : null
            const isCapital = Boolean(id && analysis[id]?.connected
              && analysis[id]?.capital?.row === row && analysis[id]?.capital?.col === col)
            const cost = costs[row][col]
            const matches = hasClue && cost === clueValue
            const borders: CSSProperties = {}
            const neighbors = [
              ['borderTop', row === 0 ? -1 : board[row - 1][col]],
              ['borderBottom', row === size - 1 ? -1 : board[row + 1][col]],
              ['borderLeft', col === 0 ? -1 : board[row][col - 1]],
              ['borderRight', col === size - 1 ? -1 : board[row][col + 1]],
            ] as const
            for (const [property, neighborId] of neighbors) {
              borders[property] = neighborId !== id ? '3px solid var(--np-border-strong)' : '1px solid var(--np-line)'
            }

            return (
              <button
                key={`${row}-${col}`}
                type="button"
                role="gridcell"
                aria-label={`Row ${row + 1}, column ${col + 1}${id ? `, state ${id}` : ', unassigned'}${id && lockedStates.includes(id) ? ', locked' : ''}${hasClue ? `, clue ${clueValue}` : ''}`}
                className="np-cell"
                style={{ ...borders, backgroundColor: id ? getNationColor(id) : 'transparent' }}
                onPointerDown={event => {
                  event.preventDefault()
                  beginPaint(row, col)
                }}
                onPointerEnter={() => {
                  if (paintRef.current !== null) paintCell(row, col, paintRef.current)
                }}
              >
                {hasClue && <span className="np-clue">{clueValue}</span>}
                {isCapital && <span className="np-capital" aria-label="Capitol">★</span>}
                {id !== 0 && lockedStates.includes(id) && <Lock className="np-cell-lock" size={10} aria-hidden="true" />}
                {showStateSize && id !== 0 && <span className="np-size">{analysis[id]?.size}</span>}
                {showCosts && id !== 0 && (
                  <span className={`np-cost${hasClue ? (matches ? ' is-match' : ' is-mismatch') : ''}`}>
                    {Number.isFinite(cost) ? cost : '∞'}
                  </span>
                )}
              </button>
            )
          }))}
        </div>
        <p className="np-board-note">Thick borders separate states. Drag across cells to paint.</p>
      </section>

      <aside className="np-controls">
        <div className={`np-message${isSolved ? ' is-solved' : ''}`} role="status">
          {isSolved && <CheckCircle2 size={19} aria-hidden="true" />}
          <span>
            {unassignedCells} unassigned cells. Clues matched: {matchedClues}/{totalClues}
            {unmatchedClues > 0 && ` · ${unmatchedClues} mismatched (expected while the partition is incomplete)`}.
            {isSolved && ' Correctly solved!'}
          </span>
          {isSolved && (
            <strong className="np-progress-score">
              Score: {new Intl.NumberFormat().format(solutionScore)}
            </strong>
          )}
        </div>

        <div className="np-state-list" aria-label="Choose a state">
          {states.map(id => {
            const result = analysis[id]
            const isLocked = lockedStates.includes(id)
            return (
              <div className="np-state-row" key={id}>
                <button
                  type="button"
                  className={`np-state${id === selectedState ? ' is-selected' : ''}`}
                  onClick={() => setSelectedState(id)}
                  aria-pressed={id === selectedState}
                >
                  <span className="np-swatch" style={{ backgroundColor: getNationColor(id) }} />
                  <span className="np-state-copy">
                    <strong>State {id}{isLocked ? ' · Locked' : ''}</strong>
                    <small>{result.size} cells · {result.description}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={`np-state-lock${isLocked ? ' is-locked' : ''}`}
                  onClick={() => toggleStateLock(id)}
                  aria-label={`${isLocked ? 'Unlock' : 'Lock'} State ${id}`}
                  aria-pressed={isLocked}
                  title={`${isLocked ? 'Unlock' : 'Lock'} State ${id}`}
                >
                  {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
                </button>
              </div>
            )
          })}
          <button
            type="button"
            className={`np-state${selectedState === 0 ? ' is-selected' : ''}`}
            onClick={() => setSelectedState(0)}
            aria-pressed={selectedState === 0}
          >
            <span className="np-swatch np-eraser-swatch" />
            <span className="np-state-copy"><strong>Eraser</strong><small>Remove cells from a state</small></span>
          </button>
        </div>

        <div className="np-actions">
          <button type="button" onClick={addState}>+ New state</button>
          <button type="button" onClick={clearBoard}>Clear unlocked</button>
          <button type="button" onClick={undo} disabled={undoStack.length === 0}>
            <Undo2 size={14} /> Undo
          </button>
        </div>

        <div className="np-display-toggles">
          <label className="np-cost-toggle">
            <input type="checkbox" checked={showCosts} onChange={event => setShowCosts(event.target.checked)} />
            Show computed costs
          </label>
          <label className="np-cost-toggle">
            <input type="checkbox" checked={showStateSize} onChange={event => setShowStateSize(event.target.checked)} />
            Show state size
          </label>
        </div>

        <section className="np-configurations" aria-label="Saved configurations">
          <h2>Configurations</h2>
          <form
            className="np-save-form"
            onSubmit={event => {
              event.preventDefault()
              saveConfiguration()
            }}
          >
            <input
              type="text"
              value={configurationName}
              onChange={event => setConfigurationName(event.target.value)}
              placeholder="Configuration name"
              aria-label="Configuration name"
              maxLength={48}
            />
            <button type="submit" disabled={!configurationName.trim()}>Save</button>
          </form>
          {savedConfigurations.length > 0 ? (
            <ul className="np-config-list">
              {savedConfigurations.map(configuration => (
                <li key={configuration.id}>
                  <button type="button" className="np-config-load" onClick={() => loadConfiguration(configuration)}>
                    <strong>{configuration.name}</strong>
                    <small>{new Date(configuration.savedAt).toLocaleString()}</small>
                  </button>
                  <button
                    type="button"
                    className="np-config-delete"
                    onClick={() => deleteConfiguration(configuration.id)}
                    aria-label={`Delete ${configuration.name}`}
                    title="Delete configuration"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="np-no-configs">Saved configurations will appear here.</p>
          )}
        </section>

        <p className="np-help">
          Create states and paint the grid. Selecting a state and clicking one of its cells erases that cell.
          Lock a state to protect its cells from changes. Each state must be connected and symmetric;
          ★ marks a capitol. Costs flow through assigned cells, and the size display shows each state’s total cells.
        </p>
      </aside>
    </div>
  )
}
