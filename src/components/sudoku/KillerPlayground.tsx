import { useState } from 'react'
import { killerCageFacts, killerCombinations } from '../../lib/sudoku/killer-combinations'
import { ThermoDiagram, type DiagramCell, type GridPosition } from './ThermoDiagram'

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const box: GridPosition[] = Array.from({ length: 9 }, (_, index) => [Math.floor(index / 3), index % 3])
const format = (values: number[]) => values.length ? values.join(', ') : 'None'

export default function KillerPlayground() {
  const [size, setSize] = useState(3)
  const [sum, setSum] = useState(8)
  const [showRemoved, setShowRemoved] = useState(false)
  const sums = killerCombinations(size)
  const facts = killerCageFacts(size, sum)!
  const outside = digits.filter(digit => !facts.required.includes(digit))
  const outsideCount = 9 - size
  const cageCells = box.slice(0, size)
  const cells: DiagramCell[] = box.map((at, index) => {
    const inside = index < size
    const candidates = inside ? facts.possible : outside
    const required = inside ? facts.required : facts.avoided
    return {
      at,
      highlight: inside ? 'given' : 'deduced',
      ...(candidates.length === 1 ? { value: candidates[0] } : {
        cornerNotes: required,
        removed: showRemoved ? inside ? facts.avoided : facts.required : [],
      }),
    }
  })
  const controlClass = 'w-16 rounded-lg border border-current/30 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1.5'

  function changeSize(next: number) {
    const available = killerCombinations(next)
    setSize(next)
    setSum(current => Math.max(available[0].sum, Math.min(available[available.length - 1].sum, current)))
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Explore a Killer cage</h4>
      <p className="text-fs-7">Choose a cage size and total to see what follows from the clue. The blue cage is entirely inside one 3×3 box; the green cells are the rest of that box. Top-left corner notes show only digits that must appear somewhere in that coloured region. If none are required, the cells stay blank. A large digit means that cell is forced.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 rounded-lg border border-current/20 p-3 md:p-4">
        <figure className="min-w-0">
          <ThermoDiagram rows={3} columns={3} thermos={[]} cages={[{ sum, cells: cageCells }]} cells={cells} maxWidth={320}
            label={`${size}-cell Killer cage totalling ${sum} inside a 3 by 3 box. Required inside: ${format(facts.required)}. Excluded inside: ${format(facts.avoided)}. ${outsideCount ? `Required somewhere outside the cage in this box: ${format(facts.avoided)}. Outside candidates: ${format(outside)}.` : 'The cage fills the box.'}`} />
          <figcaption className="mt-3 text-fs-7">Dashed outline: cage. Blue: inside. Green: outside, in the same box{showRemoved ? '. Red crossed-out digits are excluded' : ''}.</figcaption>
        </figure>
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-fs-7">
            <label className="inline-flex items-center gap-2">Size
              <select aria-label="Killer cage size" className={controlClass} value={size} onChange={event => changeSize(Number(event.target.value))}>
                {digits.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="inline-flex items-center gap-2">Sum
              <select aria-label="Killer cage sum" className={controlClass} value={sum} onChange={event => setSum(Number(event.target.value))}>
                {sums.map(row => <option key={row.sum} value={row.sum}>{row.sum}</option>)}
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-fs-7 cursor-pointer">
            <input type="checkbox" className="accent-orange-yellow-crayola" checked={showRemoved} onChange={event => setShowRemoved(event.target.checked)} />
            Show excluded digits
          </label>
          <div role="status" className="text-fs-7 space-y-3">
            <dl className="space-y-2">
              <div><dt className="font-semibold">Must appear inside</dt><dd>{format(facts.required)}</dd></div>
              <div><dt className="font-semibold">Cannot appear inside</dt><dd>{format(facts.avoided)}</dd></div>
              <div><dt className="font-semibold">Must appear outside, in this box</dt><dd>{outsideCount ? format(facts.avoided) : 'No outside cells'}</dd></div>
              <div><dt className="font-semibold">Cannot appear outside, in this box</dt><dd>{outsideCount ? format(facts.required) : 'No outside cells'}</dd></div>
            </dl>
            {outsideCount > 0 ? <p>The remaining {outsideCount} {outsideCount === 1 ? 'cell totals' : 'cells total'} <strong>{45 - sum}</strong> (45 − {sum}).</p> : <p>The cage fills the box and contains every digit from 1 to 9.</p>}
          </div>
        </div>
      </div>
      <div className="text-fs-7">
        <p className="font-semibold mb-2">{facts.combinations.length === 1 ? 'Unique digit combination' : `${facts.combinations.length} possible digit combinations`}</p>
        <ul className="flex flex-wrap gap-2">{facts.combinations.map(combo => <li key={combo.join('-')} className="rounded border border-current/20 px-2 py-1 font-mono">{combo.join(' + ')} (={sum})</li>)}</ul>
      </div>
      <p className="text-fs-7">Corner notes are not complete candidate lists. For example, a 3-cell cage totalling 8 has corner 1 inside and corner 6, 7, 8, 9 outside: the cage must contain 1, while the other two digits are still unresolved. A 3-cell cage totalling 7 has corner 1, 2, 4 inside, fixing its digit set but not their positions. Outside deductions rely on the whole cage being in this box.</p>
    </div>
  )
}
