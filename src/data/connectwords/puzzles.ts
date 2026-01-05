/**
 * Puzzle data structure and types for Connect Words game
 */

export interface PuzzleGroup {
  name: string
  words: string[]
  color?: string
  sourceId?: string
}

export interface Puzzle {
  id: number
  title: string
  groups: PuzzleGroup[]
  generated?: boolean
  size?: number
}

export interface ShuffledWord {
  word: string
  groupIndex: number
  groupName: string
  color?: string
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

const basePuzzles: Puzzle[] = [
  {
    id: 1,
    title: "Sample Puzzle (5x5)",
    groups: [
      {
        name: "Programming Languages",
        words: ["Python", "Java", "Rust", "Swift", "Kotlin"],
        color: "#f9df6d"
      },
      {
        name: "Planets",
        words: ["Mars", "Venus", "Saturn", "Jupiter", "Neptune"],
        color: "#a0c35a"
      },
      {
        name: "Musical Instruments",
        words: ["Guitar", "Piano", "Drums", "Violin", "Flute"],
        color: "#b0c4ef"
      },
      {
        name: "Colors",
        words: ["Red", "Blue", "Green", "Yellow", "Purple"],
        color: "#ba81c5"
      },
      {
        name: "Fruits",
        words: ["Apple", "Banana", "Orange", "Mango", "Grape"],
        color: "#f5a589"
      }
    ]
  },
  {
    id: 2,
    title: "Sample Puzzle (6x6)",
    groups: [
      {
        name: "Countries",
        words: ["France", "Japan", "Brazil", "Egypt", "Canada", "India"],
        color: "#f9df6d"
      },
      {
        name: "Sports",
        words: ["Soccer", "Tennis", "Golf", "Hockey", "Rugby", "Cricket"],
        color: "#a0c35a"
      },
      {
        name: "Animals",
        words: ["Lion", "Eagle", "Shark", "Wolf", "Bear", "Tiger"],
        color: "#b0c4ef"
      },
      {
        name: "Elements",
        words: ["Gold", "Silver", "Iron", "Copper", "Zinc", "Nickel"],
        color: "#ba81c5"
      },
      {
        name: "Trees",
        words: ["Oak", "Pine", "Maple", "Birch", "Cedar", "Willow"],
        color: "#f5a589"
      },
      {
        name: "Gems",
        words: ["Ruby", "Diamond", "Emerald", "Sapphire", "Opal", "Topaz"],
        color: "#7dd3fc"
      }
    ]
  },
  {
    id: 3,
    title: "Sample Puzzle (10x10)",
    groups: [
      {
        name: "Programming Languages",
        words: ["Python", "Java", "Rust", "Swift", "Kotlin", "Ruby", "Scala", "Perl", "Lua", "Haskell"],
        color: "#f9df6d"
      },
      {
        name: "World Capitals",
        words: ["Paris", "Tokyo", "Berlin", "Cairo", "Lima", "Oslo", "Rome", "Seoul", "Dublin", "Vienna"],
        color: "#a0c35a"
      },
      {
        name: "Ocean Animals",
        words: ["Whale", "Dolphin", "Octopus", "Jellyfish", "Seahorse", "Starfish", "Lobster", "Crab", "Squid", "Eel"],
        color: "#b0c4ef"
      },
      {
        name: "Vegetables",
        words: ["Carrot", "Broccoli", "Spinach", "Tomato", "Onion", "Pepper", "Celery", "Lettuce", "Cabbage", "Garlic"],
        color: "#ba81c5"
      },
      {
        name: "Car Brands",
        words: ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Tesla", "Volvo", "Porsche", "Ferrari"],
        color: "#f5a589"
      },
      {
        name: "Greek Letters",
        words: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Lambda", "Sigma", "Omega"],
        color: "#7dd3fc"
      },
      {
        name: "Board Games",
        words: ["Chess", "Monopoly", "Scrabble", "Risk", "Clue", "Battleship", "Checkers", "Backgammon", "Dominoes", "Yahtzee"],
        color: "#fca5a5"
      },
      {
        name: "Composers",
        words: ["Mozart", "Beethoven", "Bach", "Chopin", "Vivaldi", "Handel", "Brahms", "Haydn", "Schubert", "Liszt"],
        color: "#86efac"
      },
      {
        name: "Fabrics",
        words: ["Cotton", "Silk", "Wool", "Linen", "Denim", "Velvet", "Satin", "Leather", "Cashmere", "Polyester"],
        color: "#fcd34d"
      },
      {
        name: "Spices",
        words: ["Cinnamon", "Paprika", "Turmeric", "Cumin", "Oregano", "Basil", "Thyme", "Nutmeg", "Saffron", "Ginger"],
        color: "#c4b5fd"
      }
    ]
  }
]

export const puzzles: Puzzle[] = basePuzzles

/**
 * Helper to validate a puzzle structure
 */
export function validatePuzzle(puzzle: Puzzle): ValidationResult {
  if (!puzzle.groups || puzzle.groups.length < 5 || puzzle.groups.length > 100) {
    return { valid: false, error: "Puzzle must have between 5 and 100 groups" }
  }

  const n = puzzle.groups.length

  for (const group of puzzle.groups) {
    if (!group.words || group.words.length !== n) {
      return {
        valid: false,
        error: `Each group must have exactly ${n} words (found ${group.words?.length || 0} in "${group.name}")`
      }
    }
  }

  return { valid: true }
}

/**
 * Get all words from a puzzle, shuffled
 */
export function getShuffledWords(puzzle: Puzzle): ShuffledWord[] {
  const allWords: ShuffledWord[] = puzzle.groups.flatMap((group, groupIndex) =>
    group.words.map(word => ({
      word,
      groupIndex,
      groupName: group.name,
      color: group.color
    }))
  )

  // Fisher-Yates shuffle
  for (let i = allWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allWords[i], allWords[j]] = [allWords[j], allWords[i]]
  }

  return allWords
}
