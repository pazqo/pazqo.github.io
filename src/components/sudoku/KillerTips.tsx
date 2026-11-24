import { useState } from 'react'
import { killerCombinations } from '../../lib/sudoku/killer-combinations'
import KillerPlayground from './KillerPlayground'

export default function KillerTips() {
  const [size, setSize] = useState(2)
  const [limit, setLimit] = useState(2)
  const rows = killerCombinations(size).filter(row => row.combinations.length <= limit)
  const minimum = size * (size + 1) / 2
  const maximum = size * (19 - size) / 2
  const controlClass = 'rounded-lg border border-current/30 bg-[var(--bg-primary)] text-[var(--text-primary)] px-3 py-2'

  return (
    <div className="space-y-6 leading-relaxed">
      <div>
        <h4 className="font-semibold mb-2">General cages</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Digits in a cage add to its total and cannot repeat, even when the cage crosses boxes.</li>
          <li>A unique combination fixes the set of digits, but their positions still depend on the rest of the puzzle.</li>
          <li>Low and high totals are especially restrictive: a 3-cell cage totalling 6 contains 1, 2, 3; a 4-cell cage totalling 30 contains 6, 7, 8, 9.</li>
          <li>When there are few combinations, look for digits they share. A 3-cell cage totalling 8 is either 1 + 2 + 5 or 1 + 3 + 4, so it must contain a 1.</li>
        </ul>
      </div>

      <KillerPlayground />

      <div>
        <h4 className="font-semibold mb-2">The rule of 45 (The Secret)</h4>
        <p>Every row, column and box contains 1–9, so it totals 45. If cages entirely inside a box total 40 and leave one cell uncovered, that cell is 5. For an 8-cell cage, the missing digit is 45 minus the cage total: a total of 40 means the cage contains every digit except 5.</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold mb-2">Dualities</h4>
        <p>Replace each digit using <span className="whitespace-nowrap font-mono">d → 10 − d</span>: 1 pairs with 9, 2 with 8, 3 with 7, 4 with 6, and 5 stays unchanged. Distinct digits remain distinct. For a cage with n cells and total M, the new total is <span className="whitespace-nowrap font-mono">10n − M</span>.</p>
        <p>For example, a 3-cell cage totalling 6 has the unique combination 1 + 2 + 3. Its dual totals <span className="whitespace-nowrap">30 − 6 = 24</span>, with the unique combination 7 + 8 + 9.</p>
        <p>Paired totals have the same number of combinations: every combination for one maps to exactly one for the other. This relates the possible digit sets; it does not mean their placements in a particular grid are equivalent. The table below shows each combination alongside its dual.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Cages without a clue</h4>
        <p className="mb-3">Even without a total, a cage still contains distinct digits, provided the puzzle’s rules say so. For n cells, the smallest total uses 1 through n, and the largest uses 10 − n through 9.</p>
        <p className="mb-4">Minimum: <span className="whitespace-nowrap font-mono">n(n + 1) / 2</span>. Maximum: <span className="whitespace-nowrap font-mono">n(19 − n) / 2</span>. These bounds assume digits 1–9 with no repeats; other clues may narrow them further.</p>
        <div className="overflow-x-auto rounded-lg border border-current/20">
          <table className="w-full text-left text-fs-7">
            <caption className="sr-only">Minimum and maximum Killer cage totals and their difference by cage size</caption>
            <thead><tr className="border-b border-current/20">
              <th scope="col" className="p-3">Cells</th>
              <th scope="col" className="p-3">Minimum total</th>
              <th scope="col" className="p-3">Maximum total</th>
              <th scope="col" className="p-3">Max − min</th>
            </tr></thead>
            <tbody>{[2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <tr key={n} className="border-b last:border-0 border-current/10">
                <th scope="row" className="p-3">{n}</th>
                <td className="p-3">{n * (n + 1) / 2}</td>
                <td className="p-3">{n * (19 - n) / 2}</td>
                <td className="p-3">{n * (9 - n)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Cage combinations</h4>
        <p className="mb-4">Choose a cage size to find sums with a unique combination or just a few possibilities. Each combination is an unordered set of distinct digits from 1 to 9. “Avoided digits” appear in none of the combinations, so they cannot go in the cage. Row, column and box restrictions can eliminate more possibilities.</p>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex flex-col gap-1">
            <span>Cage size</span>
            <select aria-label="Cage size" value={size} onChange={event => setSize(Number(event.target.value))} className={controlClass}>
              {[2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n} cells</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span>Show combinations</span>
            <select aria-label="Show combinations" value={limit} onChange={event => setLimit(Number(event.target.value))} className={controlClass}>
              <option value={1}>Unique only</option>
              <option value={2}>Up to 2 combinations</option>
              <option value={Infinity}>All sums</option>
            </select>
          </label>
        </div>
        <p className="mb-3">For {size} cells, the minimum sum is <strong>{minimum}</strong> and the maximum is <strong>{maximum}</strong>. Both extremes have exactly one combination.</p>
        <p role="status" className="text-fs-7 mb-3">{rows.length} {rows.length === 1 ? 'sum matches' : 'sums match'} these filters.</p>
        <div className="overflow-x-auto rounded-lg border border-current/20">
          <table className="w-full text-left text-fs-7">
            <caption className="sr-only">{size}-cell Killer cage sums and digit combinations</caption>
            <thead><tr className="border-b border-current/20">
              <th scope="col" className="p-3">Sum</th>
              <th scope="col" className="p-3">Ways</th>
              <th scope="col" className="p-3">Combinations</th>
              <th scope="col" className="p-3">Dual combinations</th>
              <th scope="col" className="p-3">Must contain</th>
              <th scope="col" className="p-3">Avoided digits</th>
            </tr></thead>
            <tbody>{rows.map(({ sum, combinations }) => {
              const required = combinations[0].filter(digit => combinations.every(combo => combo.includes(digit)))
              const avoided = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(digit => !combinations.some(combo => combo.includes(digit)))
              return <tr key={sum} className="border-b last:border-0 border-current/10 align-top">
                <th scope="row" className="p-3 text-orange-yellow-crayola">{sum}</th>
                <td className="p-3">{combinations.length === 1 ? 'Unique' : combinations.length}</td>
                <td className="p-3"><ul className="space-y-1">{combinations.map(combo => <li key={combo.join('-')} className="whitespace-nowrap font-mono">{combo.join(' + ')}</li>)}</ul></td>
                <td className="p-3">
                  <ul className="space-y-1">{combinations.map(combo => <li key={combo.join('-')} className="whitespace-nowrap font-mono">{combo.map(digit => 10 - digit).reverse().join(' + ')} (={10 * size - sum})</li>)}</ul>
                </td>
                <td className="p-3">{required.length ? required.join(', ') : 'None'}</td>
                <td className="p-3">{avoided.length ? avoided.join(', ') : 'None'}</td>
              </tr>
            })}</tbody>
          </table>
        </div>
      </div>

      <p className="text-fs-7">Standard cage rules: <a href="https://www.gmpuzzles.com/images/puzzles2025/251023-KillerSudoku.pdf" target="_blank" rel="noopener noreferrer" className="text-orange-yellow-crayola hover:underline">Grandmaster Puzzles</a>. Combinations above are calculated from all distinct-digit sets; they do not account for a particular grid.</p>
    </div>
  )
}
