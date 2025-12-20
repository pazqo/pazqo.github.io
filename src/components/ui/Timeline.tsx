import { Book } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

interface TimelineProps {
  title: string
  children: React.ReactNode
}

export default function Timeline({ title, children }: TimelineProps) {
  const { theme } = useTheme()

  return (
    <section className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-shadow-1 ${
          theme === 'dark'
            ? 'bg-border-gradient-onyx text-orange-yellow-crayola'
            : 'bg-gray-100 text-light-accent'
        }`}>
          <Book className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <h3 className={`text-fs-2 md:text-xl font-medium ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          {title}
        </h3>
      </div>
      <ol className="ml-12 md:ml-16 text-fs-6">
        {children}
      </ol>
    </section>
  )
}
