import { useTheme } from '../../context/ThemeContext'

interface SudokuEmbedProps {
  /**
   * Puzzle source - can be:
   * - SudokuPad URL: https://sudokupad.app/xxxxx
   * - SudokuPad puzzle ID: xxxxx
   * - f-puzzles URL: https://f-puzzles.com/?load=xxxxx (will convert to SudokuPad)
   * - Penpa URL: https://swaroopg92.github.io/penpa-edit/... (will convert to SudokuPad)
   */
  puzzle: string
  /** Title displayed above the embed */
  title?: string
  /** Height of the embed (default: 600px) */
  height?: number
}

function extractPuzzleId(input: string): string {
  const trimmed = input.trim()

  // Already a SudokuPad URL
  if (trimmed.includes('sudokupad.app')) {
    // Extract the puzzle ID from various SudokuPad URL formats
    // https://sudokupad.app/abc123
    // https://sudokupad.app/fpuzzles/abc123
    const match = trimmed.match(/sudokupad\.app\/(?:fpuzzles\/)?([^?&#]+)/)
    if (match) return match[1]
  }

  // f-puzzles URL - SudokuPad can load these via fpuzzles prefix
  if (trimmed.includes('f-puzzles.com')) {
    const match = trimmed.match(/[?&]load=([^&]+)/)
    if (match) return `fpuzzles${match[1]}`
  }

  // Penpa URL - SudokuPad can load these via penpa prefix
  if (trimmed.includes('penpa')) {
    const match = trimmed.match(/[?#]m=([^&]+)/)
    if (match) return `penpa${match[1]}`
  }

  // Assume it's already a puzzle ID or encoded data
  return trimmed
}

export default function SudokuEmbed({ puzzle, title, height = 600 }: SudokuEmbedProps) {
  const { theme } = useTheme()
  const puzzleId = extractPuzzleId(puzzle)

  // Build SudokuPad embed URL
  const embedUrl = `https://sudokupad.app/${puzzleId}`

  return (
    <div className="w-full">
      {title && (
        <h4 className={`text-center text-fs-6 mb-2 font-medium ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          {title}
        </h4>
      )}
      <div
        className={`w-full rounded-lg overflow-hidden shadow-shadow-2 ${
          theme === 'dark' ? 'bg-jet' : 'bg-gray-200'
        }`}
      >
        <iframe
          src={embedUrl}
          title={title || 'Sudoku Puzzle'}
          width="100%"
          height={height}
          style={{ border: 'none' }}
          allow="clipboard-write"
        />
      </div>
      <p className={`text-center text-fs-8 mt-2 ${
        theme === 'dark' ? 'text-light-gray-70' : 'text-light-muted'
      }`}>
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-yellow-crayola hover:underline"
        >
          Open in SudokuPad
        </a>
      </p>
    </div>
  )
}
