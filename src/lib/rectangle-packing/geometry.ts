import { seededRandom, tightPuzzle } from './puzzles.ts'
import { randomStaircase, staircaseChallenge } from './staircase.ts'
export interface Point { id: number; x: number; y: number }
export interface Rectangle { pointId: number; x: number; y: number; width: number; height: number }
const EPS = 1e-10
export const area = (r: Rectangle) => r.width * r.height
export function contains(r: Rectangle, p: Point) {
  return p.x > r.x + EPS && p.x < r.x + r.width - EPS && p.y > r.y + EPS && p.y < r.y + r.height - EPS
}
export function overlaps(a: Rectangle, b: Rectangle) {
  return Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) + EPS &&
    Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y) + EPS
}

// Every maximal right edge meets a point, an existing rectangle, or the square.
// For each such edge, raise the top until the first obstruction, then discard
// rectangles contained in another candidate with the same anchor.
export function maximalRectangles(point: Point, points: Point[], placed: Rectangle[]): Rectangle[] {
  if (placed.some(r => r.pointId === point.id)) return []
  const edges = [...new Set([1, ...points.map(p => p.x), ...placed.map(r => r.x)])]
    .filter(x => x > point.x + EPS).sort((a, b) => a - b)
  const candidates: Rectangle[] = []
  for (const right of edges) {
    let top = 1
    for (const p of points) {
      if (p.id !== point.id && p.x > point.x + EPS && p.x < right - EPS && p.y > point.y + EPS) top = Math.min(top, p.y)
    }
    for (const r of placed) {
      if (r.x < right - EPS && r.x + r.width > point.x + EPS && r.y + r.height > point.y + EPS) top = Math.min(top, Math.max(point.y, r.y))
    }
    if (top > point.y + EPS) candidates.push({ pointId: point.id, x: point.x, y: point.y, width: right - point.x, height: top - point.y })
  }
  return candidates.filter(r => !candidates.some(other => other.width >= r.width - EPS && other.height >= r.height - EPS && (other.width > r.width + EPS || other.height > r.height + EPS)))
    .sort((a, b) => area(b) - area(a))
}

export function randomPoints(count: number): Point[] {
  // The origin counts toward the total; the remaining anchors lie inside the square.
  // Distinct coordinates avoid coincident anchors and degenerate ties.
  const xs = new Set<number>(), ys = new Set<number>()
  while (xs.size < count - 1) xs.add((1 + Math.floor(Math.random() * 999)) / 1000)
  while (ys.size < count - 1) ys.add((1 + Math.floor(Math.random() * 999)) / 1000)
  const y = [...ys]
  return [{ id: 1, x: 0, y: 0 }, ...[...xs].map((x, i) => ({ id: i + 2, x, y: y[i] }))]
}

export type PointLayout = 'random' | 'diagonal' | 'anti-diagonal' | 'increasing' | 'staircase' | 'random-staircase' | 'fifty-puzzle'

export function generatePoints(count: number, layout: PointLayout, seed = 1): Point[] {
  if (layout === 'random-staircase') return randomStaircase(count, seededRandom(seed)).points
  if (layout === 'fifty-puzzle') return tightPuzzle(count, seed)
  if (layout === 'staircase') return staircaseChallenge().points
  const points = randomPoints(count)
  if (layout === 'random') return points
  const xs = points.slice(1).map(p => p.x).sort((a, b) => a - b)
  const ys = points.slice(1).map(p => p.y).sort((a, b) => a - b)
  return [points[0], ...xs.map((x, i) => ({
    id: i + 2,
    x,
    y: layout === 'diagonal' ? x : layout === 'anti-diagonal' ? 1 - x : ys[i],
  }))]
}
