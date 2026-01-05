import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Trash2 } from 'lucide-react'
import ConnectWordsGame from '../components/games/ConnectWordsGame'
import { puzzles } from '../data/connectwords/puzzles'
import { generatePuzzle, getDbStats, getMaxPuzzleSize, getEligibleLists } from '../data/connectwords/puzzleGenerator'
import { getSavedGames, deleteSavedGame, type SavedGame } from '../data/connectwords/savedGames'
import type { Puzzle } from '../data/connectwords/puzzles'
import { useTheme } from '../context/ThemeContext'
import '../styles/connectwords.css'

export default function ConnectWords() {
  const { theme } = useTheme()
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [currentSavedState, setCurrentSavedState] = useState<SavedGame | undefined>(undefined)
  const [selectedPresetId, setSelectedPresetId] = useState('')
  const [customSize, setCustomSize] = useState(10)
  const [dbStats, setDbStats] = useState<ReturnType<typeof getDbStats> | null>(null)
  const [maxSize, setMaxSize] = useState(50)
  const [generating, setGenerating] = useState(false)
  const [savedGames, setSavedGames] = useState<SavedGame[]>([])

  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
  const inputClass = theme === 'dark'
    ? 'bg-eerie-black-2 border-jet text-white-2 focus:border-orange-yellow-crayola'
    : 'bg-white border-gray-300 text-light-text focus:border-orange-yellow-crayola'
  const buttonClass = theme === 'dark'
    ? 'bg-jet hover:bg-eerie-black-1 text-white-2 border-jet'
    : 'bg-gray-100 hover:bg-gray-200 text-light-text border-gray-300'
  const primaryButtonClass = theme === 'dark'
    ? 'bg-orange-yellow-crayola hover:bg-orange-yellow-crayola/80 text-eerie-black-1'
    : 'bg-orange-yellow-crayola hover:bg-orange-yellow-crayola/80 text-white'

  // Load stats and saved games on mount
  useEffect(() => {
    const stats = getDbStats()
    setDbStats(stats)
    const max = getMaxPuzzleSize()
    setMaxSize(max)
    setSavedGames(getSavedGames())
  }, [])

  // Refresh saved games list
  const refreshSavedGames = () => {
    setSavedGames(getSavedGames())
  }

  // Handle preset puzzle selection
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedPresetId(id)
    if (id) {
      const puzzle = puzzles.find(p => p.id === Number(id))
      if (puzzle) {
        setCurrentPuzzle(puzzle)
        setCurrentSavedState(undefined)
      }
    }
  }

  // Generate a random puzzle
  const handleGenerate = (size?: number) => {
    const puzzleSize = size ?? customSize
    setGenerating(true)
    setSelectedPresetId('')

    setTimeout(() => {
      const puzzle = generatePuzzle(puzzleSize)
      if (puzzle) {
        setCurrentPuzzle(puzzle)
        setCurrentSavedState(undefined)
      }
      setGenerating(false)
    }, 50)
  }

  // Load a saved game
  const handleLoadSaved = (saved: SavedGame) => {
    setCurrentPuzzle(saved.puzzle)
    setCurrentSavedState(saved)
    setSelectedPresetId('')
  }

  // Delete a saved game
  const handleDeleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteSavedGame(id)
    refreshSavedGames()
  }

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`cw-page ${theme}`}>
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
          Connect Words
        </h1>
        <p className={`text-fs-6 ${textClass}`}>
          Group words by their common category
        </p>
      </header>

      {/* Controls */}
      {!currentPuzzle && (
        <div className={`p-5 rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-eerie-black-2' : 'bg-gray-50'
        }`}>
          {/* Saved Puzzles */}
          {savedGames.length > 0 && (
            <>
              <div className="mb-4">
                <label className={`block text-fs-7 font-medium mb-2 ${textClass}`}>
                  Saved Puzzles
                </label>
                <div className="space-y-2">
                  {savedGames.map(saved => (
                    <button
                      key={saved.id}
                      onClick={() => handleLoadSaved(saved)}
                      className={`w-full p-3 rounded border text-left transition-colors flex items-center justify-between group ${
                        theme === 'dark'
                          ? 'bg-jet border-eerie-black-1 hover:border-orange-yellow-crayola'
                          : 'bg-white border-gray-200 hover:border-orange-yellow-crayola'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {saved.isComplete && (
                          <span className="text-green-500 flex-shrink-0">
                            <Check size={18} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className={`text-fs-7 font-medium truncate ${
                            theme === 'dark' ? 'text-white-2' : 'text-light-text'
                          }`}>
                            {saved.puzzle.title}
                          </div>
                          <div className={`text-fs-8 ${textClass}`}>
                            {saved.isComplete
                              ? 'Completed'
                              : `${saved.solvedGroups.length}/${saved.puzzle.groups.length} groups found`
                            }
                            {' · '}
                            {formatDate(saved.savedAt)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSaved(e, saved.id)}
                        className={`p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                          theme === 'dark'
                            ? 'hover:bg-eerie-black-1 text-light-gray hover:text-red-400'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'
                        }`}
                        title="Delete saved game"
                      >
                        <Trash2 size={16} />
                      </button>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className={`flex items-center gap-4 my-4 ${textClass}`}>
                <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-jet' : 'bg-gray-300'}`} />
                <span className="text-fs-8">or start new</span>
                <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-jet' : 'bg-gray-300'}`} />
              </div>
            </>
          )}

          {/* Preset puzzles */}
          <div className="mb-4">
            <label className={`block text-fs-7 font-medium mb-2 ${textClass}`}>
              Preset Puzzles
            </label>
            <select
              value={selectedPresetId}
              onChange={handlePresetChange}
              className={`w-full p-2 rounded border text-fs-7 outline-none transition-colors ${inputClass}`}
            >
              <option value="">-- Select a preset --</option>
              {puzzles.map(puzzle => (
                <option key={puzzle.id} value={puzzle.id}>
                  {puzzle.title}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className={`flex items-center gap-4 my-4 ${textClass}`}>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-jet' : 'bg-gray-300'}`} />
            <span className="text-fs-8">or</span>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-jet' : 'bg-gray-300'}`} />
          </div>

          {/* Puzzle generator */}
          <div>
            <label className={`block text-fs-7 font-medium mb-2 ${textClass}`}>
              Generate Random Puzzle
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="5"
                max={maxSize}
                value={customSize}
                onChange={(e) => setCustomSize(parseInt(e.target.value) || 5)}
                onBlur={() => setCustomSize(Math.min(maxSize, Math.max(5, customSize)))}
                className={`w-20 p-2 rounded border text-fs-7 text-center outline-none transition-colors ${inputClass}`}
              />
              <span className={`text-fs-7 ${textClass}`}>× {customSize}</span>
              <button
                onClick={() => handleGenerate()}
                disabled={generating}
                className={`px-4 py-2 rounded text-fs-7 font-medium transition-colors ${primaryButtonClass} disabled:opacity-50`}
              >
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </div>
            <p className={`mt-2 text-fs-8 ${textClass}`}>
              {getEligibleLists(customSize).length} lists available for {customSize}×{customSize}
            </p>
          </div>

          {/* Quick size buttons */}
          {dbStats && (
            <div className="mt-4">
              <p className={`text-fs-8 mb-2 ${textClass}`}>Quick sizes:</p>
              <div className="flex flex-wrap gap-2">
                {[5, 6, 7, 8, 10, 12, 15].filter(s => s <= maxSize && (dbStats.availableFor[s] ?? 0) >= s).map(size => (
                  <button
                    key={size}
                    className={`px-3 py-1 rounded text-fs-8 transition-colors ${buttonClass}`}
                    onClick={() => { setCustomSize(size); handleGenerate(size) }}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game */}
      {currentPuzzle && (
        <>
          <button
            onClick={() => {
              setCurrentPuzzle(null)
              setCurrentSavedState(undefined)
              refreshSavedGames()
            }}
            className={`mb-4 px-4 py-2 rounded text-fs-7 font-medium transition-colors ${buttonClass}`}
          >
            Choose Different Puzzle
          </button>
          <ConnectWordsGame
            key={currentSavedState?.id || currentPuzzle.id}
            puzzle={currentPuzzle}
            savedState={currentSavedState}
            onSave={refreshSavedGames}
          />
        </>
      )}

      {/* Welcome message */}
      {!currentPuzzle && savedGames.length === 0 && (
        <div className={`text-center py-8 ${textClass}`}>
          <p className="text-fs-6">Select a preset puzzle or generate a random one to start playing!</p>
        </div>
      )}
    </div>
  )
}
