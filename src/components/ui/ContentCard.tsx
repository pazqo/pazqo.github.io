import { useTheme } from '../../context/ThemeContext'

interface ContentCardProps {
  children: React.ReactNode
  className?: string
}

export default function ContentCard({ children, className = '' }: ContentCardProps) {
  const { theme } = useTheme()

  return (
    <div className={`relative rounded-14 p-4 pt-6 shadow-shadow-2 ${
      theme === 'dark'
        ? 'bg-border-gradient-onyx'
        : 'bg-white border border-gray-100'
    } ${className}`}>
      <div className={`absolute inset-[1px] rounded-14 -z-10 ${
        theme === 'dark' ? 'bg-gradient-jet' : 'bg-white'
      }`} />
      {children}
    </div>
  )
}
