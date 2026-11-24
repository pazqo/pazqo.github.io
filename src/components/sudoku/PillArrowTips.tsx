import { useState } from 'react'
import { pillBounds } from '../../lib/sudoku/pill-bounds'
import { ThermoDiagram as SudokuDiagram, ThermoExample as SudokuExample, type GridPosition } from './ThermoDiagram'

const pill: GridPosition[] = [[0, 0], [0, 1]]
const twoShaft: GridPosition[] = [[0, 1], [0, 2], [0, 3]]
const threeShaft: GridPosition[] = [...twoShaft, [0, 4]]
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function PillArrowTips() {
  const [pillSize, setPillSize] = useState(2)
  const [length, setLength] = useState(2)
  const [distinct, setDistinct] = useState(false)
  const bounds = pillBounds(pillSize, length, distinct)
  const controlClass = 'rounded-lg border border-current/30 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1.5'

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-2">Pill arrows: the total has several digits</h4>
        <p className="mb-3">Read a horizontal pill left to right, or a vertical pill top to bottom, unless the puzzle specifies otherwise. A pill containing 1, 7 means <strong>17</strong>, not 1 + 7. Only the shaft’s digits contribute to that total.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Straight pill digits are different.</strong> They share a row or column, so 11, 22 and 121 are impossible. In standard 1–9 Sudoku there is no zero, so 10 and 20 are impossible too. A 2-cell pill is at least 12; a 3-cell pill is at least 123.</li>
          <li><strong>Do not extend that no-repeat rule to the shaft.</strong> Shaft digits can repeat when their cells do not see each other. Pill digits can also occur on the shaft if the corresponding cells do not see each other.</li>
          <li><strong>Bound the first digit from the shaft length.</strong> With n shaft cells the total is at most 9n. If those n cells must all differ, the maximum is n(19 − n) / 2. Keep only pill numbers within the bounds, with no zero or repeated pill digits.</li>
        </ul>
      </div>

      <div className="rounded-lg border border-current/20 p-3 md:p-4 space-y-4">
        <h5 className="font-semibold">Explore leading digits</h5>
        <div className="flex flex-wrap items-center gap-4 text-fs-7">
          <label className="inline-flex items-center gap-2">Pill cells
            <select aria-label="Pill size" className={controlClass} value={pillSize} onChange={event => setPillSize(Number(event.target.value))}>
              <option value={2}>2</option><option value={3}>3</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-2">Shaft length
            <select aria-label="Pill arrow shaft length" className={controlClass} value={length} onChange={event => setLength(Number(event.target.value))}>
              {Array.from({ length: distinct ? 9 : 18 }, (_, index) => index + 1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2 text-fs-7 cursor-pointer">
          <input type="checkbox" className="accent-orange-yellow-crayola" checked={distinct} onChange={event => { setDistinct(event.target.checked); if (event.target.checked) setLength(current => Math.min(current, 9)) }} />
          All shaft digits must be different
        </label>
        <div role="status" className="space-y-2 text-fs-7">
          <p>Shaft total: <strong>{bounds.minimum}–{bounds.maximum}</strong>.</p>
          {bounds.totals.length ? <>
            <p>Possible leading {bounds.candidates[0].length === 1 ? 'digit' : 'digits'}: <strong>{bounds.candidates[0].join(', ')}</strong>.</p>
            <p>{bounds.candidates.map((candidates, index) => `${pillSize === 3 ? ['Hundreds', 'Tens', 'Units'][index] : ['Tens', 'Units'][index]}: ${candidates.join(', ')}`).join(' · ')}</p>
          </> : <p className="text-red-400">No {pillSize}-digit pill fits these bounds with distinct nonzero pill digits.</p>}
        </div>
        {bounds.totals.length > 0 && <div className="text-fs-7">
          <p className="font-medium mb-2">Pill totals that pass the bounds</p>
          <ul className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">{bounds.totals.map(total => <li key={total} className="font-mono rounded border border-current/20 px-2 py-1">{total}</li>)}</ul>
        </div>}
        <p className="text-fs-7">These are arithmetic bounds, not a full grid solver. The actual positions, shared houses, and candidates of both the pill and shaft can eliminate more possibilities. Leave the checkbox clear if repeats may occur; it does not mean every repeat is allowed.</p>
      </div>

      <div>
        <h5 className="font-semibold mb-2">Short shafts restrict the tens digit</h5>
        <p>A 2-cell shaft totals at most 18, so a 2-cell pill must start with 1. If the shaft cells see each other, the maximum is 8 + 9 = 17. A 3-cell shaft with distinct digits totals at most 7 + 8 + 9 = 24, so its pill starts with 1 or 2.</p>
        <SudokuExample title="Two shaft cells determine the pill as 17" rows={1} columns={4} thermos={[]} pills={[pill]} arrows={[twoShaft]}
          before={[{ at: [0, 0], candidates: digits }, { at: [0, 1], candidates: [1, 2, 3, 4, 5, 6, 7] }, { at: [0, 2], value: 8, highlight: 'given' }, { at: [0, 3], value: 9, highlight: 'given' }]}
          after={[{ at: [0, 0], value: 1, highlight: 'deduced' }, { at: [0, 1], value: 7, highlight: 'deduced' }, { at: [0, 2], value: 8, highlight: 'given' }, { at: [0, 3], value: 9, highlight: 'given' }]}
          beforeDescription="The pill is read left to right. Its two shaft cells contain 8 and 9. The pill cells are not added to the shaft."
          afterDescription="8 + 9 = 17, so the pill is 1 then 7. All four cells are in one row and have different digits." />
        <SudokuExample title="Three distinct shaft cells allow a leading 2" rows={1} columns={5} thermos={[]} pills={[pill]} arrows={[threeShaft]}
          before={[{ at: [0, 0], candidates: [1, 2] }, { at: [0, 1], candidates: [1, 2, 3, 4, 5, 6] }, { at: [0, 2], value: 7, highlight: 'given' }, { at: [0, 3], value: 8, highlight: 'given' }, { at: [0, 4], value: 9, highlight: 'given' }]}
          after={[{ at: [0, 0], value: 2, highlight: 'deduced' }, { at: [0, 1], value: 4, highlight: 'deduced' }, { at: [0, 2], value: 7, highlight: 'given' }, { at: [0, 3], value: 8, highlight: 'given' }, { at: [0, 4], value: 9, highlight: 'given' }]}
          beforeDescription="The shaft digits are 7, 8, 9. Even before adding them, three distinct shaft digits cap the total at 24, restricting the tens digit to 1 or 2."
          afterDescription="7 + 8 + 9 = 24. Write 2 and 4 in the pill, not a single digit summing with the other pill cell." />
        <SudokuExample title="The pill itself cannot contain 11" rows={1} columns={4} thermos={[]} pills={[pill]} arrows={[twoShaft]}
          before={[{ at: [0, 0], value: 1, highlight: 'given' }, { at: [0, 1], candidates: [1, 2] }, { at: [0, 2], candidates: [3, 4] }, { at: [0, 3], candidates: [8, 9] }]}
          after={[{ at: [0, 0], value: 1, highlight: 'given' }, { at: [0, 1], value: 2, highlight: 'deduced' }, { at: [0, 2], candidates: [3, 4] }, { at: [0, 3], candidates: [8, 9] }]}
          beforeDescription="Other clues leave 1 or 2 in the units cell. The tens cell is already 1. Could the pill be 11?"
          afterDescription="No: the pill cells share a row. Remove the repeated 1, making the pill 12. The shaft is either 3 + 9 or 4 + 8; its order is not yet fixed." />
      </div>

      <div>
        <h5 className="font-semibold mb-2">Three-digit pills need much longer shafts</h5>
        <figure className="my-4 rounded-lg border border-current/20 p-3 md:p-4">
          <SudokuDiagram rows={1} columns={3} thermos={[]} pills={[[[0, 0], [0, 1], [0, 2]]]}
            cells={[{ at: [0, 0], value: 1 }, { at: [0, 1], value: 2 }, { at: [0, 2], value: 3 }]}
            label="A three-cell pill containing 1, 2, 3, read as the number 123. This is the smallest straight three-cell pill. Its shaft is omitted." />
          <figcaption className="mt-3 text-fs-7">The smallest straight 3-cell pill reads 123, not 1 + 2 + 3. Its shaft is omitted here; that shaft would have to total 123.</figcaption>
        </figure>
        <p className="mb-3">The smallest straight 3-cell pill is 123. Thirteen shaft cells total at most 13 × 9 = 117, so at least <strong>14 shaft cells</strong> are necessary even when repeats may occur. This is only a lower bound: the actual geometry can force a longer shaft.</p>
        <p>If all shaft digits must differ, their total is at most 1 + 2 + ⋯ + 9 = 45, regardless of length. Such a shaft can never reach a 3-digit pill. Try a 3-cell pill with length 14 above: the upper bound 126 restricts it to 123, 124, 125 or 126, all starting with 12.</p>
      </div>
      <p className="text-fs-7">Pill reading convention: <a href="https://crackingthecryptic.com/sudoku?id=522" target="_blank" rel="noopener noreferrer" className="text-orange-yellow-crayola hover:underline">Octopus by Aad van de Wetering, via Cracking the Cryptic</a>. Bent pills and special rules may require different digit-order or no-repeat assumptions.</p>
    </div>
  )
}
