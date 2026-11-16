import { contains, overlaps, type Point, type PointLayout, type Rectangle } from './geometry'
export interface SavedPacking { id: string; name: string; points: Point[]; rectangles: Rectangle[]; layout: PointLayout; seed?: number }
export const storageKey = 'rectangle-lab-configurations-v1'
export const pointSetKey = (points: Point[]) => [...points].sort((a, b) => a.id - b.id).map(p => `${p.id}:${p.x}:${p.y}`).join('|')
export function readPackings(): SavedPacking[] {
  try {
    const data: SavedPacking[] = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (!Array.isArray(data)) return []
    return data.filter(c => typeof c.id === 'string' && typeof c.name === 'string' && ['random', 'diagonal', 'anti-diagonal', 'increasing', 'staircase', 'random-staircase', 'fifty-puzzle'].includes(c.layout) &&
      Array.isArray(c.points) && c.points.length >= 1 && c.points.length <= 40 && c.points.every(p => Number.isInteger(p.id) && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x < 1 && p.y >= 0 && p.y < 1) &&
      new Set(c.points.map(p => p.id)).size === c.points.length && c.points.some(p => p.x === 0 && p.y === 0) &&
      Array.isArray(c.rectangles) && new Set(c.rectangles.map(r => r.pointId)).size === c.rectangles.length && c.rectangles.every((r, i) => {
        const p = c.points.find(p => p.id === r.pointId)
        return p && r.x === p.x && r.y === p.y && Number.isFinite(r.width) && Number.isFinite(r.height) && r.width > 0 && r.height > 0 && r.x + r.width <= 1 + 1e-10 && r.y + r.height <= 1 + 1e-10 && !c.points.some(q => contains(r, q)) && !c.rectangles.slice(0, i).some(other => overlaps(r, other))
      }))
  } catch { return [] }
}
