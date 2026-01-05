import { useState, useEffect, useCallback } from 'react'
import { Maximize, Minimize, Save, RotateCcw } from 'lucide-react'
import SolvedGroup from './SolvedGroup'
import { getShuffledWords, validatePuzzle } from '../../data/connectwords/puzzles'
import type { Puzzle, PuzzleGroup } from '../../data/connectwords/puzzles'
import { saveGame as saveToStorage, generateGameId, type SavedGame, type GridCell } from '../../data/connectwords/savedGames'

interface MergedCluster {
  clusterId: number
  indices: number[]
  words: string[]
  color?: string
}

interface ConnectWordsGameProps {
  puzzle: Puzzle
  savedState?: SavedGame
  onSave?: () => void
}

function generateColor(index: number): string {
  const hue = (index * 137.5) % 360
  return `hsl(${hue}, 70%, 85%)`
}

export default function ConnectWordsGame({ puzzle, savedState, onSave }: ConnectWordsGameProps) {
  const [grid, setGrid] = useState<GridCell[]>([])
  const [clusters, setClusters] = useState<Record<number, number[]>>({})
  const [clusterColors, setClusterColors] = useState<Record<number, string>>({})
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null)
  const [solvedGroups, setSolvedGroups] = useState<(PuzzleGroup & { groupIndex: number })[]>([])
  const [message, setMessage] = useState('')
  const [nextClusterId, setNextClusterId] = useState(0)
  const [nextColorIndex, setNextColorIndex] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [gameId] = useState(() => savedState?.id || generateGameId(puzzle))

  const n = puzzle.groups.length

  // Initialize/reset game when puzzle changes
  useEffect(() => {
    const validation = validatePuzzle(puzzle)
    if (!validation.valid) {
      setMessage(`Invalid puzzle: ${validation.error}`)
      return
    }

    // Restore from saved state if provided
    if (savedState) {
      setGrid(savedState.grid)
      setClusters(savedState.clusters)
      setClusterColors(savedState.clusterColors)
      setSolvedGroups(savedState.solvedGroups)
      setNextClusterId(savedState.nextClusterId)
      setNextColorIndex(savedState.nextColorIndex)
      setSelectedClusterId(null)
      setMessage('Game restored!')
      setTimeout(() => setMessage(''), 1500)
      return
    }

    // Start fresh game
    const words = getShuffledWords(puzzle)
    const initialGrid: GridCell[] = words.map((w, idx) => ({
      ...w,
      clusterId: idx,
      cellIndex: idx
    }))

    const initialClusters: Record<number, number[]> = {}
    words.forEach((_, idx) => {
      initialClusters[idx] = [idx]
    })

    setGrid(initialGrid)
    setClusters(initialClusters)
    setClusterColors({})
    setSelectedClusterId(null)
    setSolvedGroups([])
    setMessage('')
    setNextClusterId(words.length)
    setNextColorIndex(0)
  }, [puzzle, savedState])

  // Handle escape key to exit expanded mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  const isWon = solvedGroups.length === n

  // Save game to localStorage
  const handleSaveGame = useCallback(() => {
    const game: SavedGame = {
      id: gameId,
      puzzle,
      grid,
      clusters,
      clusterColors,
      solvedGroups,
      nextClusterId,
      nextColorIndex,
      isComplete: solvedGroups.length === n,
      savedAt: Date.now()
    }
    saveToStorage(game)
    setMessage('Game saved!')
    setTimeout(() => setMessage(''), 1500)
    onSave?.()
  }, [gameId, puzzle, grid, clusters, clusterColors, solvedGroups, nextClusterId, nextColorIndex, n, onSave])

  // Toggle expanded mode
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev)
  }

  // Get merged clusters (size > 1) for sidebar
  const mergedClusters: MergedCluster[] = Object.entries(clusters)
    .filter(([, indices]) => indices.length > 1)
    .map(([clusterId, indices]) => ({
      clusterId: parseInt(clusterId),
      indices,
      words: indices.map(i => grid[i]?.word).filter(Boolean),
      color: clusterColors[parseInt(clusterId)]
    }))
    .sort((a, b) => b.indices.length - a.indices.length)

  // Merge two clusters
  const mergeClusters = (clusterId1: number, clusterId2: number): boolean => {
    const cluster1Indices = clusters[clusterId1]
    const cluster2Indices = clusters[clusterId2]

    const cluster1Cells = cluster1Indices.map(i => grid[i])
    const cluster2Cells = cluster2Indices.map(i => grid[i])
    const allCells = [...cluster1Cells, ...cluster2Cells]

    const firstGroupIndex = allCells[0].groupIndex
    const allSameGroup = allCells.every(c => c.groupIndex === firstGroupIndex)

    if (allSameGroup) {
      const mergedIndices = [...cluster1Indices, ...cluster2Indices]
      const newClusterId = nextClusterId

      const size1 = cluster1Indices.length
      const size2 = cluster2Indices.length
      const color1 = clusterColors[clusterId1]
      const color2 = clusterColors[clusterId2]

      let mergedColor: string
      if (size1 === 1 && size2 === 1) {
        mergedColor = generateColor(nextColorIndex)
        setNextColorIndex(prev => prev + 1)
      } else if (size1 === 1) {
        mergedColor = color2
      } else if (size2 === 1) {
        mergedColor = color1
      } else {
        mergedColor = size1 > size2 ? color1 : color2
      }

      const newGrid = grid.map(cell => {
        if (mergedIndices.includes(cell.cellIndex)) {
          return { ...cell, clusterId: newClusterId }
        }
        return cell
      })

      const newClusters = { ...clusters }
      delete newClusters[clusterId1]
      delete newClusters[clusterId2]
      newClusters[newClusterId] = mergedIndices

      const newClusterColors = { ...clusterColors }
      delete newClusterColors[clusterId1]
      delete newClusterColors[clusterId2]
      newClusterColors[newClusterId] = mergedColor

      if (mergedIndices.length === n) {
        const group = puzzle.groups[firstGroupIndex]
        setSolvedGroups(prev => [...prev, { ...group, groupIndex: firstGroupIndex }])

        const solvedGrid = newGrid.map(cell => {
          if (mergedIndices.includes(cell.cellIndex)) {
            return { ...cell, solved: true }
          }
          return cell
        })
        setGrid(solvedGrid)

        delete newClusters[newClusterId]
        delete newClusterColors[newClusterId]
        setClusters(newClusters)
        setClusterColors(newClusterColors)

        setMessage(`Found: ${group.name}!`)
        setTimeout(() => setMessage(''), 2000)
      } else {
        setGrid(newGrid)
        setClusters(newClusters)
        setClusterColors(newClusterColors)
      }

      setNextClusterId(newClusterId + 1)
      return true
    } else {
      setMessage("These don't belong to the same group!")
      setTimeout(() => setMessage(''), 1500)
      return false
    }
  }

  // Handle cell or sidebar click
  const handleClusterClick = (clusterId: number) => {
    if (selectedClusterId === null) {
      setSelectedClusterId(clusterId)
      setMessage('')
    } else if (selectedClusterId === clusterId) {
      setSelectedClusterId(null)
    } else {
      mergeClusters(selectedClusterId, clusterId)
      setSelectedClusterId(null)
    }
  }

  const handleCellClick = (cellIndex: number) => {
    const cell = grid[cellIndex]
    if (!cell || cell.solved) return
    handleClusterClick(cell.clusterId)
  }

  const handleReset = () => {
    const words = getShuffledWords(puzzle)
    const initialGrid: GridCell[] = words.map((w, idx) => ({
      ...w,
      clusterId: idx,
      cellIndex: idx
    }))

    const initialClusters: Record<number, number[]> = {}
    words.forEach((_, idx) => {
      initialClusters[idx] = [idx]
    })

    setGrid(initialGrid)
    setClusters(initialClusters)
    setClusterColors({})
    setSelectedClusterId(null)
    setSolvedGroups([])
    setMessage('')
    setNextClusterId(words.length)
    setNextColorIndex(0)
  }

  const renderCell = (cell: GridCell, index: number) => {
    if (!cell) return <div key={index} className="cw-grid-cell cw-empty" />

    if (cell.solved) {
      return <div key={index} className="cw-grid-cell cw-solved" />
    }

    const isSelected = selectedClusterId === cell.clusterId
    const clusterSize = clusters[cell.clusterId]?.length || 1
    const isMerged = clusterSize > 1
    const clusterColor = clusterColors[cell.clusterId]

    const classes = [
      'cw-grid-cell',
      isSelected && 'cw-selected',
      isMerged && 'cw-merged'
    ].filter(Boolean).join(' ')

    const style: React.CSSProperties = {}
    if (clusterColor) {
      style.backgroundColor = clusterColor
    }

    return (
      <button
        key={index}
        className={classes}
        style={style}
        onClick={() => handleCellClick(index)}
      >
        <span className="cw-cell-word">{cell.word}</span>
        {isMerged && <span className="cw-cell-count">{clusterSize}/{n}</span>}
      </button>
    )
  }

  return (
    <div className={`cw-game-container ${isExpanded ? 'cw-expanded' : ''}`}>
      {/* Top bar */}
      <div className="cw-game-topbar">
        <h2 className="cw-game-title">{puzzle.title}</h2>
        <div className="cw-topbar-controls">
          <button onClick={() => setSelectedClusterId(null)} disabled={selectedClusterId === null}>
            Deselect
          </button>
          <button onClick={handleReset} title="Reset puzzle">
            <RotateCcw size={14} />
          </button>
          <button onClick={handleSaveGame} title="Save progress">
            <Save size={14} />
          </button>
          <button onClick={toggleExpanded} title={isExpanded ? 'Exit full page' : 'Full page'}>
            {isExpanded ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
          <div
            className="cw-help-icon"
            onMouseEnter={() => setShowInstructions(true)}
            onMouseLeave={() => setShowInstructions(false)}
          >
            ?
            {showInstructions && (
              <div className="cw-instructions-tooltip">
                Click two words or groups that belong together to merge them.
                Use the sidebar to quickly access and merge larger groups.
              </div>
            )}
          </div>
        </div>
      </div>

      {message && <div className="cw-game-toast">{message}</div>}

      {isWon && (
        <div className="cw-game-won">Congratulations! You solved the puzzle!</div>
      )}

      {/* Solved groups */}
      {solvedGroups.length > 0 && (
        <div className="cw-solved-groups">
          {solvedGroups.map((group, index) => (
            <SolvedGroup key={index} group={group} />
          ))}
        </div>
      )}

      {/* Main layout: grid + sidebar */}
      {!isWon && (
        <div className="cw-game-layout">
          {/* Grid */}
          <div className="cw-grid-wrapper">
            <div
              className="cw-word-grid"
              style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
            >
              {grid.map((cell, index) => renderCell(cell, index))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="cw-groups-sidebar">
            <div className="cw-sidebar-header">Groups ({mergedClusters.length})</div>
            <div className="cw-sidebar-list">
              {mergedClusters.map(({ clusterId, indices, words, color }) => {
                const isSelected = selectedClusterId === clusterId
                const preview = words.slice(0, 3)
                const remaining = words.length - 3

                return (
                  <button
                    key={clusterId}
                    className={`cw-sidebar-group ${isSelected ? 'cw-selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleClusterClick(clusterId)}
                  >
                    <div className="cw-sidebar-group-count">{indices.length}/{n}</div>
                    <div className="cw-sidebar-group-words">
                      {preview.join(', ')}
                      {remaining > 0 && <span className="cw-more">+{remaining}</span>}
                    </div>
                  </button>
                )
              })}
              {mergedClusters.length === 0 && (
                <div className="cw-sidebar-empty">No groups yet. Click two matching words to start!</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
