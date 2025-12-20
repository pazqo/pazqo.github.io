import { useTheme } from '../../context/ThemeContext'

interface ArticleTitleProps {
  children: React.ReactNode
}

export default function ArticleTitle({ children }: ArticleTitleProps) {
  const { theme } = useTheme()

  return (
    <h2 className={`text-fs-1 md:text-2xl font-semibold mb-4 md:mb-8 pb-2 relative ${
      theme === 'dark' ? 'text-white-2' : 'text-light-text'
    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-1 after:bg-gradient-yellow after:rounded`}>
      {children}
    </h2>
  )
}
