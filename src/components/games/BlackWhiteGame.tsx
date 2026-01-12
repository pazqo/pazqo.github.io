import { useState, useEffect, useCallback } from 'react'
import { Undo2, RotateCcw, Shuffle, HelpCircle, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import '../../styles/blackwhite.css'

type CellValue = 'black' | 'white' | 'frame'
type Position = { row: number; col: number }

interface BlackWhiteGameProps {
  initialSize?: number
}

export default function BlackWhiteGame({ initialSize = 4 }: BlackWhiteGameProps) {
  const { theme } = useTheme()
  const [boardSize, setBoardSize] = useState(initialSize)
  const [board, setBoard] = useState<CellValue[][]>([])
  const [originalBoard, setOriginalBoard] = useState<CellValue[][]>([])
  const [path, setPath] = useState<Position[]>([])
  const [currentPos, setCurrentPos] = useState<Position | null>(null)
  const [startPos, setStartPos] = useState<Position | null>(null)
  const [gameWon, setGameWon] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genInfo, setGenInfo] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  const totalSize = boardSize + 2
  const cellSize = 50
  const gap = 2
  const padding = 2

  const isFrame = useCallback((row: number, col: number) => {
    return row === 0 || row === totalSize - 1 || col === 0 || col === totalSize - 1
  }, [totalSize])

  const isInner = useCallback((row: number, col: number) => {
    return !isFrame(row, col)
  }, [isFrame])

  const isInPath = useCallback((row: number, col: number) => {
    return path.some(p => p.row === row && p.col === col)
  }, [path])

  const isAdjacent = (pos1: Position, pos2: Position) => {
    const dr = Math.abs(pos1.row - pos2.row)
    const dc = Math.abs(pos1.col - pos2.col)
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1)
  }

  // Win condition check
  const checkWin = useCallback((boardState: CellValue[][]) => {
    // Check if all columns are single-colored
    let allColumnsSingleColor = true
    for (let col = 1; col <= boardSize; col++) {
      const firstColor = boardState[1][col]
      for (let row = 2; row <= boardSize; row++) {
        if (boardState[row][col] !== firstColor) {
          allColumnsSingleColor = false
          break
        }
      }
      if (!allColumnsSingleColor) break
    }

    // Check if all rows are single-colored
    let allRowsSingleColor = true
    for (let row = 1; row <= boardSize; row++) {
      const firstColor = boardState[row][1]
      for (let col = 2; col <= boardSize; col++) {
        if (boardState[row][col] !== firstColor) {
          allRowsSingleColor = false
          break
        }
      }
      if (!allRowsSingleColor) break
    }

    return allColumnsSingleColor || allRowsSingleColor
  }, [boardSize])

  // Board generation: guaranteed solvable by construction
  // 1. Start with all white grid
  // 2. Generate a valid path through the grid
  // 3. Flip cells along the path
  // 4. Flip some random rows

  const generateSolvableBoard = useCallback((size: number): CellValue[][] => {
    const total = size + 2

    // Initialize board: frame cells and all-white inner cells
    const board: CellValue[][] = []
    for (let row = 0; row < total; row++) {
      board[row] = []
      for (let col = 0; col < total; col++) {
        if (row === 0 || row === total - 1 || col === 0 || col === total - 1) {
          board[row][col] = 'frame'
        } else {
          board[row][col] = 'white'
        }
      }
    }

    // Generate a random valid path through inner cells
    const pathCells = generateRandomPath(size)

    // Flip all inner cells along the path
    for (const pos of pathCells) {
      if (pos.row >= 1 && pos.row <= size && pos.col >= 1 && pos.col <= size) {
        board[pos.row][pos.col] = board[pos.row][pos.col] === 'white' ? 'black' : 'white'
      }
    }

    // Flip some random rows to add variety
    const numRowsToFlip = Math.floor(Math.random() * size)
    const rowsToFlip = new Set<number>()
    while (rowsToFlip.size < numRowsToFlip) {
      rowsToFlip.add(1 + Math.floor(Math.random() * size))
    }

    for (const row of rowsToFlip) {
      for (let col = 1; col <= size; col++) {
        board[row][col] = board[row][col] === 'white' ? 'black' : 'white'
      }
    }

    setGenInfo(`Generated puzzle with path length ${pathCells.length}`)
    return board
  }, [])

  // Generate a random path that enters from frame, visits inner cells, and can exit
  const generateRandomPath = (size: number): Position[] => {
    const total = size + 2
    const visited = new Set<string>()
    const path: Position[] = []

    // Helper to check if position is inner cell
    const isInnerCell = (row: number, col: number) =>
      row >= 1 && row <= size && col >= 1 && col <= size

    // Helper to check if position is frame cell
    const isFrameCell = (row: number, col: number) =>
      row === 0 || row === total - 1 || col === 0 || col === total - 1

    // Helper to get valid neighbors
    const getNeighbors = (row: number, col: number): Position[] => {
      const neighbors: Position[] = []
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const [dr, dc] of dirs) {
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < total && nc >= 0 && nc < total) {
          neighbors.push({ row: nr, col: nc })
        }
      }
      return neighbors
    }

    // Pick a random starting frame cell (not corners)
    const frameStarts: Position[] = []
    for (let i = 1; i <= size; i++) {
      frameStarts.push({ row: 0, col: i })           // top
      frameStarts.push({ row: total - 1, col: i })   // bottom
      frameStarts.push({ row: i, col: 0 })           // left
      frameStarts.push({ row: i, col: total - 1 })   // right
    }

    const start = frameStarts[Math.floor(Math.random() * frameStarts.length)]
    let current = start
    visited.add(`${current.row},${current.col}`)

    // Random walk: try to visit inner cells
    const minPathLength = Math.max(3, Math.floor(size * size * 0.3))
    const maxPathLength = size * size
    let innerCellsVisited = 0

    while (innerCellsVisited < maxPathLength) {
      const neighbors = getNeighbors(current.row, current.col)

      // Filter to unvisited neighbors
      const unvisited = neighbors.filter(n => !visited.has(`${n.row},${n.col}`))

      if (unvisited.length === 0) break

      // Prefer inner cells, but allow frame cells occasionally for exit
      const innerNeighbors = unvisited.filter(n => isInnerCell(n.row, n.col))
      const frameNeighbors = unvisited.filter(n => isFrameCell(n.row, n.col))

      let next: Position

      if (innerNeighbors.length > 0 && (innerCellsVisited < minPathLength || Math.random() > 0.3)) {
        // Pick random inner neighbor
        next = innerNeighbors[Math.floor(Math.random() * innerNeighbors.length)]
        innerCellsVisited++
        path.push(next)
      } else if (frameNeighbors.length > 0 && innerCellsVisited >= minPathLength) {
        // Exit to frame - we're done
        break
      } else if (innerNeighbors.length > 0) {
        next = innerNeighbors[Math.floor(Math.random() * innerNeighbors.length)]
        innerCellsVisited++
        path.push(next)
      } else {
        break
      }

      visited.add(`${next!.row},${next!.col}`)
      current = next!
    }

    return path
  }

  const generateNewBoard = useCallback(() => {
    setGenerating(true)
    setGenInfo('')

    const newBoard = generateSolvableBoard(boardSize)

    setBoard(newBoard)
    setOriginalBoard(newBoard.map(row => [...row]))
    setPath([])
    setCurrentPos(null)
    setStartPos(null)
    setGameWon(false)
    setGenerating(false)
  }, [boardSize, generateSolvableBoard])

  const handleCellClick = (row: number, col: number) => {
    if (gameWon || generating) return

    // If no path started and clicking on frame, set as starting point
    if (!startPos && isFrame(row, col)) {
      setStartPos({ row, col })
      setCurrentPos({ row, col })
      setPath([])
      setBoard(originalBoard.map(r => [...r]))
      return
    }

    // If path started and clicking on a frame cell (to reset starting point)
    if (isFrame(row, col) && path.length === 0) {
      setStartPos({ row, col })
      setCurrentPos({ row, col })
      setBoard(originalBoard.map(r => [...r]))
      return
    }

    // If we have a current position, try to move
    if (currentPos) {
      const targetPos = { row, col }

      // Check if adjacent and not already in path
      if (isAdjacent(currentPos, targetPos) && !isInPath(row, col)) {
        // Don't allow returning to start position
        if (startPos && startPos.row === row && startPos.col === col) {
          return
        }

        const newBoard = board.map(r => [...r])
        if (isInner(row, col)) {
          newBoard[row][col] = newBoard[row][col] === 'black' ? 'white' : 'black'
        }

        const newPath = [...path, { row, col }]
        setBoard(newBoard)
        setPath(newPath)
        setCurrentPos({ row, col })

        if (checkWin(newBoard)) {
          setGameWon(true)
        }
      }
    }
  }

  const restart = () => {
    setBoard(originalBoard.map(r => [...r]))
    setPath([])
    setCurrentPos(startPos ? { ...startPos } : null)
    setGameWon(false)
  }

  const undoMove = () => {
    if (path.length > 0 && !gameWon) {
      const newPath = [...path]
      const lastPos = newPath.pop()!

      const newBoard = board.map(r => [...r])
      if (isInner(lastPos.row, lastPos.col)) {
        newBoard[lastPos.row][lastPos.col] =
          newBoard[lastPos.row][lastPos.col] === 'black' ? 'white' : 'black'
      }

      setBoard(newBoard)
      setPath(newPath)
      setCurrentPos(newPath.length > 0 ? newPath[newPath.length - 1] : startPos)
    }
  }

  const handleSizeChange = (newSize: number) => {
    const clampedSize = Math.max(3, Math.min(8, newSize))
    if (clampedSize !== boardSize) {
      setBoardSize(clampedSize)
    }
  }

  // Regenerate board when size changes
  useEffect(() => {
    generateNewBoard()
  }, [boardSize]) // eslint-disable-line react-hooks/exhaustive-deps

  // Get cell center for SVG path
  const getCellCenter = (row: number, col: number) => {
    const x = padding + col * (cellSize + gap) + cellSize / 2
    const y = padding + row * (cellSize + gap) + cellSize / 2
    return { x, y }
  }

  // Build full path for SVG
  const fullPath = startPos ? [startPos, ...path] : path

  // SVG dimensions
  const svgSize = totalSize * cellSize + (totalSize - 1) * gap + padding * 2

  // Theme-aware classes
  const buttonClass = theme === 'dark'
    ? 'bg-jet hover:bg-eerie-black-1 text-white-2 border-jet'
    : 'bg-gray-100 hover:bg-gray-200 text-light-text border-gray-300'
  const primaryButtonClass = theme === 'dark'
    ? 'bg-orange-yellow-crayola hover:bg-orange-yellow-crayola/80 text-eerie-black-1'
    : 'bg-orange-yellow-crayola hover:bg-orange-yellow-crayola/80 text-white'
  const inputClass = theme === 'dark'
    ? 'bg-eerie-black-2 border-jet text-white-2 focus:border-orange-yellow-crayola'
    : 'bg-white border-gray-300 text-light-text focus:border-orange-yellow-crayola'
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  return (
    <div className={`bw-game ${theme}`}>
      {/* Controls */}
      <div className={`bw-controls p-4 rounded-lg mb-4 ${
        theme === 'dark' ? 'bg-eerie-black-2' : 'bg-gray-50'
      }`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className={`text-fs-7 font-medium ${textClass}`}>Size:</label>
            <input
              type="number"
              min="3"
              max="8"
              value={boardSize}
              onChange={(e) => handleSizeChange(parseInt(e.target.value) || 4)}
              className={`w-16 p-2 rounded border text-fs-7 text-center outline-none transition-colors ${inputClass}`}
            />
          </div>
          <button
            onClick={generateNewBoard}
            disabled={generating}
            className={`px-4 py-2 rounded text-fs-7 font-medium transition-colors flex items-center gap-2 ${primaryButtonClass} disabled:opacity-50`}
          >
            <Shuffle size={16} />
            {generating ? 'Generating...' : 'New Board'}
          </button>
          <button
            onClick={restart}
            disabled={generating}
            className={`px-3 py-2 rounded text-fs-7 transition-colors flex items-center gap-2 border ${buttonClass}`}
          >
            <RotateCcw size={16} />
            Restart
          </button>
          <button
            onClick={undoMove}
            disabled={generating || path.length === 0 || gameWon}
            className={`px-3 py-2 rounded text-fs-7 transition-colors flex items-center gap-2 border ${buttonClass} disabled:opacity-50`}
          >
            <Undo2 size={16} />
            Undo
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className={`px-3 py-2 rounded text-fs-7 transition-colors flex items-center gap-2 border ${buttonClass}`}
          >
            <HelpCircle size={16} />
          </button>
        </div>
        {genInfo && (
          <p className={`text-fs-8 mt-2 ${textClass}`}>{genInfo}</p>
        )}
      </div>

      {/* Status */}
      <div className={`bw-status mb-4 p-3 rounded-lg text-center font-medium ${
        gameWon
          ? 'bg-green-500 text-white'
          : generating
          ? 'bg-orange-400 text-white'
          : theme === 'dark'
          ? 'bg-jet text-white-2'
          : 'bg-gray-100 text-light-text'
      }`}>
        {gameWon
          ? 'You Win!'
          : generating
          ? 'Generating solvable board...'
          : !startPos
          ? 'Click a frame cell to start'
          : 'Build your path by clicking adjacent cells'}
      </div>

      {/* Board */}
      <div className="bw-board-wrapper flex justify-center">
        <div className="bw-board-container relative" style={{ width: svgSize, height: svgSize }}>
          <div
            className={`bw-board grid ${theme === 'dark' ? 'bg-jet' : 'bg-gray-400'}`}
            style={{
              gridTemplateColumns: `repeat(${totalSize}, ${cellSize}px)`,
              gap: `${gap}px`,
              padding: `${padding}px`,
              borderRadius: '8px'
            }}
          >
            {board.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isFrameCell = isFrame(rowIdx, colIdx)
                const isStart = startPos && startPos.row === rowIdx && startPos.col === colIdx
                const isCurrent = currentPos && currentPos.row === rowIdx && currentPos.col === colIdx
                const isVisited = isInPath(rowIdx, colIdx)

                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    className={`bw-cell ${
                      isFrameCell ? 'bw-cell-frame' : `bw-cell-inner bw-cell-${cell}`
                    } ${isStart ? 'bw-cell-start' : ''} ${
                      isCurrent && path.length > 0 ? 'bw-cell-current' : ''
                    } ${isVisited && !isStart ? 'bw-cell-visited' : ''} ${theme}`}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {isStart && 'S'}
                  </div>
                )
              })
            )}
          </div>

          {/* Path SVG overlay */}
          <svg
            className="bw-path-svg absolute top-0 left-0 pointer-events-none"
            width={svgSize}
            height={svgSize}
            style={{ zIndex: 10 }}
          >
          {/* Starting dot */}
          {fullPath.length > 0 && (
            <circle
              cx={getCellCenter(fullPath[0].row, fullPath[0].col).x}
              cy={getCellCenter(fullPath[0].row, fullPath[0].col).y}
              r={8}
              className="bw-path-dot"
            />
          )}

          {/* Path line */}
          {fullPath.length > 1 && (
            <path
              d={fullPath.map((pos, i) => {
                const center = getCellCenter(pos.row, pos.col)
                return `${i === 0 ? 'M' : 'L'}${center.x},${center.y}`
              }).join(' ')}
              className="bw-path-line"
            />
          )}

          {/* Current position dot */}
          {fullPath.length > 0 && (
            <circle
              cx={getCellCenter(fullPath[fullPath.length - 1].row, fullPath[fullPath.length - 1].col).x}
              cy={getCellCenter(fullPath[fullPath.length - 1].row, fullPath[fullPath.length - 1].col).y}
              r={6}
              fill="#ffd700"
              stroke="var(--bw-accent)"
              strokeWidth={2}
            />
          )}
        </svg>
        </div>
      </div>

      {/* Path info */}
      <p className={`text-fs-7 mt-4 ${textClass}`}>
        Path length: {path.length}
      </p>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-lg p-6 ${
            theme === 'dark' ? 'bg-eerie-black-2' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-fs-4 font-bold ${
                theme === 'dark' ? 'text-white-2' : 'text-light-text'
              }`}>How to Play</h3>
              <button
                onClick={() => setShowHelp(false)}
                className={`p-1 rounded hover:bg-jet/50 ${textClass}`}
              >
                <X size={20} />
              </button>
            </div>
            <div className={`space-y-3 text-fs-7 ${textClass}`}>
              <p><strong className={theme === 'dark' ? 'text-white-2' : 'text-light-text'}>Goal:</strong> Create a path through the board such that each column OR each row becomes a single color (all black or all white).</p>
              <p><strong className={theme === 'dark' ? 'text-white-2' : 'text-light-text'}>How to play:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click a gray frame cell to start your path</li>
                <li>Click adjacent cells to extend your path</li>
                <li>Inner cells flip color when visited</li>
                <li>You can move through the frame to exit and re-enter</li>
                <li>No cell can be crossed twice</li>
              </ul>
              <p><strong className={theme === 'dark' ? 'text-white-2' : 'text-light-text'}>Tip:</strong> All generated boards are solvable!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
