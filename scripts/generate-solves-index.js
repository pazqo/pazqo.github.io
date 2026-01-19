import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Load puzzles from the challenge file
const challengePuzzles = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'src/data/challenge_100_puzzles.json'), 'utf-8')
)

// Normalize a string for fuzzy matching (lowercase, remove underscores/spaces/hyphens)
function normalize(str) {
  return str.toLowerCase().replace(/[_\s-]/g, '')
}

// Extract author and title from filename pattern: sudokupad-{Author}-{Title}[-extra].ext
function parseFilename(filename) {
  // Remove extension and any trailing metadata like -a1234-d5678
  const withoutExt = filename.replace(/\.(replay|gif)$/, '')
  const withoutMeta = withoutExt.replace(/-a\d+-d\d+$/, '')

  // Expected format: sudokupad-Author-Title
  const parts = withoutMeta.split('-')
  if (parts.length >= 3 && parts[0] === 'sudokupad') {
    const author = parts[1]
    const title = parts.slice(2).join('-')
    return { author, title }
  }
  return null
}

// Find matching puzzle for a file
function findMatchingPuzzle(file) {
  // First, try exact puzzle_id match (fastest)
  for (const puzzle of challengePuzzles) {
    if (file.includes(puzzle.puzzle_id)) {
      return puzzle.puzzle_id
    }
  }

  // Second, try author/title matching from filename
  const parsed = parseFilename(file)
  if (parsed) {
    const normAuthor = normalize(parsed.author)
    const normTitle = normalize(parsed.title)

    for (const puzzle of challengePuzzles) {
      const puzzleAuthor = normalize(puzzle.author || '')
      const puzzleTitle = normalize(puzzle.title || '')

      // Match if both author and title are contained
      if (puzzleAuthor.includes(normAuthor) || normAuthor.includes(puzzleAuthor)) {
        if (puzzleTitle.includes(normTitle) || normTitle.includes(puzzleTitle)) {
          return puzzle.puzzle_id
        }
      }
    }
  }

  return null
}

// Scan the solves folder
const solvesDir = path.join(rootDir, 'public/solves')
const files = fs.existsSync(solvesDir) ? fs.readdirSync(solvesDir) : []

// Build the index by matching files to puzzles
const index = {}

for (const file of files) {
  const puzzleId = findMatchingPuzzle(file)
  if (puzzleId) {
    if (!index[puzzleId]) {
      index[puzzleId] = {}
    }

    if (file.endsWith('.replay')) {
      index[puzzleId].replay = file
    } else if (file.endsWith('.gif')) {
      index[puzzleId].gif = file
    }
  }
}

// Write the index
const outputPath = path.join(rootDir, 'src/data/solves_index.json')
fs.writeFileSync(outputPath, JSON.stringify(index, null, 2) + '\n')

const solveCount = Object.keys(index).length
console.log(`Generated solves_index.json with ${solveCount} solved puzzles`)
