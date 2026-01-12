import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BlackWhiteGame from '../components/games/BlackWhiteGame'
import { useTheme } from '../context/ThemeContext'

export default function BlackWhite() {
  const { theme } = useTheme()

  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  return (
    <div className={`bw-page ${theme}`}>
      {/* Back link */}
      <Link
        to="/games"
        className={`inline-flex items-center gap-2 mb-6 text-fs-7 ${textClass} hover:text-orange-yellow-crayola transition-colors`}
      >
        <ArrowLeft size={16} />
        Back to Games
      </Link>

      {/* Header */}
      <header className="mb-6">
        <h1 className={`text-fs-2 font-bold mb-2 ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          Black & White Path
        </h1>
        <p className={`text-fs-6 ${textClass}`}>
          Create a path to make rows or columns uniform in color
        </p>
      </header>

      {/* Game */}
      <BlackWhiteGame initialSize={4} />
    </div>
  )
}
