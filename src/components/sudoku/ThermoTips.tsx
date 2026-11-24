import { ThermoDiagram, ThermoExample, type DiagramCell, type GridPosition } from './ThermoDiagram'
import ThermoPlayground from './ThermoPlayground'

const snake: GridPosition[] = [[0, 0], [0, 1], [0, 2], [1, 2], [1, 1], [1, 0], [2, 0], [2, 1], [2, 2]]
const straightFour: GridPosition[] = [[0, 0], [0, 1], [0, 2], [0, 3]]
const triple: GridPosition[] = [[0, 0], [0, 1], [0, 2]]
const boundsBefore: DiagramCell[] = snake.slice(0, 5).map((at, index) => index === 2
  ? { at, value: 4, highlight: 'given' }
  : { at, candidates: Array.from({ length: 5 }, (_, i) => index + i + 1) })
const boundsAfter: DiagramCell[] = [
  { at: snake[0], candidates: [1, 2], removed: [3, 4, 5], highlight: 'deduced' },
  { at: snake[1], candidates: [2, 3], removed: [4, 5, 6], highlight: 'deduced' },
  { at: snake[2], value: 4, highlight: 'given' },
  { at: snake[3], candidates: [5, 6, 7, 8], removed: [4], highlight: 'deduced' },
  { at: snake[4], candidates: [6, 7, 8, 9], removed: [5], highlight: 'deduced' },
]

export default function ThermoTips() {
  return (
    <div className="space-y-6 leading-relaxed">
      <div>
        <h4 className="font-semibold mb-2">Basic rules</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Digits strictly increase from the bulb towards the tip. They do not have to be consecutive: 1 → 3 → 7 is valid.</li>
          <li>No digit can repeat along the same thermometer, even if its cells are in different rows, columns or boxes.</li>
          <li>A 1 on a thermo can only be at its bulb; a 9 can only be at its tip. The bulb need not be 1, and the tip need not be 9.</li>
          <li>A single increasing path can contain at most 9 cells. A 9-cell thermo is completely fixed: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9.</li>
        </ul>
        <figure className="mt-4 rounded-lg border border-current/20 p-3 md:p-4">
          <figcaption className="font-medium mb-3">Increasing does not mean consecutive</figcaption>
          <ThermoDiagram rows={2} columns={3} thermos={[[[0, 0], [0, 1], [1, 1]]]} cells={[
            { at: [0, 0], value: 1 }, { at: [0, 1], value: 3 }, { at: [1, 1], value: 7 },
          ]} label="A grid fragment with a bent thermometer reading 1 at the bulb, then 3, then 7 at the tip. This is a valid increasing sequence." />
          <p className="mt-3 text-fs-7">Follow the grey line from the round bulb: 1 → 3 → 7. These examples are grid fragments, not complete puzzles. Small blue digits are candidates; crossed-out red digits are eliminations; green cells show deductions.</p>
        </figure>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Candidate ranges by length</h4>
        <p className="mb-3">Count all cells, including the bulb. On an n-cell thermo, number the positions from 1 at the bulb to n at the tip. Position i needs room for i − 1 smaller digits before it and n − i larger digits after it.</p>
        <p className="mb-3">Its range is therefore <span className="whitespace-nowrap font-mono">i ≤ digit ≤ 9 − n + i</span>, giving <strong>k = 10 − n</strong> possible digits at every position. These are the initial ranges from the thermo alone; the grid and other clues can narrow them. Choices at different positions still have to form an increasing sequence.</p>
        <ThermoPlayground />
        <p className="mt-3">Long thermos are especially restrictive: an 8-cell thermo allows just two digits per position, while a 9-cell thermo allows only one.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Propagate bounds in both directions</h4>
        <p className="mb-3">If a cell is at least a, the cell d steps towards the tip is at least a + d. If a cell is at most b, the cell d steps towards the bulb is at most b − d. You can use candidate bounds as well as solved digits, and repeat this after every elimination.</p>
        <p>For example, if the third cell of a 5-cell thermo is 4, the second cell is at most 3 and the bulb is at most 2. The fourth cell is at least 5 and the tip is at least 6. Combine these bounds with the initial ranges and the grid’s candidates.</p>
        <ThermoExample title="A given in the middle tightens both ends" rows={2} columns={3} thermos={[snake.slice(0, 5)]}
          before={boundsBefore} after={boundsAfter}
          beforeDescription="The blue cell is given as 4. The other pencil marks show the initial length bounds, before using that given."
          afterDescription="Before the 4, only 1, 2 fit in the bulb and 2, 3 in the second cell. After it, the fourth cell is at least 5 and the tip at least 6. Red candidates are removed." />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Squeeze digits into tight gaps</h4>
        <p className="mb-3">Between two solved digits, count the cells still to fill. If there are exactly enough digits to fit, the intervening cells are forced. For example, 2 → ? → ? → 5 must be 2 → 3 → 4 → 5.</p>
        <p>More generally, if two cells d steps apart have values a and b, then b − a ≥ d. Equality forces every step between them to increase by exactly 1. A smaller gap is impossible.</p>
        <ThermoExample title="Only two digits fit between 2 and 5" rows={1} columns={4} thermos={[straightFour]}
          before={[{ at: [0, 0], value: 2, highlight: 'given' }, { at: [0, 3], value: 5, highlight: 'given' }]}
          after={[{ at: [0, 0], value: 2, highlight: 'given' }, { at: [0, 1], value: 3, highlight: 'deduced' }, { at: [0, 2], value: 4, highlight: 'deduced' }, { at: [0, 3], value: 5, highlight: 'given' }]}
          beforeDescription="Two empty cells sit between the given 2 and 5. Which digits can fit?"
          afterDescription="The two cells must be 3 and 4, in that order. There is no room to skip a digit." />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Combine thermos with rows, columns and boxes</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Find locked sets.</strong> If three cells on one thermo in the same row can only contain 4, 5, 6, they form a naked triple: remove these digits from the rest of the row. Their order along the thermo also fixes them as 4 → 5 → 6.</li>
          <li><strong>Look for extreme digits.</strong> In a row, column or box, thermo cells other than bulbs cannot hold 1, and thermo cells other than tips cannot hold 9. If this leaves only one location for a digit, place it.</li>
          <li><strong>Remove unsupported candidates.</strong> If one cell has candidates 2, 5 and the next has 3, 4, the earlier cell cannot be 5. It is 2, even though 5 may fit its initial length-based range.</li>
          <li><strong>Use interacting bulbs.</strong> Two bulbs in the same box, each restricted to 1, 2, form a naked pair. Remove 1 and 2 from every other cell in that box, then propagate any stronger bounds along both thermos.</li>
        </ul>
        <ThermoExample title="A triple fixes the thermo and clears the row" rows={1} columns={6} thermos={[triple]}
          before={[
            ...triple.map(at => ({ at, candidates: [4, 5, 6] })),
            { at: [0, 3], candidates: [1, 4, 7] }, { at: [0, 4], candidates: [2, 5, 8] }, { at: [0, 5], candidates: [3, 6, 9] },
          ]}
          after={[
            ...triple.map((at, index): DiagramCell => ({ at, value: index + 4, highlight: 'deduced' })),
            { at: [0, 3], candidates: [1, 7], removed: [4] }, { at: [0, 4], candidates: [2, 8], removed: [5] }, { at: [0, 5], candidates: [3, 9], removed: [6] },
          ]}
          beforeDescription="Other clues have restricted the first three cells to 4, 5, 6. All six shown cells are in the same row."
          afterDescription="The thermo orders the triple as 4, 5, 6. The rest of the row cannot contain any of those digits, so the red pencil marks are removed." />
        <ThermoExample title="A candidate needs a larger digit after it" rows={1} columns={2} thermos={[[[0, 0], [0, 1]]]}
          before={[{ at: [0, 0], candidates: [2, 5] }, { at: [0, 1], candidates: [3, 4] }]}
          after={[{ at: [0, 0], value: 2, highlight: 'deduced' }, { at: [0, 1], candidates: [3, 4] }]}
          beforeDescription="The bulb can be 2 or 5, but the tip can only be 3 or 4."
          afterDescription="A bulb of 5 would leave no larger digit for the tip. The bulb is therefore 2; the tip remains 3 or 4." />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Overlapping and branching thermos</h4>
        <p className="mb-3">At a shared cell, apply every incoming lower bound and outgoing upper bound. If one thermo ends where another begins, their inequalities combine into a longer increasing chain. Count the shared cell once; bounds apply along the entire chain.</p>
        <p>For a branching shape, follow each bulb-to-tip path. Digits on separate branches are not automatically ordered relative to each other and may repeat unless they share a row, column, box or another restriction. Always check the puzzle’s rules for how its marked paths connect.</p>
        <figure className="mt-4 rounded-lg border border-current/20 p-3 md:p-4">
          <figcaption className="font-medium mb-3">Separate branches can repeat a digit</figcaption>
          <ThermoDiagram rows={4} columns={4} thermos={[
            [[2, 1], [1, 1], [0, 1]], [[2, 1], [2, 2], [2, 3], [3, 3]],
          ]} cells={[
            { at: [2, 1], value: 1 }, { at: [1, 1], value: 3 }, { at: [0, 1], value: 5, highlight: 'given' },
            { at: [2, 2], value: 2 }, { at: [2, 3], value: 4 }, { at: [3, 3], value: 5, highlight: 'given' },
          ]} label="Two thermos share a bulb containing 1. One branch reads 1, 3, 5 upwards; the other reads 1, 2, 4, 5 to the right and down. The two 5s share no row, column or box." />
          <p className="mt-3 text-fs-7">Both paths increase from the shared 1. The two highlighted 5s are on separate branches and share no row, column or box, so neither the thermo rules nor the standard Sudoku rules forbid this repetition.</p>
        </figure>
      </div>

      <p className="text-fs-7">Standard thermo rules: <a href="https://crackingthecryptic.com/sudoku?id=59" target="_blank" rel="noopener noreferrer" className="text-orange-yellow-crayola hover:underline">Cracking the Cryptic</a>. The ranges and deductions above follow from strict increase using digits 1–9; special thermo variants may use different rules.</p>
    </div>
  )
}
