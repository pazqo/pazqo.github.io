import { useTheme } from '../../context/ThemeContext'

interface SpoilerProps {
  /** The clickable title/header text */
  title?: string
  /** Content to reveal when expanded */
  children: React.ReactNode
}

export default function Spoiler({ title = 'Click to reveal', children }: SpoilerProps) {
  const { theme } = useTheme()

  return (
    <details
      className={`my-4 rounded-lg overflow-hidden border ${
        theme === 'dark'
          ? 'bg-jet/50 border-white-2/20'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <summary
        className={`px-4 py-3 cursor-pointer select-none font-medium flex items-center gap-2 ${
          theme === 'dark'
            ? 'text-orange-yellow-crayola hover:bg-white-1/10'
            : 'text-light-accent hover:bg-gray-100'
        }`}
      >
        <svg
          className="w-4 h-4 transition-transform duration-200 details-chevron"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {title}
      </summary>
      <div
        className={`px-4 py-3 border-t ${
          theme === 'dark'
            ? 'border-white-2/20 text-light-gray'
            : 'border-gray-200 text-light-text'
        }`}
      >
        {children}
      </div>
    </details>
  )
}
