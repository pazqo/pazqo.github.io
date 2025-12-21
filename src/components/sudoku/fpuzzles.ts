import LZString from 'lz-string'

export interface FPuzzlesCell {
  value?: number
  given?: boolean
  centerPencilMarks?: number[]
  cornerPencilMarks?: number[]
}

export interface FPuzzlesData {
  size: number
  grid: FPuzzlesCell[][]
  title?: string
  author?: string
  ruleset?: string
}

/**
 * Decode f-puzzles compressed data from URL or raw string
 * Supports both full URLs (https://f-puzzles.com/?load=...) and just the compressed data
 */
export function decodeFPuzzles(input: string): FPuzzlesData | null {
  try {
    let compressed = input.trim()

    // Extract from URL if needed
    if (compressed.includes('f-puzzles.com')) {
      const match = compressed.match(/[?&]load=([^&]+)/)
      if (match) {
        compressed = match[1]
      } else {
        return null
      }
    }

    // Also support sudokupad URLs
    if (compressed.includes('sudokupad.app')) {
      const match = compressed.match(/sudokupad\.app\/([^?]+)/)
      if (match) {
        compressed = match[1]
      }
    }

    // Decode the lz-string compressed data
    const jsonString = LZString.decompressFromBase64(compressed)
    if (!jsonString) {
      return null
    }

    const data = JSON.parse(jsonString)

    return {
      size: data.size || 9,
      grid: data.grid || [],
      title: data.title,
      author: data.author,
      ruleset: data.ruleset,
    }
  } catch (e) {
    console.error('Failed to decode f-puzzles data:', e)
    return null
  }
}

/**
 * Convert f-puzzles grid to simple format for rendering
 */
export function fpuzzlesToGrid(data: FPuzzlesData): {
  size: number
  cells: { value: number | null; isGiven: boolean }[]
} {
  const cells: { value: number | null; isGiven: boolean }[] = []

  for (let row = 0; row < data.size; row++) {
    for (let col = 0; col < data.size; col++) {
      const cell = data.grid[row]?.[col] || {}
      cells.push({
        value: cell.value || null,
        isGiven: cell.given || false,
      })
    }
  }

  return { size: data.size, cells }
}
