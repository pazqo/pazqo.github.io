import { useTheme } from '../../context/ThemeContext'

interface SudokuCellProps {
  value: number | null
  isGiven: boolean
  isHighlighted?: boolean
  borderRight: number
  borderBottom: number
}

export default function SudokuCell({
  value,
  isGiven,
  isHighlighted = false,
  borderRight,
  borderBottom,
}: SudokuCellProps) {
  const { theme } = useTheme()

  return (
    <div
      className={`
        w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
        text-sm md:text-base font-medium
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
