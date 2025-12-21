import { useMemo } from 'react'
import { useTheme } from '../../context/ThemeContext'
import SudokuCell from './SudokuCell'
import { decodeFPuzzles, fpuzzlesToGrid } from './fpuzzles'

interface SudokuGridProps {
  /**
   * Puzzle data - can be:
   * - 81-character string for 9x9 (0 = empty)
   * - f-puzzles URL (https://f-puzzles.com/?load=...)
   * - f-puzzles compressed data string
   */
  puzzle: string
  /** Optional title to display above the grid */
  title?: string
}

export default function SudokuGrid({ puzzle, title }: SudokuGridProps) {
  const { theme } = useTheme()

  const gridData = useMemo(() => {
    // Check if it's f-puzzles format
    if (puzzle.includes('f-puzzles.com') || puzzle.includes('sudokupad.app') || puzzle.length > 100) {
      const fpData = decodeFPuzzles(puzzle)
      if (fpData) {
        return fpuzzlesToGrid(fpData)
      }
    }

    // Simple string format (81 chars for 9x9, 36 for 6x6, etc.)
    const len = puzzle.replace(/[^0-9.]/g, '').length
    let size = 9
    if (len === 16) size = 4
    else if (len === 36) size = 6
    else if (len === 81) size = 9
    else if (len === 256) size = 16

    const cleanPuzzle = puzzle.replace(/[^0-9.]/g, '')
    const cells = cleanPuzzle.split('').map((char) => ({
      value: char === '0' || char === '.' ? null : parseInt(char, 10),
      isGiven: char !== '0' && char !== '.',
    }))

    return { size, cells }
  }, [puzzle])

  const { size, cells } = gridData

  // Calculate box size (for 9x9 it's 3x3, for 6x6 it's 2x3, for 4x4 it's 2x2)
  const boxWidth = size === 6 ? 3 : Math.sqrt(size)
  const boxHeight = size === 6 ? 2 : Math.sqrt(size)

  return (
    <div className="inline-block">
      {title && (
        <h4 className={`text-center text-fs-6 mb-2 font-medium ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          {title}
        </h4>
      )}
      <div
        className={`grid gap-0 w-fit rounded-lg overflow-hidden shadow-shadow-2 ${
          theme === 'dark' ? 'bg-jet' : 'bg-gray-200'
        }`}
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell, idx) => {
          const row = Math.floor(idx / size)
          const col = idx % size

          // Determine border styles for box divisions
          const borderRight = (col + 1) % boxWidth === 0 && col < size - 1 ? 2 : 1
          const borderBottom = (row + 1) % boxHeight === 0 && row < size - 1 ? 2 : 1

          return (
            <SudokuCell
              key={idx}
              value={cell.value}
              isGiven={cell.isGiven}
              borderRight={borderRight}
              borderBottom={borderBottom}
              size={size}
            />
          )
        })}
      </div>
    </div>
  )
}
