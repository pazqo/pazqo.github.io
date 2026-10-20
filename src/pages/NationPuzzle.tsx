import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import NationPuzzleGame from '../components/games/NationPuzzleGame'
import { useTheme } from '../context/ThemeContext'
import { NATION_PUZZLES, type NationPuzzleId } from '../data/nationPuzzle'

export default function NationPuzzle() {
  const { theme } = useTheme()
  const [activePuzzleId, setActivePuzzleId] = useState<NationPuzzleId>('large')
  const activePuzzle = NATION_PUZZLES[activePuzzleId]
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  return (
    <div>
      <Link
        to="/games"
        className={`inline-flex items-center gap-2 mb-6 text-fs-7 ${textClass} hover:text-orange-yellow-crayola transition-colors`}
      >
        <ArrowLeft size={16} />
        Back to Games
      </Link>

      <header className="mb-6">
        <h1 className={`text-fs-2 font-bold mb-2 ${
          theme === 'dark' ? 'text-white-2' : 'text-light-text'
        }`}>
          It's a Metric, Too
        </h1>
        <h3>by JaneStreet</h3>
        <a
          href="https://www.janestreet.com/puzzles/current-puzzle/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-fs-7 text-orange-yellow-crayola hover:underline"
        >
          Original Jane Street puzzle
          <ExternalLink size={14} />
        </a>
      </header>

      <blockquote className={`mb-6 border-l-4 border-orange-yellow-crayola pl-4 py-1 text-fs-7 leading-relaxed ${
        theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
      }`}>
        <p className="mb-3">
          The 11-by-11 region above can be subdivided into various states. A “state” is a connected group of 1 or more squares that is symmetric in some way, be it via rotation or reflection. If every nontrivial rotation or reflection of the plane that takes a state to itself leaves exactly 1 of its squares fixed, then that square is its capitol. (So, for example, a 1-by-3 region has no capitol, nor does the “X” pentomino.)
        </p>
        <p>
          The cost of traveling from one square to an orthogonally adjacent square in this nation is equal to the size (i.e. number of squares) of the state you are travelling in, or, if travelling between two states, the lesser of the two states’ sizes. A number in a cell (below) denotes the lowest cost of travelling from the numbered square to any state capitol.
        </p>
      </blockquote>

      <div className="np-tabs" role="tablist" aria-label="Choose a Nation puzzle">
        {(Object.values(NATION_PUZZLES)).map(puzzle => (
          <button
            type="button"
            role="tab"
            id={`nation-tab-${puzzle.id}`}
            aria-selected={activePuzzleId === puzzle.id}
            aria-controls="nation-puzzle-panel"
            className={`np-tab${activePuzzleId === puzzle.id ? ' is-active' : ''}`}
            key={puzzle.id}
            onClick={() => setActivePuzzleId(puzzle.id)}
          >
            {puzzle.label} ({puzzle.size}×{puzzle.size})
          </button>
        ))}
      </div>

      <div id="nation-puzzle-panel" role="tabpanel" aria-labelledby={`nation-tab-${activePuzzle.id}`}>
        <NationPuzzleGame key={activePuzzle.id} puzzle={activePuzzle} />
      </div>
    </div>
  )
}
