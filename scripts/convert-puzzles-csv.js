import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Dropbox direct download URL
const DROPBOX_URL = 'https://dl.dropboxusercontent.com/scl/fi/7y6bi0qj0sbgjxs2kxemx/catalog.csv?rlkey=k3coqisr65hrnogei5fsfcdc5&dl=1'

console.log('Fetching puzzle catalog from Dropbox...')

const response = await fetch(DROPBOX_URL)
if (!response.ok) {
  console.error(`Error: Failed to fetch CSV from Dropbox (${response.status})`)
  process.exit(1)
}

const csvContent = await response.text()
const lines = csvContent.trim().split('\n')
const headers = lines[0].split(',')

// Parse CSV rows (simple parser - assumes no commas in values)
const puzzles = []

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',')
  const row = {}

  headers.forEach((header, idx) => {
    row[header.trim()] = (values[idx] || '').trim()
  })

  // Skip puzzles that show the solution
  if (row.ShowsSolution === 'Yes') {
    continue
  }

  // Build the puzzle object with only the fields we want
  const puzzle = {
    name: row.Name || '',
    imageLink: row.ImageLink || '',
    solved: row.Solved === 'Yes',
    author: row.Author || '',
    difficulty: row.Difficulty ? parseInt(row.Difficulty, 10) : null,
    enjoyment: row.Enjoyment ? parseInt(row.Enjoyment, 10) : null,
    purchaseLink: row.PurchaseLink || '',
    price: row.Price || ''
  }

  // Only add if we have at least a name
  if (puzzle.name) {
    puzzles.push(puzzle)
  }
}

// Write the JSON file
const outputPath = path.join(rootDir, 'src/data/puzzle-collection.json')
fs.writeFileSync(outputPath, JSON.stringify(puzzles, null, 2) + '\n')

const total = puzzles.length
const solved = puzzles.filter(p => p.solved).length
console.log(`Generated puzzle-collection.json: ${total} puzzles (${solved} solved, ${total - solved} unsolved)`)
