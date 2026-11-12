import { area, contains, overlaps, maximalRectangles, type Point, type Rectangle } from './geometry.ts'

export interface SearchProgress { rectangles: Rectangle[]; covered: number; visited: number; elapsed: number; complete: boolean }

// In an optimum, expand each rectangle until blocked. Its right edge then
// meets x=1, a point, or another rectangle's fixed left edge (an anchor x).
// Its top edge likewise meets y=1 or an anchor y. Thus the point-coordinate
// grid contains an optimum. Keep NON-maximal empty grid rectangles too:
// a smaller choice can make room for a better combination at other anchors.
export function gridRectangles(point: Point, points: Point[]): Rectangle[] {
  const rights = [...new Set([1, ...points.map(p => p.x)])].filter(x => x > point.x)
  const tops = [...new Set([1, ...points.map(p => p.y)])].filter(y => y > point.y)
  const options: Rectangle[] = []
  for (const right of rights) for (const top of tops) {
    const r = { pointId: point.id, x: point.x, y: point.y, width: right - point.x, height: top - point.y }
    if (!points.some(p => p.id !== point.id && contains(r, p))) options.push(r)
  }
  return options.sort((a, b) => area(b) - area(a))
}

export function* searchPackings(points: Point[], initial: Rectangle[] = []): Generator<SearchProgress, SearchProgress> {
  const started = performance.now()
  let best = [...initial], bestArea = best.reduce((s, r) => s + area(r), 0), visited = 0
  const snapshot = (complete = false): SearchProgress => ({ rectangles: best, covered: bestArea, visited, elapsed: performance.now() - started, complete })
  // Supply a complete feasible incumbent before the exhaustive search starts.
  let greedy: Rectangle[] = []
  while (greedy.length < points.length) {
    const options = points.flatMap(p => maximalRectangles(p, points, greedy))
    if (!options.length) break
    options.sort((a, b) => area(b) - area(a))
    greedy = [...greedy, options[0]]
  }
  const greedyArea = greedy.reduce((s, r) => s + area(r), 0)
  if (greedyArea > bestArea) { best = greedy; bestArea = greedyArea }
  yield snapshot()
  const options = points.map(p => gridRectangles(p, points)).sort((a, b) => a.length - b.length)
  interface State { placed: Rectangle[]; remaining: Rectangle[][]; covered: number }
  const stack: State[] = [{ placed: [], remaining: options, covered: 0 }]
  while (stack.length) {
    const state = stack.pop()!
    visited++
    if (state.covered > bestArea + 1e-12) { best = state.placed; bestArea = state.covered }
    const upper = Math.min(1, state.covered + state.remaining.reduce((s, choices) => s + (choices.length ? area(choices[0]) : 0), 0))
    if (upper > bestArea + 1e-12 && state.remaining.length) {
      // Branch on the most constrained anchor, then filter conflicts for every
      // remaining anchor. Each combination is visited once, without n! orders.
      const [choices, ...rest] = state.remaining
      // A skipped anchor represents zero area; useful for boundary degeneracies.
      stack.push({ placed: state.placed, remaining: rest, covered: state.covered })
      for (let i = choices.length - 1; i >= 0; i--) {
        const r = choices[i]
        const remaining = rest.map(list => list.filter(other => !overlaps(r, other))).sort((a, b) => a.length - b.length)
        stack.push({ placed: [...state.placed, r], remaining, covered: state.covered + area(r) })
      }
    }
    if (visited % 100 === 0) yield snapshot()
  }
  return snapshot(true)
}

// Minimize coverage over greedy runs: at each step only maximum-area choices
// for that anchor are allowed. Every reported incumbent is a finished run,
// never an unfinished packing with misleadingly low coverage.
export function* searchMinimumGreedy(points: Point[]): Generator<SearchProgress, SearchProgress> {
  const started = performance.now()
  let visited = 0
  let worst: Rectangle[] = []
  while (worst.length < points.length) {
    const choices = points.flatMap(p => maximalRectangles(p, points, worst).slice(0, 1))
    if (!choices.length) break
    choices.sort((a, b) => area(a) - area(b))
    worst = [...worst, choices[0]]
  }
  let worstArea = worst.reduce((sum, r) => sum + area(r), 0)
  const snapshot = (complete = false): SearchProgress => ({ rectangles: worst, covered: worstArea, visited, elapsed: performance.now() - started, complete })
  yield snapshot()
  const stack: Rectangle[][] = [[]]
  const seen = new Set<string>()
  while (stack.length) {
    const placed = stack.pop()!
    visited++
    const covered = placed.reduce((sum, r) => sum + area(r), 0)
    // Later placements only increase coverage, so this branch cannot improve.
    if (covered < worstArea - 1e-12) {
      const key = [...placed].sort((a, b) => a.pointId - b.pointId).map(r => `${r.pointId}:${r.width}:${r.height}`).join('|')
      if (!seen.has(key)) {
        if (seen.size < 100000) seen.add(key)
        const choices = points.flatMap(p => {
          const options = maximalRectangles(p, points, placed)
          return options.filter(r => Math.abs(area(r) - area(options[0])) <= 1e-12)
        }).sort((a, b) => area(b) - area(a))
        if (!choices.length) { worst = placed; worstArea = covered }
        else for (const r of choices) stack.push([...placed, r])
      }
    }
    if (visited % 100 === 0) yield snapshot()
  }
  return snapshot(true)
}
