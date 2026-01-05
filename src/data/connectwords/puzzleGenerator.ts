/**
 * Dynamic Puzzle Generator
 *
 * Generates puzzles on-the-fly from a curated database of lists.
 * For an n×n puzzle, selects n random lists that each have at least n items.
 */

import listsDb from './curated-lists.json'
import type { Puzzle, PuzzleGroup } from './puzzles'

interface ListItem {
  id: string
  name: string
  items: string[]
  count?: number
}

interface ListsDatabase {
  generated: string
  description: string
  lists: ListItem[]
}

interface DbStats {
  totalLists: number
  totalItems: number
  generated: string
  stats: {
    min: number
    max: number
    avg: number
  }
  availableFor: Record<number, number>
}

interface GenerateOptions {
  excludeIds?: string[]
  includeIds?: string[]
}

const db = listsDb as ListsDatabase

/**
 * Get all lists that have at least `minItems` items
 */
export function getEligibleLists(minItems: number): ListItem[] {
  return db.lists.filter(list => list.items.length >= minItems)
}

/**
 * Get database statistics
 */
export function getDbStats(): DbStats {
  const totalLists = db.lists.length
  const totalItems = db.lists.reduce((sum, l) => sum + l.items.length, 0)
  const counts = db.lists.map(l => l.items.length).sort((a, b) => a - b)

  return {
    totalLists,
    totalItems,
    generated: db.generated,
    stats: {
      min: counts[0],
      max: counts[counts.length - 1],
      avg: Math.round(totalItems / totalLists)
    },
    availableFor: {
      5: getEligibleLists(5).length,
      6: getEligibleLists(6).length,
      7: getEligibleLists(7).length,
      8: getEligibleLists(8).length,
      10: getEligibleLists(10).length,
      12: getEligibleLists(12).length,
      15: getEligibleLists(15).length,
      20: getEligibleLists(20).length,
      25: getEligibleLists(25).length
    }
  }
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Generate a color for a group based on index
 */
function generateColor(index: number, total: number): string {
  const hue = (index * (360 / total)) % 360
  return `hsl(${hue}, 70%, 80%)`
}

/**
 * Generate a random n×n puzzle
 */
export function generatePuzzle(n: number, options: GenerateOptions = {}): Puzzle | null {
  const { excludeIds = [], includeIds = [] } = options

  // Get eligible lists
  let eligible = getEligibleLists(n)

  // Filter out excluded lists
  if (excludeIds.length > 0) {
    eligible = eligible.filter(l => !excludeIds.includes(l.id))
  }

  // Check if we have enough lists
  if (eligible.length < n) {
    return null
  }

  // Start with required lists
  const selectedLists: ListItem[] = []
  for (const id of includeIds) {
    const list = eligible.find(l => l.id === id)
    if (list) {
      selectedLists.push(list)
      eligible = eligible.filter(l => l.id !== id)
    }
  }

  // Fill remaining slots with random lists
  const shuffled = shuffle(eligible)
  const remaining = n - selectedLists.length
  selectedLists.push(...shuffled.slice(0, remaining))

  // Shuffle the selected lists order
  const finalLists = shuffle(selectedLists)

  // Build the puzzle
  const groups: PuzzleGroup[] = finalLists.map((list, index) => {
    // Shuffle and take first n items from each list
    const shuffledItems = shuffle(list.items)
    const words = shuffledItems.slice(0, n)

    return {
      name: list.name,
      words: words,
      color: generateColor(index, n),
      sourceId: list.id
    }
  })

  return {
    id: Date.now(),
    title: `Generated Puzzle (${n}×${n})`,
    generated: true,
    size: n,
    groups
  }
}

/**
 * Get a list of all available list names with their item counts
 */
export function getAvailableLists(): Array<{ id: string; name: string; count: number }> {
  return db.lists.map(l => ({
    id: l.id,
    name: l.name,
    count: l.items.length
  }))
}

/**
 * Get maximum puzzle size available
 */
export function getMaxPuzzleSize(): number {
  const counts = db.lists.map(l => l.items.length)
  counts.sort((a, b) => b - a)

  // Find the largest n where we have at least n lists with n+ items
  for (let n = counts.length; n >= 5; n--) {
    const listsWithEnough = counts.filter(c => c >= n).length
    if (listsWithEnough >= n) {
      return n
    }
  }
  return 5
}
