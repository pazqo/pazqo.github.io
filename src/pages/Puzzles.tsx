import { useState } from 'react'
import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import LinkedInGamesTable from '../components/ui/LinkedInGamesTable'
import { useTheme } from '../context/ThemeContext'
import puzzlesData from '../data/puzzles.json'

interface Puzzle {
  name: string
  link: string
  author: string
  difficulty: number
  solve_date: string
  solve_time: string
  solver_count: number
  rating_percent: number
}

const puzzles = puzzlesData as Puzzle[]
const PAGE_SIZE = 20

type SortField = 'date' | 'difficulty'
type SortDir = 'asc' | 'desc'

export default function Puzzles() {
  const { theme } = useTheme()
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const linkClass = "text-orange-yellow-crayola hover:underline"
  const primaryLinkClass = "text-orange-yellow-crayola hover:underline font-semibold"
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  const sortedPuzzles = [...puzzles].sort((a, b) => {
    if (sortBy === 'difficulty') {
      return sortDir === 'desc' ? b.difficulty - a.difficulty : a.difficulty - b.difficulty
    }
    // Date sort - puzzles are already ordered by date desc in the JSON, use index as proxy
    const idxA = puzzles.indexOf(a)
    const idxB = puzzles.indexOf(b)
    return sortDir === 'desc' ? idxA - idxB : idxB - idxA
  })

  const totalPages = Math.ceil(sortedPuzzles.length / PAGE_SIZE)
  const displayedPuzzles = sortedPuzzles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
    setPage(0)
  }

  const difficultyStars = (level: number) => '★'.repeat(level) + '☆'.repeat(5 - level)

  const formatDate = (date: string): string => {
    if (date === 'Gestern') return 'Recent'

    const germanMonths: Record<string, string> = {
      'Januar': '01', 'Februar': '02', 'März': '03', 'April': '04',
      'Mai': '05', 'Juni': '06', 'Juli': '07', 'August': '08',
      'September': '09', 'Oktober': '10', 'November': '11', 'Dezember': '12'
    }

    // Parse "13. Dezember 2025" format
    const match = date.match(/(\d{1,2})\.\s*(\w+)\s*(\d{4})/)
    if (match) {
      const day = match[1].padStart(2, '0')
      const month = germanMonths[match[2]] || '01'
      const year = match[3]
      return `${year}-${month}-${day}`
    }

    return date
  }

  return (
    <>
      <header>
        <ArticleTitle>Puzzles</ArticleTitle>
      </header>

      <p className={`text-fs-6 mb-8 ${textClass}`}>
        A collection of resources for puzzle enthusiasts - from pen-and-paper logic puzzles to mechanical puzzles you can hold in your hands.
      </p>

      {/* Daily Puzzles Section */}
      <section className="mb-8">
        <SectionTitle>Daily Puzzles</SectionTitle>
        <p className={`text-fs-7 mb-3 ${textClass}`}>
          Online puzzles that refresh ~daily - perfect for a quick brain workout.
        </p>
        <ul className={`text-fs-6 space-y-2 ${textClass}`}>
          <li>
            <a href="https://www.linkedin.com/games/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              LinkedIn Games
            </a>
            {' '}- A variety of daily puzzles including 6x6 Sudoku, Queens and more.
            If you want to challenge me, connect on <a href="https://www.linkedin.com/in/pazqo/" target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn</a>! My stats:
            <LinkedInGamesTable />
          </li>
          <li>
            <a href="https://inkwellgames.com/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Stars + Fields by Inkwell Games
            </a>
            {' '}- Classic Startbattle daily puzzle, plus Fields (probably more to come)
          </li>
          <li>
            <a href="https://replicube.xyz/staging/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Replicube
            </a>
            {' '}- Use Lua code to generate the picture/animation of the day (actually, Mon + Wed + Fri)
          </li>
          <li>
            <a href="https://enclose.horse/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Enclose Horse
            </a>
            {' '}- Create the largest enclosed area with limited blockers. Tricky to get the optimal score!
          </li>
          <li>
            <a href="https://cluesbysam.com/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Clues by Sam
            </a>
            {' '}- Solve the mistery by unveiling Innocents and Criminals.
          </li>
          <li>
            <a href="https://raddle.quest/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Raddle Quest
            </a>
            {' '}- A word-transformation game.
          </li>
          <li>
            <a href="https://www.reddit.com/r/syllo/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Syllo
            </a>
            {' '}- A reddit-hosted syllable arrangement game.
          </li>
          {/* Add more daily puzzles here */}
        </ul>
      </section>

      {/* Sudokus Section */}
      <section className="mb-8">
        <SectionTitle>Sudoku Variants Resources</SectionTitle>
        <ul className={`text-fs-6 space-y-2 mb-4 ${textClass}`}>
          <li>
            <a href="https://logic-masters.de/Raetselportal/Suche/spezial.php?listname=sudokus" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Logic Masters - Sudokus
            </a>
            {' '}- The main resource for Sudoku variants with ratings and user solves
          </li>
          <li>
            <a href="https://sudokupad.app" target="_blank" rel="noopener noreferrer" className={linkClass}>
              SudokuPad
            </a>
            {' '}- Solve variant sudokus online
          </li>
          <li>
            <a href="https://f-puzzles.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
              f-puzzles
            </a>
            {' '}- Create and share sudoku variants
          </li>
          <li>
            <a href="https://www.youtube.com/@CrackingTheCryptic" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Cracking the Cryptic
            </a>
            {' '}- Daily sudoku solves and puzzle content
          </li>
        </ul>
      </section>

      {/* My Solved Puzzles */}
      <section className="mb-8">
        <SectionTitle>My Solved Sudoku Variation Puzzles ({puzzles.length} total)</SectionTitle>
        <div className={`rounded-lg overflow-hidden border ${
          theme === 'dark' ? 'border-eerie-black-1' : 'border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-fs-7 table-fixed">
              <thead className={theme === 'dark' ? 'bg-eerie-black-2' : 'bg-gray-100'}>
                <tr className={theme === 'dark' ? 'text-white-2' : 'text-light-text'}>
                  <th className="text-left p-2 font-medium w-[50%]">Puzzle</th>
                  <th className="text-left p-2 font-medium w-[20%] hidden sm:table-cell">Author</th>
                  <th
                    className="text-center p-2 font-medium w-[15%] hidden sm:table-cell cursor-pointer hover:text-orange-yellow-crayola"
                    onClick={() => toggleSort('difficulty')}
                  >
                    Difficulty {sortBy === 'difficulty' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="text-right p-2 font-medium w-[15%] cursor-pointer hover:text-orange-yellow-crayola"
                    onClick={() => toggleSort('date')}
                  >
                    Date {sortBy === 'date' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                </tr>
              </thead>
              <tbody className={textClass}>
                {displayedPuzzles.map((puzzle, idx) => (
                  <tr
                    key={idx}
                    className={`border-t ${
                      theme === 'dark' ? 'border-eerie-black-1 hover:bg-eerie-black-2' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-2 truncate">
                      <a
                        href={puzzle.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                        title={puzzle.name}
                      >
                        {puzzle.name}
                      </a>
                    </td>
                    <td className="p-2 hidden sm:table-cell truncate">{puzzle.author}</td>
                    <td className="p-2 text-center text-orange-yellow-crayola text-xs hidden sm:table-cell">
                      {difficultyStars(puzzle.difficulty)}
                    </td>
                    <td className="p-2 text-right text-fs-8">
                      {formatDate(puzzle.solve_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className={`p-3 flex items-center justify-between border-t ${
            theme === 'dark' ? 'border-eerie-black-1 bg-jet' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className={`px-3 py-1 rounded text-fs-7 ${
                  page === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-eerie-black-2'
                } ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}
              >
                ⟨⟨ First
              </button>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`px-3 py-1 rounded text-fs-7 ${
                  page === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-eerie-black-2'
                } ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}
              >
                ← Prev
              </button>
            </div>
            <span className={`text-fs-7 ${textClass}`}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className={`px-3 py-1 rounded text-fs-7 ${
                page === totalPages - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-eerie-black-2'
              } ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* Mechanical Puzzles */}
      <section>
        <SectionTitle>Mechanical Puzzles</SectionTitle>
        <p className={`text-fs-6 ${textClass}`}>
          Coming soon - links to puzzle shops and recommendations.
        </p>
      </section>
    </>
  )
}
