import { useTheme } from '../../context/ThemeContext'

interface ServiceItemProps {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

export default function ServiceItem({ icon, title, description }: ServiceItemProps) {
  const { theme } = useTheme()

  return (
    <li className={`relative rounded-14 p-5 shadow-shadow-2 md:flex md:items-start md:gap-5 ${
      theme === 'dark'
        ? 'bg-border-gradient-onyx'
        : 'bg-white border border-gray-100'
    }`}>
      <div className={`absolute inset-[1px] rounded-14 -z-10 ${
        theme === 'dark' ? 'bg-gradient-jet' : 'bg-white'
      }`} />

      <div className="mb-3 md:mb-0 md:mt-1 w-fit mx-auto md:mx-0 text-orange-yellow-crayola">
        {icon}
      </div>

      <div className="text-center md:text-left">
        <h4 className={`text-fs-4 font-medium mb-2 ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          {title}
        </h4>
        <p className={`text-fs-6 font-light leading-relaxed ${
          theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
        }`}>
          {description}
        </p>
      </div>
    </li>
  )
}
