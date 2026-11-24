import ArrowPlayground from './ArrowPlayground'
import PillArrowTips from './PillArrowTips'
import { ThermoExample as SudokuExample, type DiagramCell, type GridPosition } from './ThermoDiagram'

const rowArrow: GridPosition[] = [[0, 0], [0, 1], [0, 2]]
const repeatArrow: GridPosition[] = [[1, 1], [2, 2], [3, 3]]
const otherBoxDigits: DiagramCell[] = [1, 2, 3, 6, 7, 8].map((value, index) => ({
  at: [1 + Math.floor(index / 3), index % 3], value, highlight: 'given',
}))

export default function ArrowTips() {
  return (
    <div className="space-y-6 leading-relaxed">
      <div>
        <h4 className="font-semibold mb-2">What changes from Killer cages?</h4>
        <p className="mb-3">The digits on an arrow’s shaft add up to the digit in its circle. The circle is not part of that sum. The same sum-combination reasoning as Killer cages applies, with two differences:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>The total is a Sudoku cell.</strong> Its candidates come from its row, column and box, as well as from the arrow sum. Information flows both ways: the circle restricts the shaft, and the shaft restricts the circle.</li>
          <li><strong>The shaft does not have a no-repeat rule.</strong> Digits may repeat if their cells do not share a row, column or box and no other rule forbids it. Check the arrow’s geometry before reusing a Killer combination.</li>
        </ul>
      </div>

      <ArrowPlayground />

      <div>
        <h4 className="font-semibold mb-2">A small example</h4>
        <p>A 2-cell shaft with an 8 in its circle allows 1 + 7, 2 + 6, 3 + 5 and potentially <strong>4 + 4</strong>. The last option is impossible in a Killer cage, but valid on an arrow if those two cells do not see each other. If they share a row, column or box, discard it and use the same combinations as a 2-cell Killer cage totalling 8.</p>
        <SudokuExample title="Same row: rule out the repeated 4" rows={1} columns={3} thermos={[]} arrows={[rowArrow]}
          before={[{ at: [0, 0], value: 8, highlight: 'given' }, ...rowArrow.slice(1).map(at => ({ at, candidates: [1, 2, 3, 4, 5, 6, 7] }))]}
          after={[{ at: [0, 0], value: 8, highlight: 'given' }, ...rowArrow.slice(1).map(at => ({ at, candidates: [1, 2, 3, 5, 6, 7], removed: [4] }))]}
          beforeDescription="The circle is 8. A shaft digit of 4 would need another 4 in the other shaft cell."
          afterDescription="Those shaft cells share a row, so 4 + 4 is forbidden. Remove 4 from both cells; the other pairs still work." />
        <SudokuExample title="Across boxes: a repeated 4 is allowed" rows={4} columns={4} thermos={[]} arrows={[repeatArrow]}
          before={[{ at: [1, 1], value: 8, highlight: 'given' }, { at: [2, 2], value: 4, highlight: 'given' }, { at: [3, 3], candidates: [1, 2, 3, 4, 5, 6, 7] }]}
          after={[{ at: [1, 1], value: 8, highlight: 'given' }, { at: [2, 2], value: 4, highlight: 'given' }, { at: [3, 3], value: 4, highlight: 'deduced' }]}
          beforeDescription="The circle is 8 and the first shaft cell is 4. The shaft cells are in different rows, columns and boxes."
          afterDescription="The second shaft cell is 8 − 4 = 4. The repeated digits do not see each other, so both can be 4." />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Useful consequences</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Single-cell circles cap the sum at 9.</strong> An n-cell shaft totals at least n when repeats are allowed. If all its cells share a row, column or box, they must be distinct, so its minimum is n(n + 1) / 2. Four shaft cells in one such house would total at least 10, so cannot feed a single-cell circle.</li>
          <li><strong>The circle is larger than each shaft digit</strong> whenever the shaft has at least two cells. In particular, a 9 cannot appear on such a shaft. Use this alongside the circle’s candidates to prune the shaft.</li>
          <li><strong>Count the circle twice in a house total.</strong> If the circle and the entire shaft lie in one row, column or box, together they total twice the circle. If the other cells total 27, then 2 × circle = 45 − 27 = 18, so the circle is 9.</li>
          <li><strong>Arrows from the same circle have equal sums.</strong> Each shaft separately sums to the circle. Cancel shared cells when comparing them: if two shafts differ by just one cell each, those two cells must be equal. If those cells see each other, that arrangement is impossible.</li>
        </ul>
        <SudokuExample title="A whole arrow in a box counts the circle twice" rows={3} columns={3} thermos={[]} arrows={[rowArrow]}
          before={[...rowArrow.map(at => ({ at, candidates: [4, 5, 9] })), ...otherBoxDigits]}
          after={[{ at: [0, 0], value: 9, highlight: 'deduced' }, { at: [0, 1], candidates: [4, 5] }, { at: [0, 2], candidates: [4, 5] }, ...otherBoxDigits]}
          beforeDescription="The other six cells in this box are 1, 2, 3, 6, 7, 8, totalling 27. The circle and its two shaft cells fill the rest."
          afterDescription="The arrow and circle total 45 − 27 = 18. Since the shaft equals the circle, the circle is 18 ÷ 2 = 9. Its shaft is 4 + 5, with their order still unknown." />
      </div>

      <PillArrowTips />

      <p className="text-fs-7">The single-cell circle examples above use standard arrow rules: <a href="https://www.gmpuzzles.com/blog/sudoku-rules-and-info/arrow-sudoku-rules-and-info/" target="_blank" rel="noopener noreferrer" className="text-orange-yellow-crayola hover:underline">Grandmaster Puzzles</a>. Check each puzzle’s rules for special arrow variants.</p>
    </div>
  )
}
