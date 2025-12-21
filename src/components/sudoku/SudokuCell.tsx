import { useTheme } from '../../context/ThemeContext'

interface SudokuCellProps {
  value: number | null
  isGiven: boolean
  isHighlighted?: boolean
  borderRight: number
  borderBottom: number
  size?: number
}

export default function SudokuCell({
  value,
  isGiven,
  isHighlighted = false,
  borderRight,
  borderBottom,
  size = 9,
}: SudokuCellProps) {
  const { theme } = useTheme()

  // Adjust cell size based on grid size
  const cellSize = size <= 6 ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8 md:w-10 md:h-10'
  const fontSize = size <= 6 ? 'text-base md:text-lg' : 'text-sm md:text-base'

  return (
    <div
      className={`
        ${cellSize} flex items-center justify-center
        ${fontSize} font-medium
        ${theme === 'dark' ? 'bg-eerie-black-2' : 'bg-white'}
        ${isHighlighted
          ? theme === 'dark'
            ? 'bg-orange-yellow-crayola/20'
            : 'bg-yellow-100'
          : ''
        }
        ${isGiven
          ? theme === 'dark'
            ? 'text-white-2'
            : 'text-light-text font-semibold'
          : theme === 'dark'
            ? 'text-vegas-gold'
            : 'text-light-accent'
        }
      `}
      style={{
        borderRight: `${borderRight}px solid ${theme === 'dark' ? 'hsl(220, 20%, 22%)' : '#d1d5db'}`,
        borderBottom: `${borderBottom}px solid ${theme === 'dark' ? 'hsl(220, 20%, 22%)' : '#d1d5db'}`,
      }}
    >
      {value || ''}
    </div>
  )
}
