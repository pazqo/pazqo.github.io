export const DEFAULT_NATION_BOARD_SIZE = 11

export type NationPuzzleId = 'example' | 'large'
export type NationPuzzleDefinition = {
  id: NationPuzzleId
  label: string
  size: number
  clues: Record<string, number>
}

export type NationBoard = number[][]
export type NationCell = { row: number; col: number }
export type NationAnalysis = {
  size: number
  connected: boolean
  capital: NationCell | null
  invalidSymmetry: boolean
  description: string
}
export type NationAnalysisById = Record<number, NationAnalysis>
const LARGE_PUZZLE_CLUES: Record<string, number> = {
  '1,2': 8, '1,3': 4, '1,6': 11, '1,10': 5,
  '2,8': 11, '3,3': 7, '3,6': 1, '3,11': 14,
  '4,1': 28, '4,4': 51, '4,7': 1, '4,9': 6, '5,2': 22, '5,9': 4, '5,11': 1,
  '6,4': 15, '6,6': 10, '6,8': 0, '7,1': 11, '7,3': 11,
  '7,10': 9, '8,3': 17, '8,5': 14, '8,8': 10, '8,11': 13, '9,1': 30,
  '9,6': 6, '9,9': 45, '11,2': 26, '11,6': 0, '11,9': 77, '11,10': 61,
}

const EXAMPLE_PUZZLE_CLUES: Record<string, number> = {
  '1,1': 12, '1,5': 17,
  '2,1': 8, '2,3': 6, '2,4': 3,
  '4,2': 7, '4,3': 6, '4,5': 10,
  '5,1': 25, '5,5': 0,
}

export const NATION_PUZZLES: Record<NationPuzzleId, NationPuzzleDefinition> = {
  example: { id: 'example', label: 'Example puzzle', size: 5, clues: EXAMPLE_PUZZLE_CLUES },
  large: { id: 'large', label: 'Large puzzle', size: DEFAULT_NATION_BOARD_SIZE, clues: LARGE_PUZZLE_CLUES },
}

export function createEmptyNationBoard(size = DEFAULT_NATION_BOARD_SIZE): NationBoard {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

export function nationCellKey(row: number, col: number) {
  return row * 20 + col
}

function getNationCells(board: NationBoard, id: number) {
  const cells: NationCell[] = []
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === id) cells.push({ row, col })
    }
  }
  return cells
}

const SYMMETRIES: ((row: number, col: number) => [number, number])[] = [
  (row, col) => [row, col],
  (row, col) => [-col, row],
  (row, col) => [-row, -col],
  (row, col) => [col, -row],
  (row, col) => [-row, col],
  (row, col) => [row, -col],
  (row, col) => [col, row],
  (row, col) => [-col, -row],
]

export function analyzeNation(board: NationBoard, id: number): NationAnalysis {
  const cells = getNationCells(board, id)
  if (!cells.length) {
    return { size: 0, connected: false, capital: null, invalidSymmetry: false, description: 'empty' }
  }

  const cellSet = new Set(cells.map(({ row, col }) => nationCellKey(row, col)))
  const seen = new Set([nationCellKey(cells[0].row, cells[0].col)])
  const queue = [cells[0]]
  while (queue.length) {
    const { row, col } = queue.pop()!
    for (const [rowStep, colStep] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nextRow = row + rowStep
      const nextCol = col + colStep
      const key = nationCellKey(nextRow, nextCol)
      if (cellSet.has(key) && !seen.has(key)) {
        seen.add(key)
        queue.push({ row: nextRow, col: nextCol })
      }
    }
  }

  const connected = seen.size === cells.length
  const rows = cells.map(cell => cell.row)
  const cols = cells.map(cell => cell.col)

  for (let centerRow = 2 * Math.min(...rows); centerRow <= 2 * Math.max(...rows); centerRow++) {
    for (let centerCol = 2 * Math.min(...cols); centerCol <= 2 * Math.max(...cols); centerCol++) {
      const fixedPoints: NationCell[][] = []
      for (let operation = 1; operation < SYMMETRIES.length; operation++) {
        let valid = true
        const fixed: NationCell[] = []
        for (const { row, col } of cells) {
          const [transformedRow, transformedCol] = SYMMETRIES[operation](2 * row - centerRow, 2 * col - centerCol)
          const targetRow = (centerRow + transformedRow) / 2
          const targetCol = (centerCol + transformedCol) / 2
          if (!Number.isInteger(targetRow) || !Number.isInteger(targetCol)
            || !cellSet.has(nationCellKey(targetRow, targetCol))) {
            valid = false
            break
          }
          if (targetRow === row && targetCol === col) fixed.push({ row, col })
        }
        if (valid) fixedPoints.push(fixed)
      }

      if (fixedPoints.length) {
        const firstFixed = fixedPoints[0][0]
        const hasCapital = fixedPoints.every(points => points.length === 1
          && points[0].row === firstFixed.row && points[0].col === firstFixed.col)
        const capital = hasCapital ? firstFixed : null
        const description = `${connected ? '' : 'DISCONNECTED, '}${capital
          ? `capitol (${capital.row + 1},${capital.col + 1})`
          : 'symmetric, no capitol'}`
        return { size: cells.length, connected, capital, invalidSymmetry: false, description }
      }
    }
  }

  return {
    size: cells.length,
    connected,
    capital: null,
    invalidSymmetry: true,
    description: `${connected ? '' : 'DISCONNECTED, '}NOT symmetric`,
  }
}

export function computeNationCosts(board: NationBoard, info: NationAnalysisById) {
  const size = board.length
  const costs = Array.from({ length: size }, () => Array(size).fill(Infinity))
  const done = Array.from({ length: size }, () => Array(size).fill(false))
  for (const analysis of Object.values(info)) {
    if (analysis.capital && analysis.connected) {
      costs[analysis.capital.row][analysis.capital.col] = 0
    }
  }

  for (;;) {
    let best: NationCell | null = null
    let bestCost = Infinity
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!done[row][col] && costs[row][col] < bestCost) {
          bestCost = costs[row][col]
          best = { row, col }
        }
      }
    }
    if (!best) break
    const { row, col } = best
    done[row][col] = true
    for (const [rowStep, colStep] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nextRow = row + rowStep
      const nextCol = col + colStep
      if (nextRow < 0 || nextCol < 0 || nextRow >= size || nextCol >= size
        || !board[nextRow][nextCol]) continue
      const fromId = board[row][col]
      const toId = board[nextRow][nextCol]
      const fromInfo = info[fromId]
      const toInfo = info[toId]
      if (!fromInfo || !toInfo) continue
      const stepCost = fromId === toId ? fromInfo.size : Math.min(fromInfo.size, toInfo.size)
      const nextCost = bestCost + stepCost
      if (nextCost < costs[nextRow][nextCol]) costs[nextRow][nextCol] = nextCost
    }
  }
  return costs
}
