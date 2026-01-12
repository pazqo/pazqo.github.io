import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Load puzzle IDs from the challenge file
const challengePuzzles = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'src/data/challenge_100_puzzles.json'), 'utf-8')
)
const puzzleIds = new Set(challengePuzzles.map(p => p.puzzle_id))

// Scan the solves folder
const solvesDir = path.join(rootDir, 'public/solves')
const files = fs.existsSync(solvesDir) ? fs.readdirSync(solvesDir) : []

// Build the index by matching files to puzzle IDs
const index = {}

for (const file of files) {
  // Find which puzzle_id this file belongs to
  for (const puzzleId of puzzleIds) {
    if (file.includes(puzzleId)) {
      if (!index[puzzleId]) {
        index[puzzleId] = {}
      }

      if (file.endsWith('.replay')) {
        index[puzzleId].replay = file
      } else if (file.endsWith('.gif')) {
        index[puzzleId].gif = file
      }
      break
    }
  }
}

// Write the index
const outputPath = path.join(rootDir, 'src/data/solves_index.json')
fs.writeFileSync(outputPath, JSON.stringify(index, null, 2) + '\n')

const solveCount = Object.keys(index).length
console.log(`Generated solves_index.json with ${solveCount} solved puzzles`)
