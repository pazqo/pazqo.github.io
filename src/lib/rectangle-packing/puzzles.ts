import type { Point, Rectangle } from './geometry'

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

// Small independent perturbations of an almost evenly spaced diagonal retain
// strict coordinate order and a tight coverage ceiling. Labels are shuffled.
export function tightPuzzle(count: number, seed: number): Point[] {
  const random = seededRandom(seed)
  const interior = Array.from({ length: count - 1 }, (_, i) => {
    const t = (i + 1 + (random() - .5) * .25) / count
    return { x: t + (random() - .5) * .006 / count, y: t + (random() - .5) * .006 / count }
  })
  for (let i = interior.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1)); [interior[i], interior[j]] = [interior[j], interior[i]]
  }
  return [{ id: 1, x: 0, y: 0 }, ...interior.map((p, i) => ({ id: i + 2, ...p }))]
}

export function chainCertificate(points: Point[]): { upper: number; solution: Rectangle[]; lower: number } | null {
  const chain = [...points].sort((a, b) => a.x - b.x)
  if (!chain.length || chain[0].x !== 0 || chain[0].y !== 0 || chain.some((p, i) => i > 0 && (p.x <= chain[i - 1].x || p.y <= chain[i - 1].y))) return null
  const vertical: Rectangle[] = [], horizontal: Rectangle[] = []
  let upper = 0
  for (let i = 0; i < chain.length; i++) {
    const p = chain[i], next = chain[i + 1] ?? { x: 1, y: 1 }
    const v = { pointId: p.id, x: p.x, y: p.y, width: next.x - p.x, height: 1 - p.y }
    const h = { pointId: p.id, x: p.x, y: p.y, width: 1 - p.x, height: next.y - p.y }
    vertical.push(v); horizontal.push(h)
    // Avoid containing the next anchor: right <= next.x OR top <= next.y.
    // Thus this individual area bound holds even if all overlap is ignored.
    upper += Math.max(v.width * v.height, h.width * h.height)
  }
  const total = (rs: Rectangle[]) => rs.reduce((s, r) => s + r.width * r.height, 0)
  const solution = total(vertical) >= total(horizontal) ? vertical : horizontal
  return { upper: Math.min(1, upper), lower: total(solution), solution }
}
