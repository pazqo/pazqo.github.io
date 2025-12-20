import { useTheme } from '../../context/ThemeContext'

interface SkillBarProps {
  name: string
  percentage: number
}

export default function SkillBar({ name, percentage }: SkillBarProps) {
  const { theme } = useTheme()

  return (
    <li className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <h5 className={`text-fs-7 font-medium ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          {name}
        </h5>
        <data className={`text-fs-7 font-light ${
          theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
        }`}>
          {percentage}%
        </data>
      </div>
      <div className={`w-full h-2 rounded-full ${
        theme === 'dark' ? 'bg-jet' : 'bg-gray-200'
      }`}>
        <div
          className="h-full rounded-full bg-gradient-yellow transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </li>
  )
}
