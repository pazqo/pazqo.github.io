import { useTheme } from '../../context/ThemeContext'
import SudokuCell from './SudokuCell'

interface SudokuGridProps {
  puzzle: string // 81-character string, 0 for empty cells
  solution?: string // Optional solution for highlighting
  highlights?: number[] // Cell indices to highlight
}

export default function SudokuGrid({ puzzle, highlights = [] }: SudokuGridProps) {
  const { theme } = useTheme()

  // Parse puzzle string into 9x9 grid
  const cells = puzzle.split('').map((char, idx) => ({
    value: char === '0' ? null : parseInt(char, 10),
    index: idx,
    isGiven: char !== '0',
    isHighlighted: highlights.includes(idx),
  }))

  return (
    <div
      className={`grid grid-cols-9 gap-0 w-fit rounded-lg overflow-hidden shadow-shadow-2 ${
        theme === 'dark' ? 'bg-jet' : 'bg-gray-200'
      }`}
    >
      {cells.map((cell, idx) => {
        const row = Math.floor(idx / 9)
        const col = idx % 9

        // Determine border styles for 3x3 box divisions
        const borderRight = col === 2 || col === 5 ? 2 : 1
        const borderBottom = row === 2 || row === 5 ? 2 : 1

        return (
          <SudokuCell
            key={idx}
            value={cell.value}
            isGiven={cell.isGiven}
            isHighlighted={cell.isHighlighted}
            borderRight={borderRight}
            borderBottom={borderBottom}
          />
        )
      })}
    </div>
  )
}
