export type HallPuzzleId = 'example' | 'large'
export type LaserSide = 'top' | 'right' | 'bottom' | 'left'
export type MirrorOrientation = 0 | 1 | 2
export type MirrorBoard = MirrorOrientation[][]

export type LaserClue = {
  side: LaserSide
  index: number
  target: number
}

export type HallPuzzleDefinition = {
  id: HallPuzzleId
  label: string
  size: number
  clues: LaserClue[]
}

export const HALL_PUZZLES: Record<HallPuzzleId, HallPuzzleDefinition> = {
  example: {
    id: 'example',
    label: 'Example puzzle',
    size: 5,
    clues: [
      { side: 'top', index: 2, target: 9 },
      { side: 'right', index: 1, target: 75 },
      { side: 'bottom', index: 2, target: 36 },
      { side: 'left', index: 3, target: 16 },
    ],
  },
  large: {
    id: 'large',
    label: 'Large puzzle',
    size: 10,
    clues: [
      { side: 'top', index: 2, target: 112 },
      { side: 'top', index: 4, target: 48 },
      { side: 'top', index: 5, target: 3087 },
      { side: 'top', index: 6, target: 9 },
      { side: 'top', index: 9, target: 1 },
      { side: 'right', index: 1, target: 4 },
      { side: 'right', index: 2, target: 27 },
      { side: 'right', index: 6, target: 16 },
      { side: 'bottom', index: 0, target: 2025 },
      { side: 'bottom', index: 3, target: 12 },
      { side: 'bottom', index: 4, target: 64 },
      { side: 'bottom', index: 5, target: 5 },
      { side: 'bottom', index: 7, target: 405 },
      { side: 'left', index: 3, target: 27 },
      { side: 'left', index: 7, target: 12 },
      { side: 'left', index: 8, target: 225 },
    ],
  },
}

export function createEmptyMirrorBoard(size: number): MirrorBoard {
  return Array.from({ length: size }, () => Array<MirrorOrientation>(size).fill(0))
}
