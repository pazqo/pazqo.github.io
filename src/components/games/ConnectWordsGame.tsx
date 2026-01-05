import { useState, useEffect, useCallback, useRef } from 'react'
import { Maximize, Minimize, Save, RotateCcw, Shuffle, ArrowDownAZ, AlignLeft, Pencil, X, Check } from 'lucide-react'
import SolvedGroup from './SolvedGroup'
import { getShuffledWords, validatePuzzle } from '../../data/connectwords/puzzles'
import type { Puzzle, PuzzleGroup } from '../../data/connectwords/puzzles'
import { saveGame as saveToStorage, generateGameId, type SavedGame, type GridCell } from '../../data/connectwords/savedGames'

interface MergedCluster {
  clusterId: number
  indices: number[]
  words: string[]
  color?: string
  label?: string
}

interface ConnectWordsGameProps {
  puzzle: Puzzle
  savedState?: SavedGame
  onSave?: () => void
  startExpanded?: boolean
}

function generateColor(index: number): string {
  const hue = (index * 137.5) % 360
  return `hsl(${hue}, 70%, 85%)`
}

export default function ConnectWordsGame({ puzzle, savedState, onSave, startExpanded = false }: ConnectWordsGameProps) {
  const [grid, setGrid] = useState<GridCell[]>([])
  const [clusters, setClusters] = useState<Record<number, number[]>>({})
  const [clusterColors, setClusterColors] = useState<Record<number, string>>({})
  const [clusterLabels, setClusterLabels] = useState<Record<number, string>>({})
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null)
  const [solvedGroups, setSolvedGroups] = useState<(PuzzleGroup & { groupIndex: number })[]>([])
  const [message, setMessage] = useState('')
  const [nextClusterId, setNextClusterId] = useState(0)
  const [nextColorIndex, setNextColorIndex] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(startExpanded)
  const [gameId] = useState(() => savedState?.id || generateGameId(puzzle))
  const [editingLabelId, setEditingLabelId] = useState<number | null>(null)
  const [editingLabelText, setEditingLabelText] = useState('')
  const labelInputRef = useRef<HTMLInputElement>(null)

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
      setClusterLabels(savedState.clusterLabels || {})
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
    setClusterLabels({})
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
      clusterLabels,
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
  }, [gameId, puzzle, grid, clusters, clusterColors, clusterLabels, solvedGroups, nextClusterId, nextColorIndex, n, onSave])

  // Toggle expanded mode
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev)
  }

  // Shuffle unsolved cells (Fisher-Yates)
  const handleShuffle = () => {
    const unsolvedIndices = grid.map((cell, i) => cell.solved ? -1 : i).filter(i => i !== -1)
    const unsolvedCells = unsolvedIndices.map(i => grid[i])

    // Fisher-Yates shuffle
    for (let i = unsolvedCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unsolvedCells[i], unsolvedCells[j]] = [unsolvedCells[j], unsolvedCells[i]]
    }

    // Create new grid with shuffled cells
    const newGrid = [...grid]
    unsolvedIndices.forEach((gridIndex, i) => {
      newGrid[gridIndex] = { ...unsolvedCells[i], cellIndex: gridIndex }
    })

    // Update clusters to point to new indices
    const newClusters: Record<number, number[]> = {}
    Object.entries(clusters).forEach(([clusterId, indices]) => {
      const newIndices = indices.map(oldIndex => {
        const cell = grid[oldIndex]
        return newGrid.findIndex(c => c.word === cell.word && c.groupIndex === cell.groupIndex && !c.solved)
      }).filter(i => i !== -1)
      if (newIndices.length > 0) {
        newClusters[parseInt(clusterId)] = newIndices
      }
    })

    // Update grid cells with correct cluster IDs
    const finalGrid = newGrid.map(cell => {
      if (cell.solved) return cell
      const clusterId = Object.entries(newClusters).find(([, indices]) =>
        indices.includes(cell.cellIndex)
      )?.[0]
      return { ...cell, clusterId: clusterId ? parseInt(clusterId) : cell.clusterId }
    })

    setGrid(finalGrid)
    setClusters(newClusters)
    setSelectedClusterId(null)
    setMessage('Shuffled!')
    setTimeout(() => setMessage(''), 1000)
  }

  // Sort unsolved cells alphabetically
  const handleSort = () => {
    const unsolvedIndices = grid.map((cell, i) => cell.solved ? -1 : i).filter(i => i !== -1)
    const unsolvedCells = unsolvedIndices.map(i => grid[i])

    // Sort alphabetically by word
    unsolvedCells.sort((a, b) => a.word.localeCompare(b.word))

    // Create new grid with sorted cells
    const newGrid = [...grid]
    unsolvedIndices.forEach((gridIndex, i) => {
      newGrid[gridIndex] = { ...unsolvedCells[i], cellIndex: gridIndex }
    })

    // Update clusters to point to new indices
    const newClusters: Record<number, number[]> = {}
    Object.entries(clusters).forEach(([clusterId, indices]) => {
      const newIndices = indices.map(oldIndex => {
        const cell = grid[oldIndex]
        return newGrid.findIndex(c => c.word === cell.word && c.groupIndex === cell.groupIndex && !c.solved)
      }).filter(i => i !== -1)
      if (newIndices.length > 0) {
        newClusters[parseInt(clusterId)] = newIndices
      }
    })

    // Update grid cells with correct cluster IDs
    const finalGrid = newGrid.map(cell => {
      if (cell.solved) return cell
      const clusterId = Object.entries(newClusters).find(([, indices]) =>
        indices.includes(cell.cellIndex)
      )?.[0]
      return { ...cell, clusterId: clusterId ? parseInt(clusterId) : cell.clusterId }
    })

    setGrid(finalGrid)
    setClusters(newClusters)
    setSelectedClusterId(null)
    setMessage('Sorted!')
    setTimeout(() => setMessage(''), 1000)
  }

  // Compact: move unsolved cells to fill gaps from solved cells
  const handleCompact = () => {
    const unsolvedCells = grid.filter(cell => !cell.solved)
    const totalCells = n * n

    // Create new grid: unsolved cells first, then solved placeholders
    const newGrid: GridCell[] = []
    unsolvedCells.forEach((cell, i) => {
      newGrid.push({ ...cell, cellIndex: i })
    })
    // Fill remaining with solved placeholders
    for (let i = unsolvedCells.length; i < totalCells; i++) {
      newGrid.push({ word: '', groupIndex: -1, groupName: '', clusterId: -1, cellIndex: i, solved: true })
    }

    // Update clusters to point to new indices
    const newClusters: Record<number, number[]> = {}
    Object.entries(clusters).forEach(([clusterId, indices]) => {
      const newIndices: number[] = []
      indices.forEach(oldIndex => {
        const cell = grid[oldIndex]
        const newIndex = newGrid.findIndex(c => c.word === cell.word && c.groupIndex === cell.groupIndex && !c.solved)
        if (newIndex !== -1) newIndices.push(newIndex)
      })
      if (newIndices.length > 0) {
        newClusters[parseInt(clusterId)] = newIndices
      }
    })

    // Update grid cells with correct cluster IDs
    const finalGrid = newGrid.map(cell => {
      if (cell.solved) return cell
      const clusterId = Object.entries(newClusters).find(([, indices]) =>
        indices.includes(cell.cellIndex)
      )?.[0]
      return { ...cell, clusterId: clusterId ? parseInt(clusterId) : cell.clusterId }
    })

    setGrid(finalGrid)
    setClusters(newClusters)
    setSelectedClusterId(null)
    setMessage('Compacted!')
    setTimeout(() => setMessage(''), 1000)
  }

  // Label editing
  const startEditingLabel = (clusterId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingLabelId(clusterId)
    setEditingLabelText(clusterLabels[clusterId] || '')
    setTimeout(() => labelInputRef.current?.focus(), 0)
  }

  const saveLabel = (clusterId: number) => {
    if (editingLabelText.trim()) {
      setClusterLabels(prev => ({ ...prev, [clusterId]: editingLabelText.trim() }))
    } else {
      setClusterLabels(prev => {
        const newLabels = { ...prev }
        delete newLabels[clusterId]
        return newLabels
      })
    }
    setEditingLabelId(null)
  }

  const cancelEditingLabel = () => {
    setEditingLabelId(null)
    setEditingLabelText('')
  }

  // Get merged clusters (size > 1) for sidebar
  const mergedClusters: MergedCluster[] = Object.entries(clusters)
    .filter(([, indices]) => indices.length > 1)
    .map(([clusterId, indices]) => ({
      clusterId: parseInt(clusterId),
      indices,
      words: indices.map(i => grid[i]?.word).filter(Boolean),
      color: clusterColors[parseInt(clusterId)],
      label: clusterLabels[parseInt(clusterId)]
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
      const label1 = clusterLabels[clusterId1]
      const label2 = clusterLabels[clusterId2]

      let mergedColor: string
      let mergedLabel: string | undefined
      if (size1 === 1 && size2 === 1) {
        mergedColor = generateColor(nextColorIndex)
        setNextColorIndex(prev => prev + 1)
        mergedLabel = label1 || label2
      } else if (size1 === 1) {
        mergedColor = color2
        mergedLabel = label2 || label1
      } else if (size2 === 1) {
        mergedColor = color1
        mergedLabel = label1 || label2
      } else {
        // Both are merged groups - keep the larger one's label, or the second one's if same size
        mergedColor = size1 > size2 ? color1 : color2
        mergedLabel = size1 > size2 ? (label1 || label2) : (label2 || label1)
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

      const newClusterLabels = { ...clusterLabels }
      delete newClusterLabels[clusterId1]
      delete newClusterLabels[clusterId2]
      if (mergedLabel) {
        newClusterLabels[newClusterId] = mergedLabel
      }

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
        delete newClusterLabels[newClusterId]
        setClusters(newClusters)
        setClusterColors(newClusterColors)
        setClusterLabels(newClusterLabels)

        setMessage(`Found: ${group.name}!`)
        setTimeout(() => setMessage(''), 2000)
      } else {
        setGrid(newGrid)
        setClusters(newClusters)
        setClusterColors(newClusterColors)
        setClusterLabels(newClusterLabels)
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
    setClusterLabels({})
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
          <button onClick={handleShuffle} title="Shuffle words">
            <Shuffle size={14} />
          </button>
          <button onClick={handleSort} title="Sort alphabetically">
            <ArrowDownAZ size={14} />
          </button>
          <button onClick={handleCompact} title="Compact grid">
            <AlignLeft size={14} />
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
                You can add labels to groups to help remember what they might be.
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
              {mergedClusters.map(({ clusterId, indices, words, color, label }) => {
                const isSelected = selectedClusterId === clusterId
                const isEditing = editingLabelId === clusterId
                const preview = words.slice(0, 3)
                const remaining = words.length - 3

                return (
                  <div
                    key={clusterId}
                    className={`cw-sidebar-group ${isSelected ? 'cw-selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => !isEditing && handleClusterClick(clusterId)}
                  >
                    <div className="cw-sidebar-group-header">
                      <div className="cw-sidebar-group-count">{indices.length}/{n}</div>
                      {isEditing ? (
                        <div className="cw-label-edit" onClick={e => e.stopPropagation()}>
                          <input
                            ref={labelInputRef}
                            type="text"
                            value={editingLabelText}
                            onChange={e => setEditingLabelText(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveLabel(clusterId)
                              if (e.key === 'Escape') cancelEditingLabel()
                            }}
                            className="cw-label-input"
                            placeholder="Label..."
                            maxLength={20}
                          />
                          <button onClick={() => saveLabel(clusterId)} className="cw-label-btn cw-label-save" title="Save">
                            <Check size={12} />
                          </button>
                          <button onClick={cancelEditingLabel} className="cw-label-btn cw-label-cancel" title="Cancel">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => startEditingLabel(clusterId, e)}
                          className="cw-label-edit-btn"
                          title={label ? 'Edit label' : 'Add label'}
                        >
                          {label ? (
                            <span className="cw-label-text">{label}</span>
                          ) : (
                            <Pencil size={12} />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="cw-sidebar-group-words">
                      {preview.join(', ')}
                      {remaining > 0 && <span className="cw-more">+{remaining}</span>}
                    </div>
                  </div>
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
