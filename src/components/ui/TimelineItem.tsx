import { useTheme } from '../../context/ThemeContext'

interface TimelineItemProps {
  title: string
  subtitle?: string
  dateRange: string
  description?: React.ReactNode
}

export default function TimelineItem({ title, subtitle, dateRange, description }: TimelineItemProps) {
  const { theme } = useTheme()

  return (
    <li className={`relative mb-5 last:mb-0 pl-1
      before:content-[''] before:absolute before:-top-6 before:-left-8 before:w-px before:h-[calc(100%+50px)] before:bg-jet last:before:hidden
      after:content-[''] after:absolute after:top-1 after:-left-9 after:w-2 after:h-2 after:bg-gradient-yellow after:rounded-full after:shadow-[0_0_0_4px_hsl(220,20%,22%)]
    `}>
      <h4 className={`text-fs-6 leading-snug mb-1 font-medium ${
        theme === 'dark' ? 'text-white-2' : 'text-light-text'
      }`}>
        {title}
      </h4>
      {subtitle && (
        <h5 className={`text-fs-7 mb-1 ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          {subtitle}
        </h5>
      )}
      <span className="text-vegas-gold font-normal leading-relaxed block mb-2">
        {dateRange}
      </span>
      {description && (
        <p className={`font-light leading-relaxed ${
          theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
        }`}>
          {description}
        </p>
      )}
    </li>
  )
}
