import { useState } from 'react'
import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import { useTheme } from '../context/ThemeContext'
import puzzlesData from '../data/puzzle-collection.json'

interface Puzzle {
  name: string
  imageLink: string
  solved: boolean
  author: string
  difficulty: number | null
  enjoyment: number | null
  purchaseLink: string
  price: string
}

const puzzles = puzzlesData as Puzzle[]

type FilterType = 'all' | 'solved' | 'unsolved'

export default function PuzzleCollection() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)

  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  const filteredPuzzles = puzzles.filter(p => {
    if (filter === 'solved' && !p.solved) return false
    if (filter === 'unsolved' && p.solved) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    }
    return true
  })

  const solvedCount = puzzles.filter(p => p.solved).length
  const totalCount = puzzles.length

  return (
    <>
      <header>
        <ArticleTitle>Puzzle Collection</ArticleTitle>
      </header>

      <p className={`text-fs-6 mb-4 ${textClass}`}>
        My collection of mechanical puzzles - {totalCount} puzzles, {solvedCount} solved.
      </p>

      <section className="mb-8">
        <SectionTitle>Gallery</SectionTitle>

        {/* Filters */}
        <div className={`flex flex-wrap gap-3 mb-4 items-center ${textClass}`}>
          <input
            type="text"
            placeholder="Search puzzles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-3 py-1.5 rounded text-fs-7 w-48 ${
              theme === 'dark'
                ? 'bg-eerie-black-2 text-white-2 border-eerie-black-1 placeholder:text-gray-500'
                : 'bg-white text-light-text border-gray-200 placeholder:text-gray-400'
            } border`}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className={`px-3 py-1.5 rounded text-fs-7 ${
              theme === 'dark'
                ? 'bg-eerie-black-2 text-white-2 border-eerie-black-1'
                : 'bg-white text-light-text border-gray-200'
            } border`}
          >
            <option value="all">All ({totalCount})</option>
            <option value="solved">Solved ({solvedCount})</option>
            <option value="unsolved">Unsolved ({totalCount - solvedCount})</option>
          </select>

          <span className="text-fs-7">
            Showing {filteredPuzzles.length} puzzles
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPuzzles.map((puzzle, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPuzzle(puzzle)}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${
                theme === 'dark'
                  ? 'bg-eerie-black-2 shadow-md shadow-black/30 border border-jet'
                  : 'bg-gray-100 shadow-md shadow-gray-300/50 border border-gray-200'
              }`}
            >
              <div className="aspect-square">
                <img
                  src={puzzle.imageLink}
                  alt={puzzle.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
              <div className={`p-2 ${theme === 'dark' ? 'bg-eerie-black-2' : 'bg-gray-100'}`}>
                <p className={`text-fs-8 truncate ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}>
                  {puzzle.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    puzzle.solved
                      ? 'bg-green-600/20 text-green-500'
                      : 'bg-orange-600/20 text-orange-400'
                  }`}>
                    {puzzle.solved ? 'Solved' : 'Unsolved'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPuzzles.length === 0 && (
          <p className={`text-center py-8 ${textClass}`}>
            No puzzles found matching your criteria.
          </p>
        )}
      </section>

      {/* Lightbox / Detail Modal */}
      {selectedPuzzle && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPuzzle(null)}
        >
          <div
            className={`relative max-w-2xl w-full rounded-lg overflow-hidden ${
              theme === 'dark' ? 'bg-eerie-black-1' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPuzzle.imageLink}
              alt={selectedPuzzle.name}
              className="w-full max-h-[60vh] object-contain bg-black"
            />
            <div className="p-4">
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}>
                {selectedPuzzle.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className={`text-sm px-2 py-1 rounded ${
                  selectedPuzzle.solved
                    ? 'bg-green-600/20 text-green-500'
                    : 'bg-orange-600/20 text-orange-400'
                }`}>
                  {selectedPuzzle.solved ? 'Solved' : 'Unsolved'}
                </span>
                {selectedPuzzle.author && (
                  <span className={`text-sm px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-eerie-black-2 text-light-gray' : 'bg-gray-100 text-light-muted'
                  }`}>
                    by {selectedPuzzle.author}
                  </span>
                )}
                {selectedPuzzle.difficulty && (
                  <span className={`text-sm px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-eerie-black-2 text-light-gray' : 'bg-gray-100 text-light-muted'
                  }`}>
                    Difficulty: {'★'.repeat(selectedPuzzle.difficulty)}{'☆'.repeat(5 - selectedPuzzle.difficulty)}
                  </span>
                )}
                {selectedPuzzle.enjoyment && (
                  <span className={`text-sm px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-eerie-black-2 text-light-gray' : 'bg-gray-100 text-light-muted'
                  }`}>
                    Enjoyment: {'★'.repeat(selectedPuzzle.enjoyment)}{'☆'.repeat(5 - selectedPuzzle.enjoyment)}
                  </span>
                )}
              </div>
              {selectedPuzzle.purchaseLink && (
                <a
                  href={selectedPuzzle.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-orange-yellow-crayola hover:underline text-sm"
                >
                  Purchase {selectedPuzzle.price && `(${selectedPuzzle.price})`}
                </a>
              )}
            </div>
            <button
              onClick={() => setSelectedPuzzle(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
