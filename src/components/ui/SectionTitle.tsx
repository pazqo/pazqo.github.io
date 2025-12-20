import { useTheme } from '../../context/ThemeContext'

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export default function SectionTitle({ children, className = '' }: SectionTitleProps) {
  const { theme } = useTheme()

  return (
    <h3 className={`text-fs-2 md:text-xl font-medium mb-5 ${
      theme === 'dark' ? 'text-white-2' : 'text-light-text'
    } ${className}`}>
      {children}
    </h3>
  )
}
