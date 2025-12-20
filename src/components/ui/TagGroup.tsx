import { useTheme } from '../../context/ThemeContext'

interface TagGroupProps {
  title: string
  tags: string[]
}

export default function TagGroup({ title, tags }: TagGroupProps) {
  const { theme } = useTheme()

  return (
    <div className="mb-4">
      <h4 className={`text-fs-4 font-medium mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-light-text'
      }`}>
        {title}
      </h4>
      <div className={`flex flex-wrap gap-2 p-3 rounded-lg ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}>
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-3 py-1 rounded-full text-sm ${
              theme === 'dark'
                ? 'bg-jet text-white'
                : 'bg-gray-200 text-light-text'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
