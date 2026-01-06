import { useTheme } from '../../context/ThemeContext'

interface TimelineProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

export default function Timeline({ title, icon, children }: TimelineProps) {
  const { theme } = useTheme()

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-orange-yellow-crayola">
          {icon}
        </div>
        <h3 className={`text-fs-2 md:text-xl font-medium ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          {title}
        </h3>
      </div>
      <ol className="ml-9 md:ml-10 text-fs-6">
        {children}
      </ol>
    </section>
  )
}
