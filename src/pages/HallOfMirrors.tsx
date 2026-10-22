import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import ArticleTitle from '../components/ui/ArticleTitle'
import HallOfMirrorsGame from '../components/games/HallOfMirrorsGame'
import { useTheme } from '../context/ThemeContext'
import { HALL_PUZZLES, type HallPuzzleId } from '../data/hallOfMirrors'
import '../styles/hall-of-mirrors.css'

const ORIGINAL_PUZZLE_URL = 'https://www.janestreet.com/puzzles/hall-of-mirrors-3-index/'

export default function HallOfMirrors() {
  const { theme } = useTheme()
  const [activePuzzleId, setActivePuzzleId] = useState<HallPuzzleId>('large')
  const activePuzzle = HALL_PUZZLES[activePuzzleId]
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  return (
    <div className="hm-page">
      <Link
        to="/games"
        className={`inline-flex items-center gap-2 mb-6 text-fs-7 ${textClass} hover:text-orange-yellow-crayola transition-colors`}
      >
        <ArrowLeft size={16} />
        Back to Games
      </Link>

      <header className="mb-6">
        <ArticleTitle>Hall of Mirrors 3</ArticleTitle>
        <p className={`text-fs-6 ${textClass}`}>
          Place mirrors, trace the lasers, and match each path’s segment product.
        </p>
        <a
          href={ORIGINAL_PUZZLE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-fs-7 text-orange-yellow-crayola hover:underline"
        >
          Original Jane Street puzzle
          <ExternalLink size={14} />
        </a>
      </header>

      <blockquote className={`mb-6 border-l-4 border-orange-yellow-crayola pl-4 py-1 text-fs-7 leading-relaxed ${textClass}`}>
        <p className="mb-3">
          The perimeter of a 10-by-10 square field is surrounded by lasers pointing into the field. (Each laser begins half a unit from the edge of the field, as indicated by the •’s.)
        </p>
        <p>
          Place diagonal mirrors in some of the cells so that the product of the segment lengths of a laser’s path matches the clue numbers. (For instance, the segments for the “75” path in the example puzzle have lengths 5, 3, 5.) Mirrors may not be placed in orthogonally adjacent cells.
        </p>
      </blockquote>

      <div className="hm-tabs" role="tablist" aria-label="Choose a Hall of Mirrors puzzle">
        {Object.values(HALL_PUZZLES).map(puzzle => (
          <button
            type="button"
            role="tab"
            id={`hall-tab-${puzzle.id}`}
            aria-selected={activePuzzleId === puzzle.id}
            aria-controls="hall-puzzle-panel"
            className={`hm-tab${activePuzzleId === puzzle.id ? ' is-active' : ''}`}
            key={puzzle.id}
            onClick={() => setActivePuzzleId(puzzle.id)}
          >
            {puzzle.label} ({puzzle.size}×{puzzle.size})
          </button>
        ))}
      </div>

      <div id="hall-puzzle-panel" role="tabpanel" aria-labelledby={`hall-tab-${activePuzzle.id}`}>
        <HallOfMirrorsGame key={activePuzzle.id} puzzle={activePuzzle} />
      </div>
    </div>
  )
}
