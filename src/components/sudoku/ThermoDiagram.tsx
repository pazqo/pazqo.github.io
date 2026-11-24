import { useId, useState } from 'react'

export type GridPosition = readonly [number, number]
export interface DiagramCell {
  at: GridPosition
  value?: number
  candidates?: number[]
  /** Digits required somewhere in the region, with their positions unresolved. */
  cornerNotes?: number[]
  removed?: number[]
  highlight?: 'given' | 'deduced'
}

interface DiagramProps {
  label: string
  rows: number
  columns: number
  thermos: readonly (readonly GridPosition[])[]
  cells: DiagramCell[]
  onCellSelect?: (index: number) => void
  selectedCell?: number
  cages?: { sum: number; cells: readonly GridPosition[] }[]
  arrows?: readonly (readonly GridPosition[])[]
  pills?: readonly (readonly GridPosition[])[]
  maxWidth?: number
}

// Grid fragments use standard 9×9 digits and box boundaries every three cells.
export function ThermoDiagram({ label, rows, columns, thermos, cells, onCellSelect, selectedCell, cages = [], arrows = [], pills = [], maxWidth }: DiagramProps) {
  const id = useId()
  const cellSize = 64
  const center = ([row, column]: GridPosition) => [column * cellSize + 32, row * cellSize + 32]
  return (
    <svg viewBox={`-2 -2 ${columns * cellSize + 4} ${rows * cellSize + 4}`} role={onCellSelect ? 'group' : 'img'} aria-labelledby={id}
      className="block w-full rounded-md" style={{ maxWidth: maxWidth ?? (onCellSelect ? 320 : columns * cellSize + 4), background: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <title id={id}>{label}</title>
      {arrows.length > 0 && <defs><marker id={`arrowhead-${id}`} markerWidth={10} markerHeight={10} refX={8} refY={5} orient="auto" markerUnits="userSpaceOnUse">
        <path d="M1 1L8 5L1 9" fill="none" stroke="#888" strokeWidth={2} strokeLinejoin="round" />
      </marker></defs>}
      {cells.filter(cell => cell.highlight).map(cell => <rect key={`highlight-${cell.at}`} x={cell.at[1] * cellSize} y={cell.at[0] * cellSize} width={cellSize} height={cellSize} fill={cell.highlight === 'given' ? '#dcecff' : '#d9f4df'} />)}
      {thermos.map((path, index) => <g key={index} fill="#c5c5c5" stroke="#c5c5c5">
        <polyline points={path.map(at => center(at).join(',')).join(' ')} strokeWidth={19} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={center(path[0])[0]} cy={center(path[0])[1]} r={23} stroke="none" />
      </g>)}
      {arrows.map((path, index) => {
        const points = path.map(center)
        const [cx, cy] = points[0]
        const firstDistance = Math.hypot(points[1][0] - cx, points[1][1] - cy)
        const start = [cx + (points[1][0] - cx) * 24 / firstDistance, cy + (points[1][1] - cy) * 24 / firstDistance]
        const last = points[points.length - 1]
        const previous = points[points.length - 2]
        const lastDistance = Math.hypot(last[0] - previous[0], last[1] - previous[1])
        const end = [last[0] + (last[0] - previous[0]) * 17 / lastDistance, last[1] + (last[1] - previous[1]) * 17 / lastDistance]
        const startsInPill = pills.some(pill => pill.some(([r, c]) => r === path[0][0] && c === path[0][1]))
        return <g key={`arrow-${index}`} fill="none" stroke="#888" strokeWidth={3}>
          <polyline points={[start, ...points.slice(1, -1), end].map(point => point.join(',')).join(' ')} strokeLinejoin="round" markerEnd={`url(#arrowhead-${id})`} />
          {!startsInPill && <circle cx={cx} cy={cy} r={24} />}
        </g>
      })}
      {pills.map((pill, index) => {
        const rows = pill.map(([row]) => row)
        const columns = pill.map(([, column]) => column)
        return <rect key={`pill-${index}`} x={Math.min(...columns) * cellSize + 8} y={Math.min(...rows) * cellSize + 8}
          width={(Math.max(...columns) - Math.min(...columns)) * cellSize + 48} height={(Math.max(...rows) - Math.min(...rows)) * cellSize + 48}
          rx={24} fill="none" stroke="#888" strokeWidth={3} />
      })}
      <g stroke="#303030" fill="none">
        {Array.from({ length: columns + 1 }, (_, column) => <path key={`col-${column}`} d={`M${column * cellSize} 0V${rows * cellSize}`} strokeWidth={column % 3 === 0 || column === columns ? 2.5 : .7} />)}
        {Array.from({ length: rows + 1 }, (_, row) => <path key={`row-${row}`} d={`M0 ${row * cellSize}H${columns * cellSize}`} strokeWidth={row % 3 === 0 || row === rows ? 2.5 : .7} />)}
      </g>
      {cages.map((cage, cageIndex) => {
        const contains = (row: number, column: number) => cage.cells.some(([r, c]) => r === row && c === column)
        const first = [...cage.cells].sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2)[0]
        return <g key={`cage-${cageIndex}`}>
          <g stroke="#444" strokeWidth={1.2} strokeDasharray="4 3" fill="none">
            {cage.cells.map(([row, column]) => {
              const x = column * cellSize
              const y = row * cellSize
              const top = contains(row - 1, column)
              const bottom = contains(row + 1, column)
              const left = contains(row, column - 1)
              const right = contains(row, column + 1)
              return <g key={`${row}-${column}`}>
                {!top && <path d={`M${x + (left ? 0 : 6)} ${y + 6}H${x + cellSize - (right ? 0 : 6)}`} />}
                {!bottom && <path d={`M${x + (left ? 0 : 6)} ${y + cellSize - 6}H${x + cellSize - (right ? 0 : 6)}`} />}
                {!left && <path d={`M${x + 6} ${y + (top ? 0 : 6)}V${y + cellSize - (bottom ? 0 : 6)}`} />}
                {!right && <path d={`M${x + cellSize - 6} ${y + (top ? 0 : 6)}V${y + cellSize - (bottom ? 0 : 6)}`} />}
              </g>
            })}
          </g>
          <text x={first[1] * cellSize + 10} y={first[0] * cellSize + 17} fontSize={12} fontWeight="bold" fill="#171717" stroke="#dcecff" strokeWidth={4} paintOrder="stroke">{cage.sum}</text>
        </g>
      })}
      {cells.map(cell => {
        const [x, y] = center(cell.at)
        const corner = cell.cornerNotes !== undefined
        const hasCageClue = cages.some(cage => {
          const first = [...cage.cells].sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2)[0]
          return first[0] === cell.at[0] && first[1] === cell.at[1]
        })
        const notes = [...new Set([...(corner ? cell.cornerNotes! : cell.candidates ?? []), ...(cell.removed ?? [])])].sort((a, b) => a - b)
        // Region requirements use a corner row; cell candidates use the centre.
        // Shrink long lists to fit, including any crossed-out exclusions.
        const noteFontSize = corner ? notes.length > 6 ? 9 : 11 : notes.length > 6 ? 11 : 14
        const noteSpacing = corner ? 6 : notes.length > 6 ? 6.5 : 8.5
        return <g key={`digits-${cell.at}`}>
          {cell.value !== undefined ? <text x={x} y={y} dy=".35em" textAnchor="middle" fontSize={36} fill={cell.highlight === 'deduced' ? '#17612c' : '#171717'}>{cell.value}</text> :
            notes.map((digit, index) => {
              const dx = corner ? x - 23 + index * noteSpacing : x + (index - (notes.length - 1) / 2) * noteSpacing
              // Reserve a line for the cage total in its top-left cell.
              const dy = corner ? y - (hasCageClue ? 7 : 19) : y
              const removed = cell.removed?.includes(digit)
              return <g key={digit}>
                <text x={dx} y={dy} dy=".35em" textAnchor="middle" fontSize={noteFontSize} fill={removed ? '#b42332' : '#174da6'}>{digit}</text>
                {removed && <path d={`M${dx - 3} ${dy + 4}l6 -8`} stroke="#b42332" strokeWidth={1.7} />}
              </g>
            })}
        </g>
      })}
      {onCellSelect && cells.map((cell, index) => <rect key={`select-${cell.at}`}
        x={cell.at[1] * cellSize + 3} y={cell.at[0] * cellSize + 3} width={cellSize - 6} height={cellSize - 6}
        fill="transparent" stroke={selectedCell === index ? '#2563eb' : 'transparent'} strokeWidth={3}
        role="button" tabIndex={0} aria-pressed={selectedCell === index}
        aria-label={`Cell ${index + 1}${index === 0 ? ' (bulb)' : ''}: ${cell.value !== undefined ? `digit ${cell.value}` : cell.candidates?.length ? `candidates ${cell.candidates.join(', ')}` : 'no candidates'}`}
        className="cursor-pointer focus:stroke-blue-600 focus:outline-none"
        onClick={() => onCellSelect(index)} onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onCellSelect(index) }
        }} />)}
    </svg>
  )
}

interface ExampleProps extends Omit<DiagramProps, 'cells' | 'label'> {
  title: string
  before: DiagramCell[]
  after: DiagramCell[]
  beforeDescription: string
  afterDescription: string
}

export function ThermoExample({ title, before, after, beforeDescription, afterDescription, ...grid }: ExampleProps) {
  const [revealed, setRevealed] = useState(false)
  const description = revealed ? afterDescription : beforeDescription
  return (
    <figure className="mt-4 rounded-lg border border-current/20 p-3 md:p-4">
      <figcaption className="font-medium mb-3">{title}</figcaption>
      <ThermoDiagram {...grid} label={`${title}. ${description}`} cells={revealed ? after : before} />
      <button type="button" aria-pressed={revealed} onClick={() => setRevealed(value => !value)} className="mt-3 rounded-lg border border-current/30 px-3 py-2 text-orange-yellow-crayola text-fs-7 hover:underline">
        {revealed ? 'Reset example' : 'Show deduction'}
      </button>
      <p aria-live="polite" className="mt-3 text-fs-7">{description}</p>
    </figure>
  )
}
