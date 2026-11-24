import { useState } from 'react'
import { arrowCandidates } from '../../lib/sudoku/arrow-candidates'
import { ThermoDiagram as SudokuDiagram, type DiagramCell, type GridPosition } from './ThermoDiagram'

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const row: GridPosition[] = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
const bent: GridPosition[] = [[1, 1], [2, 2], [3, 3], [3, 2], [2, 1]]

export default function ArrowPlayground() {
  const [length, setLength] = useState(2)
  const [layout, setLayout] = useState<'row' | 'bent'>('row')
  const [total, setTotal] = useState(0)
  const path = (layout === 'row' ? row : bent).slice(0, length + 1)
  const result = arrowCandidates(path, total ? [total] : digits)
  const valid = result.assignments.length > 0
  const domains = [result.circles, ...result.shaft]
  const cells: DiagramCell[] = path.map((at, index) => ({ at,
    ...(index === 0 && total ? { value: total, highlight: 'given' as const }
      : domains[index].length === 1 ? { value: domains[index][0], highlight: 'deduced' as const }
      : { candidates: domains[index] }),
  }))
  const controlClass = 'rounded-lg border border-current/30 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1.5'

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Explore arrow lengths and geometry</h4>
      <p className="text-fs-7">Change the shaft length, layout or circle digit. Centre notes show candidates supported by the arrow sum and the visible row, column and box relationships. The circle is not counted in the shaft length. These are grid fragments, not complete puzzles.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 rounded-lg border border-current/20 p-3 md:p-4">
        <figure className="min-w-0">
          <SudokuDiagram rows={layout === 'row' ? 1 : 4} columns={layout === 'row' ? length + 1 : 4} thermos={[]} arrows={[path]} cells={cells} maxWidth={360}
            label={`${length}-cell arrow shaft, ${layout === 'row' ? 'all in one row' : 'bending across box boundaries'}. Circle ${total || 'unknown'}. ${valid ? `Possible circle digits: ${result.circles.join(', ')}. ${result.shaft.map((domain, index) => `Shaft cell ${index + 1}: ${domain.join(', ')}.`).join(' ')}` : 'No assignment satisfies the arrow and Sudoku rules.'}`} />
          <figcaption className="mt-3 text-fs-7">{layout === 'row' ? 'Every shaft cell shares a row, so all shaft digits must be different.' : 'The shaft’s first two cells share no row, column or box, so they may match. Other pairs may still see each other.'}</figcaption>
        </figure>
        <div className="min-w-0 space-y-4 text-fs-7">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2">Length
              <select aria-label="Arrow shaft length" className={controlClass} value={length} onChange={event => setLength(Number(event.target.value))}>
                {[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="inline-flex items-center gap-2">Circle
              <select aria-label="Arrow circle digit" className={controlClass} value={total} onChange={event => setTotal(Number(event.target.value))}>
                <option value={0}>Any</option>
                {digits.map(digit => <option key={digit} value={digit}>{digit}</option>)}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">Layout
            <select aria-label="Arrow layout" className={`${controlClass} w-full`} value={layout} onChange={event => setLayout(event.target.value as 'row' | 'bent')}>
              <option value="row">Same row — no repeats</option>
              <option value="bent">Across boxes — some repeats allowed</option>
            </select>
          </label>
          <p role="status" className={valid ? '' : 'text-red-400'}>{valid
            ? `Circle candidates: ${result.circles.join(', ')}. ${result.combinations.length} digit ${result.combinations.length === 1 ? 'combination' : 'combinations'} across ${result.assignments.length} valid ${result.assignments.length === 1 ? 'arrangement' : 'arrangements'}.`
            : layout === 'row' && length === 4 ? 'Impossible: four different shaft digits total at least 1 + 2 + 3 + 4 = 10, but the circle is at most 9.'
              : 'No valid arrangement for this circle, length and layout. Try another circle digit or a different layout.'}</p>
          <p>Try length 2 with circle 8, then switch layouts to see 4 + 4 appear. Next, try length 4: it is impossible in one row, but can work across boxes.</p>
        </div>
      </div>
      {valid && <div className="text-fs-7">
        <h5 className="font-semibold mb-2">Possible shaft digit combinations</h5>
        <ul className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">{result.combinations.map(combo => <li key={combo.join('-')} className="rounded border border-current/20 px-2 py-1 font-mono">{combo.join(' + ')} (={combo.reduce((sum, digit) => sum + digit, 0)})</li>)}</ul>
        <p className="mt-2">These are unordered digit sets, including repeats when allowed. Their placements must still respect the arrow’s geometry.</p>
      </div>}
    </div>
  )
}
