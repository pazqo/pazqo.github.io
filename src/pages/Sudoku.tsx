import { useState, useEffect } from 'react'
import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import { useTheme } from '../context/ThemeContext'
import puzzlesData from '../data/puzzles.json'
import benchmarkData from '../data/challenge_100_puzzles.json'
import solvesIndex from '../data/solves_index.json'

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

interface BenchmarkPuzzle {
  puzzle_id: string
  sudokupad_url: string
  author: string
  title: string
  rules: string
  dataset: string
  youtube_id?: string
  date?: string
}

interface SolveData {
  replay?: string
  gif?: string
}

const puzzles = puzzlesData as Puzzle[]
const benchmarkPuzzles = benchmarkData as BenchmarkPuzzle[]
const mySolves = solvesIndex as Record<string, SolveData>

const PAGE_SIZE = 10
const BENCHMARK_PAGE_SIZE = 25

type SortField = 'date' | 'difficulty'
type SortDir = 'asc' | 'desc'

const STORAGE_KEY = 'sudoku_bench_solved'

function getSolvedPuzzles(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return new Set(JSON.parse(stored))
    }
  } catch {
    // Ignore errors
  }
  return new Set()
}

function saveSolvedPuzzles(solved: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...solved]))
}

export default function Sudoku() {
  const { theme } = useTheme()
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Benchmark state
  const [benchPage, setBenchPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set())
  const [showSolvedOnly, setShowSolvedOnly] = useState(false)
  const [gifOverlay, setGifOverlay] = useState<{ url: string; title: string } | null>(null)

  useEffect(() => {
    setSolvedPuzzles(getSolvedPuzzles())
  }, [])

  const linkClass = "text-orange-yellow-crayola hover:underline"
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  // My solved puzzles sorting
  const sortedPuzzles = [...puzzles].sort((a, b) => {
    if (sortBy === 'difficulty') {
      return sortDir === 'desc' ? b.difficulty - a.difficulty : a.difficulty - b.difficulty
    }
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

    const match = date.match(/(\d{1,2})\.\s*(\w+)\s*(\d{4})/)
    if (match) {
      const day = match[1].padStart(2, '0')
      const month = germanMonths[match[2]] || '01'
      const year = match[3]
      return `${year}-${month}-${day}`
    }

    return date
  }

  // Benchmark filtering
  const filteredBenchmark = benchmarkPuzzles.filter(p => {
    if (showSolvedOnly && !(p.puzzle_id in mySolves)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    }
    return true
  })

  const benchTotalPages = Math.ceil(filteredBenchmark.length / BENCHMARK_PAGE_SIZE)
  const displayedBenchmark = filteredBenchmark.slice(
    benchPage * BENCHMARK_PAGE_SIZE,
    (benchPage + 1) * BENCHMARK_PAGE_SIZE
  )

  const toggleSolved = (puzzleId: string) => {
    setSolvedPuzzles(prev => {
      const next = new Set(prev)
      if (next.has(puzzleId)) {
        next.delete(puzzleId)
      } else {
        next.add(puzzleId)
      }
      saveSolvedPuzzles(next)
      return next
    })
  }

  const mySolvedCount = filteredBenchmark.filter(p => p.puzzle_id in mySolves).length

  return (
    <>
      <header>
        <ArticleTitle>Sudoku</ArticleTitle>
      </header>

      <p className={`text-fs-6 mb-8 ${textClass}`}>
        Everything Sudoku - variant resources, my solved puzzles, and a benchmark challenge.
      </p>

      {/* Sudoku Resources Section */}
      <section className="mb-8">
        <SectionTitle>Sudoku Variant Resources</SectionTitle>
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
            <a href="https://swaroopg92.github.io/penpa-edit/" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Penpa+
            </a>
            {' '}- Setter mode for creating sudoku variants and other logic puzzles
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
                First
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
                Prev
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
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Benchmark Puzzles */}
      <section className="mb-8">
        <SectionTitle>
          Sudoku Challenge ({filteredBenchmark.length} puzzles, {mySolvedCount} solved by me)
        </SectionTitle>
        <p className={`text-fs-7 mb-3 ${textClass}`}>
          A curated challenge of 100 puzzles. Puzzles I've solved have a "Replay" link to download my solve.
          To watch: click "Play", then in SudokuPad go to Settings &gt; Import/Export &gt; Replay load/save.
          Use the checkbox to track your own progress (stored locally in your browser).
        </p>

        {/* Filters */}
        <div className={`flex flex-wrap gap-3 mb-3 items-center ${textClass}`}>
          <input
            type="text"
            placeholder="Search title or author..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setBenchPage(0) }}
            className={`px-3 py-1.5 rounded text-fs-7 w-48 ${
              theme === 'dark'
                ? 'bg-eerie-black-2 text-white-2 border-eerie-black-1 placeholder:text-gray-500'
                : 'bg-white text-light-text border-gray-200 placeholder:text-gray-400'
            } border`}
          />

          <label className="flex items-center gap-2 text-fs-7 cursor-pointer">
            <input
              type="checkbox"
              checked={showSolvedOnly}
              onChange={(e) => { setShowSolvedOnly(e.target.checked); setBenchPage(0) }}
              className="accent-orange-yellow-crayola"
            />
            Show my solved only
          </label>
        </div>

        <div className={`rounded-lg overflow-hidden border ${
          theme === 'dark' ? 'border-eerie-black-1' : 'border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-fs-7 table-fixed">
              <thead className={theme === 'dark' ? 'bg-eerie-black-2' : 'bg-gray-100'}>
                <tr className={theme === 'dark' ? 'text-white-2' : 'text-light-text'}>
                  <th className="text-center p-2 font-medium w-[6%]">You</th>
                  <th className="text-left p-2 font-medium w-[40%]">Puzzle</th>
                  <th className="text-left p-2 font-medium w-[18%] hidden sm:table-cell">Author</th>
                  <th className="text-center p-2 font-medium w-[18%]">Links</th>
                  <th className="text-center p-2 font-medium w-[18%]">My Solve</th>
                </tr>
              </thead>
              <tbody className={textClass}>
                {displayedBenchmark.map((puzzle) => (
                  <tr
                    key={puzzle.puzzle_id}
                    className={`border-t ${
                      theme === 'dark' ? 'border-eerie-black-1 hover:bg-eerie-black-2' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={solvedPuzzles.has(puzzle.puzzle_id)}
                        onChange={() => toggleSolved(puzzle.puzzle_id)}
                        className="accent-orange-yellow-crayola w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="p-2 truncate" title={puzzle.title}>
                      {puzzle.title}
                    </td>
                    <td className="p-2 hidden sm:table-cell truncate">{puzzle.author}</td>
                    <td className="p-2 text-center">
                      <a
                        href={puzzle.sudokupad_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        Play
                      </a>
                      {puzzle.youtube_id && (
                        <>
                          {' | '}
                          <a
                            href={`https://www.youtube.com/watch?v=${puzzle.youtube_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                          >
                            Video
                          </a>
                        </>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {puzzle.puzzle_id in mySolves ? (
                        <>
                          {mySolves[puzzle.puzzle_id].replay && (
                            <a
                              href={`/solves/${mySolves[puzzle.puzzle_id].replay}`}
                              download
                              className={linkClass}
                            >
                              Replay
                            </a>
                          )}
                          {mySolves[puzzle.puzzle_id].replay && mySolves[puzzle.puzzle_id].gif && ' | '}
                          {mySolves[puzzle.puzzle_id].gif && (
                            <button
                              onClick={() => setGifOverlay({
                                url: `/solves/${mySolves[puzzle.puzzle_id].gif}`,
                                title: puzzle.title
                              })}
                              className={`${linkClass} bg-transparent border-none cursor-pointer`}
                            >
                              GIF
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
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
                onClick={() => setBenchPage(0)}
                disabled={benchPage === 0}
                className={`px-3 py-1 rounded text-fs-7 ${
                  benchPage === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-eerie-black-2'
                } ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}
              >
                First
              </button>
              <button
                onClick={() => setBenchPage(p => Math.max(0, p - 1))}
                disabled={benchPage === 0}
                className={`px-3 py-1 rounded text-fs-7 ${
                  benchPage === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-eerie-black-2'
                } ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}
              >
                Prev
              </button>
            </div>
            <span className={`text-fs-7 ${textClass}`}>
              Page {benchPage + 1} of {benchTotalPages || 1}
            </span>
            <button
              onClick={() => setBenchPage(p => Math.min(benchTotalPages - 1, p + 1))}
              disabled={benchPage >= benchTotalPages - 1}
              className={`px-3 py-1 rounded text-fs-7 ${
                benchPage >= benchTotalPages - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-eerie-black-2'
              } ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* GIF Overlay */}
      {gifOverlay && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setGifOverlay(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`mb-2 text-center ${theme === 'dark' ? 'text-white-2' : 'text-white'}`}>
              <h3 className="text-lg font-medium">{gifOverlay.title}</h3>
            </div>
            <img
              src={gifOverlay.url}
              alt={`Solve for ${gifOverlay.title}`}
              className="max-w-full max-h-[80vh] rounded-lg shadow-xl"
            />
            <button
              onClick={() => setGifOverlay(null)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-eerie-black-2 hover:bg-jet text-white rounded-full flex items-center justify-center text-xl leading-none"
            >
              x
            </button>
          </div>
        </div>
      )}
    </>
  )
}
