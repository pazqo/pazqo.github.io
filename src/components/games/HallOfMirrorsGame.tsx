import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { CheckCircle2, RotateCcw, Undo2 } from 'lucide-react'
import {
  createEmptyMirrorBoard,
  type HallPuzzleDefinition,
  type LaserClue,
  type LaserSide,
  type MirrorBoard,
  type MirrorOrientation,
} from '../../data/hallOfMirrors'
import { useTheme } from '../../context/ThemeContext'
import '../../styles/hall-of-mirrors.css'

type Direction = { dx: number; dy: number }
type Point = [number, number]
type Laser = { id: string; side: LaserSide; index: number; clue?: LaserClue }
type LaserPath = {
  laser: Laser
  points: Point[]
  segments: number[]
  product: bigint | null
  loops: boolean
}

const SIDES: LaserSide[] = ['top', 'right', 'bottom', 'left']
const VIEW_MARGIN = 1
const BEAM_COLOR_COUNT = 20

function beamColorStyle(index: number): CSSProperties {
  return { '--hm-beam-hue': String((index % BEAM_COLOR_COUNT) * (360 / BEAM_COLOR_COUNT)) } as CSSProperties
}

function laserId(side: LaserSide, index: number) {
  return `${side}-${index}`
}

function getLaserStart(laser: Laser, size: number): { point: Point; direction: Direction } {
  const offset = laser.index + 0.5
  switch (laser.side) {
    case 'top': return { point: [offset, -0.5], direction: { dx: 0, dy: 1 } }
    case 'right': return { point: [size + 0.5, offset], direction: { dx: -1, dy: 0 } }
    case 'bottom': return { point: [offset, size + 0.5], direction: { dx: 0, dy: -1 } }
    case 'left': return { point: [-0.5, offset], direction: { dx: 1, dy: 0 } }
    default: throw new Error('Unknown laser side')
  }
}

function reflect(direction: Direction, mirror: MirrorOrientation): Direction {
  if (mirror === 1) return { dx: -direction.dy, dy: -direction.dx }
  return { dx: direction.dy, dy: direction.dx }
}

function traceLaser(laser: Laser, mirrors: MirrorBoard): LaserPath {
  const size = mirrors.length
  const { point: start, direction: initialDirection } = getLaserStart(laser, size)
  const points: Point[] = [start]
  const segments: number[] = []
  const visited = new Set<string>()
  let point: Point = start
  let direction = initialDirection
  let currentSegmentLength = 0
  let loops = false
  const maxSteps = size * size * 4 + 4

  for (let step = 0; step < maxSteps; step++) {
    const next: Point = [point[0] + direction.dx, point[1] + direction.dy]
    currentSegmentLength++
    const col = Math.floor(next[0])
    const row = Math.floor(next[1])

    if (row < 0 || col < 0 || row >= size || col >= size) {
      points.push(next)
      segments.push(currentSegmentLength)
      point = next
      break
    }

    const state = `${row},${col},${direction.dx},${direction.dy}`
    if (visited.has(state)) {
      points.push([col + 0.5, row + 0.5])
      loops = true
      break
    }
    visited.add(state)
    point = next

    const mirror = mirrors[row][col]
    if (mirror !== 0) {
      points.push(point)
      segments.push(currentSegmentLength)
      currentSegmentLength = 0
      direction = reflect(direction, mirror)
    }
  }

  const product = loops ? null : segments.reduce((value, length) => value * BigInt(length), 1n)
  return { laser, points, segments, product, loops }
}

function copyMirrorBoard(board: MirrorBoard): MirrorBoard {
  return board.map(row => [...row])
}

function readMirrorBoard(key: string, size: number): MirrorBoard {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null')
    if (Array.isArray(parsed) && parsed.length === size && parsed.every(row => Array.isArray(row)
      && row.length === size && row.every(cell => cell === 0 || cell === 1 || cell === 2))) {
      return parsed as MirrorBoard
    }
  } catch {
    // Use an empty board if saved data is unavailable or malformed.
  }
  return createEmptyMirrorBoard(size)
}

function isAdjacentMirror(board: MirrorBoard, row: number, col: number) {
  return [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([rowStep, colStep]) => {
    const nextRow = row + rowStep
    const nextCol = col + colStep
    return nextRow >= 0 && nextCol >= 0 && nextRow < board.length && nextCol < board.length
      && board[nextRow][nextCol] !== 0
  })
}

function pointPercent(value: number, size: number) {
  return `${((value + VIEW_MARGIN) / (size + VIEW_MARGIN * 2)) * 100}%`
}

function getDotPosition(laser: Laser, size: number): Point {
  const offset = laser.index + 0.5
  switch (laser.side) {
    case 'top': return [offset, -0.5]
    case 'right': return [size + 0.5, offset]
    case 'bottom': return [offset, size + 0.5]
    case 'left': return [-0.5, offset]
    default: throw new Error('Unknown laser side')
  }
}

function getProductPosition(laser: Laser, size: number): Point {
  const offset = laser.index + 0.5
  switch (laser.side) {
    case 'top': return [offset, -0.14]
    case 'right': return [size + 0.5, offset + 0.36]
    case 'bottom': return [offset, size + 0.86]
    case 'left': return [-0.5, offset + 0.36]
    default: throw new Error('Unknown laser side')
  }
}

function formatSegments(path: LaserPath) {
  if (path.loops) return `Loops after ${path.segments.join(' × ') || 'an incomplete segment'}`
  return `${path.segments.join(' × ')} = ${path.product?.toString() ?? '—'}`
}

function formatProduct(path: LaserPath) {
  return path.product?.toString() ?? 'loop'
}

interface HallOfMirrorsGameProps {
  puzzle: HallPuzzleDefinition
}

export default function HallOfMirrorsGame({ puzzle }: HallOfMirrorsGameProps) {
  const { theme } = useTheme()
  const size = puzzle.size
  const storageKey = `hall-of-mirrors-${puzzle.id}-mirrors-v1`
  const [mirrors, setMirrors] = useState(() => readMirrorBoard(storageKey, size))
  const [undoStack, setUndoStack] = useState<MirrorBoard[]>([])
  const [selectedLaserIds, setSelectedLaserIds] = useState<string[]>([])
  const [hoveredLaserId, setHoveredLaserId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(mirrors))
    } catch {
      // Keep the board usable when browser storage is unavailable or full.
    }
  }, [mirrors, storageKey])

  const lasers = useMemo<Laser[]>(() => {
    const clueMap = new Map<string, LaserClue>(puzzle.clues.map(clue => [laserId(clue.side, clue.index), clue] as const))
    return SIDES.flatMap(side => Array.from({ length: size }, (_, index) => {
      const id = laserId(side, index)
      return { id, side, index, clue: clueMap.get(id) }
    }))
  }, [puzzle.clues, size])
  const paths = useMemo(() => lasers.map(laser => traceLaser(laser, mirrors)), [lasers, mirrors])
  const pathById = useMemo(() => new Map<string, LaserPath>(paths.map(path => [path.laser.id, path] as const)), [paths])
  const cluePaths = paths.filter(path => path.laser.clue)
  const matchedCount = cluePaths.filter(path => path.product === BigInt(path.laser.clue!.target)).length
  const allCluesMatched = cluePaths.length > 0 && matchedCount === cluePaths.length
  const missingClueSideSums = SIDES.map(side => {
    const sidePaths = paths.filter(path => path.laser.side === side && !path.laser.clue)
    const hasLoop = sidePaths.some(path => path.product === null)
    return {
      side,
      sum: hasLoop ? null : sidePaths.reduce((total, path) => total + path.product!, 0n),
    }
  })
  const missingClueAnswer = missingClueSideSums.every(({ sum }) => sum !== null)
    ? missingClueSideSums.reduce((product, { sum }) => product * sum!, 1n)
    : null
  const activeLaserIds = hoveredLaserId && !selectedLaserIds.includes(hoveredLaserId)
    ? [...selectedLaserIds, hoveredLaserId]
    : selectedLaserIds
  const activeLaserId = hoveredLaserId ?? (selectedLaserIds.length ? selectedLaserIds[selectedLaserIds.length - 1] : null)
  const activePath = activeLaserId ? pathById.get(activeLaserId) : undefined

  const toggleLaser = (id: string) => {
    const isSelected = selectedLaserIds.includes(id)
    setSelectedLaserIds(current => isSelected ? current.filter(selectedId => selectedId !== id) : [...current, id])
    if (isSelected) setHoveredLaserId(current => current === id ? null : current)
  }
  const hoverLaser = (id: string) => setHoveredLaserId(id)
  const clearHover = (id: string) => setHoveredLaserId(current => current === id ? null : current)

  const cycleMirror = (row: number, col: number) => {
    const current = mirrors[row][col]
    const nextMirror: MirrorOrientation = current === 0 ? 1 : current === 1 ? 2 : 0
    if (current === 0 && isAdjacentMirror(mirrors, row, col)) {
      setNotice('Mirrors cannot be in orthogonally adjacent cells.')
      return
    }
    const nextBoard = copyMirrorBoard(mirrors)
    nextBoard[row][col] = nextMirror
    setUndoStack(previous => [...previous, copyMirrorBoard(mirrors)])
    setMirrors(nextBoard)
    setNotice(nextMirror === 0 ? 'Mirror removed.' : `Placed a ${nextMirror === 1 ? '/' : '\\'} mirror at R${row + 1}C${col + 1}.`)
  }

  const undo = () => {
    const previous = undoStack[undoStack.length - 1]
    if (!previous) return
    setMirrors(copyMirrorBoard(previous))
    setUndoStack(current => current.slice(0, -1))
    setNotice('Undid the last mirror change.')
  }

  const clearBoard = () => {
    const emptyBoard = createEmptyMirrorBoard(size)
    if (mirrors.every(row => row.every(mirror => mirror === 0))) return
    setUndoStack(previous => [...previous, copyMirrorBoard(mirrors)])
    setMirrors(emptyBoard)
    setNotice('Cleared all mirrors.')
  }

  const gridStyle: CSSProperties = {
    left: pointPercent(0, size),
    top: pointPercent(0, size),
    width: `${(size / (size + VIEW_MARGIN * 2)) * 100}%`,
    height: `${(size / (size + VIEW_MARGIN * 2)) * 100}%`,
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
  }

  return (
    <div className={`hm-game${theme === 'dark' ? ' dark' : ''}`}>
      <div className="hm-status-row" role="status">
        <strong>{matchedCount}/{cluePaths.length} clues matched</strong>
        <div className="hm-toolbar">
          <button type="button" className="hm-button" onClick={undo} disabled={undoStack.length === 0}>
            <Undo2 size={14} /> Undo
          </button>
          <button type="button" className="hm-button" onClick={clearBoard}>
            <RotateCcw size={14} /> Clear mirrors
          </button>
        </div>
      </div>
      {allCluesMatched && (
        <div className="hm-congratulations" role="status">
          <CheckCircle2 size={19} />
          <div className="hm-solution">
            <strong>Congratulations! Every laser clue matches.</strong>
            <div className="hm-answer-sums">
              {missingClueSideSums.map(({ side, sum }) => (
                <span key={side}>{side}: {sum?.toString() ?? 'loop'}</span>
              ))}
            </div>
            {missingClueAnswer !== null
              ? <p className="hm-answer-result">Jane Street answer: {missingClueSideSums.map(({ sum }) => sum!.toString()).join(' × ')} = <strong>{missingClueAnswer.toString()}</strong></p>
              : <p className="hm-answer-result">A missing-clue path loops, so the perimeter sums cannot be calculated.</p>}
          </div>
        </div>
      )}

      <div className="hm-game-layout">
        <section className="hm-board-section" aria-label={`${size} by ${size} Hall of Mirrors board`}>
          <div
            className="hm-board-frame"
            style={{ marginTop: `${50 / (size + VIEW_MARGIN * 2)}%` }}
          >
            <div className="hm-board-grid" role="grid" aria-label={`${size} by ${size} mirror grid`} style={gridStyle}>
              {mirrors.map((row, rowIndex) => row.map((mirror, colIndex) => {
                const blocked = mirror === 0 && isAdjacentMirror(mirrors, rowIndex, colIndex)
                const mirrorName = mirror === 0 ? 'no mirror' : mirror === 1 ? 'slash mirror' : 'backslash mirror'
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    role="gridcell"
                    className={`hm-cell${blocked ? ' is-blocked' : ''}`}
                    disabled={blocked}
                    aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, ${mirrorName}${blocked ? ', unavailable because it is next to a mirror' : '. Click to cycle.'}`}
                    title={blocked ? 'Mirrors cannot be orthogonally adjacent' : undefined}
                    onClick={() => cycleMirror(rowIndex, colIndex)}
                  >
                    {mirror !== 0 && (
                      <svg className="hm-mirror" viewBox="0 0 100 100" aria-hidden="true">
                        {mirror === 1
                          ? <line x1="12" y1="88" x2="88" y2="12" />
                          : <line x1="12" y1="12" x2="88" y2="88" />}
                      </svg>
                    )}
                  </button>
                )
              }))}
            </div>

            <svg
              className="hm-ray-overlay"
              viewBox={`${-VIEW_MARGIN} ${-VIEW_MARGIN} ${size + VIEW_MARGIN * 2} ${size + VIEW_MARGIN * 2}`}
              aria-hidden="true"
            >
              {paths.map(path => {
                const colorIndex = activeLaserIds.indexOf(path.laser.id)
                if (colorIndex === -1) return null
                return (
                  <polyline
                    key={path.laser.id}
                    points={path.points.map(([x, y]) => `${x},${y}`).join(' ')}
                    className="hm-ray is-active"
                    style={beamColorStyle(colorIndex)}
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}
            </svg>

            {lasers.map(laser => {
              if (laser.clue) return null
              const [x, y] = getDotPosition(laser, size)
              const colorIndex = activeLaserIds.indexOf(laser.id)
              const position: CSSProperties = {
                left: pointPercent(x, size),
                top: pointPercent(y, size),
                ...(colorIndex >= 0 ? beamColorStyle(colorIndex) : {}),
              }
              const active = colorIndex >= 0
              const selected = selectedLaserIds.includes(laser.id)
              return (
                <button
                  key={laser.id}
                  type="button"
                  aria-label={`${laser.side} laser ${laser.index + 1}${laser.clue ? `, clue ${laser.clue.target}` : ''}`}
                  aria-pressed={selected}
                  className={`hm-laser-dot${active ? ' is-active' : ''}${laser.clue && pathById.get(laser.id)?.product === BigInt(laser.clue.target) ? ' is-matched' : ''}`}
                  style={position}
                  onMouseEnter={() => hoverLaser(laser.id)}
                  onMouseLeave={() => clearHover(laser.id)}
                  onFocus={() => hoverLaser(laser.id)}
                  onBlur={() => clearHover(laser.id)}
                  onClick={() => toggleLaser(laser.id)}
                />
              )
            })}

            {paths.map(path => {
              const [x, y] = getProductPosition(path.laser, size)
              const colorIndex = activeLaserIds.indexOf(path.laser.id)
              const matched = path.laser.clue && path.product === BigInt(path.laser.clue.target)
              const position: CSSProperties = {
                left: pointPercent(x, size),
                top: pointPercent(y, size),
                ...(colorIndex >= 0 ? beamColorStyle(colorIndex) : {}),
              }
              return (
                <span
                  key={`product-${path.laser.id}`}
                  className={`hm-path-product${colorIndex >= 0 ? ' is-active' : ''}${matched ? ' is-matched' : ''}`}
                  style={position}
                  title={`${path.laser.side} laser ${path.laser.index + 1} current product: ${formatProduct(path)}`}
                >
                  {formatProduct(path)}
                </span>
              )
            })}

            {cluePaths.map(path => {
              const clue = path.laser.clue!
              const [x, y] = getDotPosition(path.laser, size)
              const matched = path.product === BigInt(clue.target)
              const colorIndex = activeLaserIds.indexOf(path.laser.id)
              const active = colorIndex >= 0
              const selected = selectedLaserIds.includes(path.laser.id)
              const position: CSSProperties = {
                left: pointPercent(x, size),
                top: pointPercent(y, size),
                ...(active ? beamColorStyle(colorIndex) : {}),
              }
              return (
                <button
                  type="button"
                  key={`clue-${path.laser.id}`}
                  aria-pressed={selected}
                  className={`hm-clue-label${matched ? ' is-matched' : ''}${active ? ' is-active' : ''}`}
                  style={position}
                  onClick={() => toggleLaser(path.laser.id)}
                  onMouseEnter={() => hoverLaser(path.laser.id)}
                  onMouseLeave={() => clearHover(path.laser.id)}
                  onFocus={() => hoverLaser(path.laser.id)}
                  onBlur={() => clearHover(path.laser.id)}
                  aria-label={`${path.laser.side} laser ${path.laser.index + 1}, clue ${clue.target}, current product ${formatProduct(path)}${matched ? ', matched' : ''}`}
                >
                  {clue.target}
                </button>
              )
            })}
          </div>
          <p className="hm-board-note">Click cells to cycle between no mirror, /, and \\. The value below each laser is its current path product; clue numbers replace their dots. Hover a laser to preview its path, or click its dot or clue to pin or hide it. Multiple paths can stay visible at once, using up to 20 colors. Gray cells cannot hold a mirror.</p>
        </section>

        <aside className="hm-controls">
          <section className="hm-panel">
            <h2>Laser clues</h2>
            <p className="hm-help">Each product is the path’s segment lengths multiplied together.</p>
            <div className="hm-clue-list">
              {cluePaths.map(path => {
                const clue = path.laser.clue!
                const matched = path.product === BigInt(clue.target)
                const colorIndex = activeLaserIds.indexOf(path.laser.id)
                const active = colorIndex >= 0
                const selected = selectedLaserIds.includes(path.laser.id)
                return (
                  <button
                    type="button"
                    key={path.laser.id}
                    aria-pressed={selected}
                    className={`hm-clue-row${matched ? ' is-matched' : ''}${active ? ' is-active' : ''}`}
                    style={active ? beamColorStyle(colorIndex) : undefined}
                    onClick={() => toggleLaser(path.laser.id)}
                    onMouseEnter={() => hoverLaser(path.laser.id)}
                    onMouseLeave={() => clearHover(path.laser.id)}
                    onFocus={() => hoverLaser(path.laser.id)}
                    onBlur={() => clearHover(path.laser.id)}
                  >
                    <span className="hm-clue-target">{path.laser.side} {path.laser.index + 1}: {clue.target}</span>
                    <span className="hm-clue-formula">{formatSegments(path)}</span>
                    {matched && <CheckCircle2 className="hm-check" size={16} />}
                  </button>
                )
              })}
            </div>
          </section>

          {activePath && (
            <section className="hm-panel hm-active-path" aria-live="polite">
              <h2>Highlighted path</h2>
              <p className="hm-help">
                {activePath.laser.side} laser {activePath.laser.index + 1}
                {activePath.laser.clue ? ` · target ${activePath.laser.clue.target}` : ' · no clue'}
              </p>
              <strong>{formatSegments(activePath)}</strong>
            </section>
          )}

          {notice && <p className="hm-notice" role="status">{notice}</p>}
        </aside>
      </div>
    </div>
  )
}
