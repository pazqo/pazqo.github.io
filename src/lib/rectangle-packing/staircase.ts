import type { Point } from './geometry'

// A finite, two-level staircase-and-fence example inspired by Theorem 9 of
// Dumitrescu–Toth. This is not the paper's asymptotic epsilon construction.
// Staircase corners sample xy=c in local coordinates; a nearby fence point
// limits later access. Each exterior column contains a smaller staircase.
export function staircaseChallenge(random?: () => number): { points: Point[]; order: number[] } {
  const steps = random ? 3 + Math.floor(random() * 4) : 6
  interface Corner { x: number; y: number }
  interface Tile { x: number; y: number; width: number; height: number }
  const ordered: Corner[] = []
  function tile(t: Tile, depth: number) {
    const c = random ? .04 + random() * .18 : .15
    const ratio = (1 / c) ** (1 / steps)
    const corners = Array.from({ length: steps - 1 }, (_, i) => ({ x: t.x + t.width * c * ratio ** (i + 1), y: t.y + t.height / ratio ** (i + 1) }))
    for (let i = corners.length - 1; i >= 0; i--) {
      const p = corners[i]
      if (depth) tile({ x: p.x, y: p.y, width: (corners[i + 1]?.x ?? t.x + t.width) - p.x, height: t.y + t.height - p.y }, depth - 1)
      else ordered.push(p)
    }
    ordered.push({ x: t.x, y: t.y }, { x: t.x + t.width * .00001, y: t.y + t.height * (c * ratio + .0001) })
  }
  tile({ x: 0, y: 0, width: 1, height: 1 }, 1)
  const points: Point[] = [{ id: 1, x: 0, y: 0 }]
  const order: number[] = []
  for (const p of ordered) {
    let point = points.find(q => q.x === p.x && q.y === p.y)
    if (!point) { point = { id: points.length + 1, ...p }; points.push(point) }
    order.push(point.id)
  }
  return { points, order }
}

// Point-budgeted variant: each tile reserves its anchor and fence, then divides
// the remaining budget among staircase corners and smaller exterior tiles.
export function randomStaircase(count: number, random: () => number): { points: Point[]; order: number[] } {
  const ordered: { x: number; y: number }[] = []
  function tile(x: number, y: number, width: number, height: number, budget: number) {
    if (budget === 1) { ordered.push({ x, y }); return }
    const cornerCount = Math.min(budget - 2, 3 + Math.floor(random() * 3))
    const c = .06 + random() * .16
    const ratio = (1 / c) ** (1 / (cornerCount + 1))
    const corners = Array.from({ length: cornerCount }, (_, i) => ({ x: x + width * c * ratio ** (i + 1), y: y + height / ratio ** (i + 1) }))
    const extra = Array<number>(cornerCount).fill(0)
    if (cornerCount) {
      const start = Math.floor(random() * cornerCount)
      for (let i = 0; i < budget - cornerCount - 2; i++) extra[(start + i) % cornerCount]++
    }
    for (let i = corners.length - 1; i >= 0; i--) {
      const p = corners[i]
      tile(p.x, p.y, (corners[i + 1]?.x ?? x + width) - p.x, y + height - p.y, 1 + extra[i])
    }
    ordered.push({ x, y }, { x: x + width * .001, y: y + height * (cornerCount ? c * ratio + .0001 : .4 + random() * .2) })
  }
  tile(0, 0, 1, 1, count)
  const points: Point[] = [{ id: 1, x: 0, y: 0 }]
  const order: number[] = []
  for (const p of ordered) {
    let point = points.find(q => q.x === p.x && q.y === p.y)
    if (!point) { point = { id: points.length + 1, ...p }; points.push(point) }
    order.push(point.id)
  }
  return { points, order }
}
