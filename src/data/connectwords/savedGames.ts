import type { Puzzle, PuzzleGroup } from './puzzles'

export interface GridCell {
  word: string
  groupIndex: number
  groupName: string
  color?: string
  clusterId: number
  cellIndex: number
  solved?: boolean
}

export interface SavedGame {
  id: string
  puzzle: Puzzle
  grid: GridCell[]
  clusters: Record<number, number[]>
  clusterColors: Record<number, string>
  clusterLabels?: Record<number, string>
  solvedGroups: (PuzzleGroup & { groupIndex: number })[]
  nextClusterId: number
  nextColorIndex: number
  isComplete: boolean
  savedAt: number
}

const STORAGE_KEY = 'connectwords-saved-games'

export function getSavedGames(): SavedGame[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Invalid data
  }
  return []
}

export function saveGame(game: SavedGame): void {
  const games = getSavedGames()
  const existingIndex = games.findIndex(g => g.id === game.id)

  if (existingIndex >= 0) {
    games[existingIndex] = game
  } else {
    games.unshift(game) // Add to beginning
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

export function deleteSavedGame(id: string): void {
  const games = getSavedGames().filter(g => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

export function generateGameId(puzzle: Puzzle): string {
  // For preset puzzles, use the puzzle id
  // For generated puzzles, create a unique id based on timestamp and title
  if (!puzzle.generated) {
    return `preset-${puzzle.id}`
  }
  return `gen-${puzzle.id}`
}

export function findSavedGame(gameId: string): SavedGame | undefined {
  return getSavedGames().find(g => g.id === gameId)
}
