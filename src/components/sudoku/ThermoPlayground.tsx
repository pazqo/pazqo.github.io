import { useState } from 'react'
import { thermoCandidates } from '../../lib/sudoku/thermo-candidates'
import { ThermoDiagram, type GridPosition } from './ThermoDiagram'

const snake: GridPosition[] = [[0, 0], [0, 1], [0, 2], [1, 2], [1, 1], [1, 0], [2, 0], [2, 1], [2, 2]]
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
interface PlaygroundState {
  length: number
  excluded: number[][]
}
const fresh = (length: number): PlaygroundState => ({ length, excluded: Array.from({ length }, () => []) })

export default function ThermoPlayground() {
  const [state, setState] = useState(() => fresh(5))
  const [history, setHistory] = useState<PlaygroundState[]>([])
  const [selected, setSelected] = useState(0)
  const { length, excluded } = state
  const candidates = thermoCandidates(excluded.map(removed => digits.filter(digit => !removed.includes(digit))))
  const valid = candidates.every(domain => domain.length > 0)
  const edited = excluded.some(removed => removed.length > 0)
  const buttonClass = 'rounded-lg border border-current/30 px-3 py-2 text-fs-7 disabled:opacity-40 disabled:cursor-not-allowed'

  function commit(next: PlaygroundState) {
    setHistory(previous => [...previous, state])
    setState(next)
    setSelected(index => Math.min(index, next.length - 1))
  }
  function resize(nextLength: number) {
    if (nextLength !== length) commit(fresh(nextLength))
  }
  function toggleDigit(digit: number) {
    commit({ ...state, excluded: excluded.map((removed, index) => index !== selected ? removed
      : removed.includes(digit) ? removed.filter(value => value !== digit) : [...removed, digit]) })
  }
  function undo() {
    const previous = history[history.length - 1]
    if (!previous) return
    setState(previous)
    setHistory(history.slice(0, -1))
    setSelected(index => Math.min(index, previous.length - 1))
  }

  return (
    <div className="mt-4 space-y-4">
      <h5 className="font-semibold">Try it yourself</h5>
      <p className="text-fs-7">Select a thermo cell, then tap a digit to remove it. Tap a crossed-out digit to restore it. The other cells update automatically. Changing the length resets candidate edits; Undo brings them back.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 rounded-lg border border-current/20 p-3 md:p-4">
        <div className="min-w-0">
          <ThermoDiagram rows={3} columns={3} thermos={[snake.slice(0, length)]} cells={candidates.map((domain, index) => ({
            at: snake[index],
            ...(domain.length === 1 ? { value: domain[0], highlight: 'deduced' as const } : { candidates: domain }),
          }))} selectedCell={selected} onCellSelect={setSelected}
            label="Editable thermometer. Select a cell to edit its candidates. The bulb starts at the top left and the line snakes across the rows." />
          <p className="mt-3 text-fs-7">A {length}-cell thermo starts with {10 - length} possible {length === 9 ? 'digit' : 'digits'} per position.</p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-4 text-fs-7">
            <label className="inline-flex items-center gap-2">
              <span>Length</span>
              <select aria-label="Thermo length" title="Number of cells, including the bulb" value={length} onChange={event => resize(Number(event.target.value))} className="w-16 rounded-lg border border-current/30 bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1.5">
                {[2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <button type="button" aria-label="Add cell" title="Add a cell" className="shrink-0 rounded-lg border border-current/30 px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed" disabled={length === 9} onClick={() => resize(length + 1)}>+1</button>
            <button type="button" aria-label="Remove tip" title="Remove the tip" className="shrink-0 rounded-lg border border-current/30 px-2 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed" disabled={length === 2} onClick={() => resize(length - 1)}>−1</button>
          </div>
          <fieldset>
            <legend className="font-medium mb-2">Cell {selected + 1}{selected === 0 ? ' (bulb)' : selected === length - 1 ? ' (tip)' : ''} — remove or restore digits</legend>
            <div className="grid grid-cols-9 gap-1">
              {digits.map(digit => {
                const removed = excluded[selected].includes(digit)
                const possible = candidates[selected].includes(digit)
                return <button key={digit} type="button" aria-pressed={removed}
                  aria-label={`${removed ? 'Restore' : 'Remove'} digit ${digit}`}
                  disabled={!removed && !possible} onClick={() => toggleDigit(digit)}
                  className={`min-w-0 h-8 rounded border border-current/30 text-fs-7 font-mono disabled:opacity-40 disabled:cursor-not-allowed ${removed ? 'line-through text-red-400' : possible ? 'text-orange-yellow-crayola' : ''}`}
                  title={removed ? 'Removed by you; click to restore' : possible ? 'Click to remove this candidate' : 'Ruled out by the thermo'}>{digit}</button>
              })}
            </div>
          </fieldset>
          <p className="mt-3 text-fs-7">Crossed out: removed by you. Dimmed: ruled out by the thermo. Green cells have only one candidate left.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <button type="button" className={buttonClass} disabled={!history.length} onClick={undo}>Undo</button>
            <button type="button" className={buttonClass} disabled={!excluded[selected].length} onClick={() => commit({ ...state, excluded: excluded.map((removed, index) => index === selected ? [] : removed) })}>Restore this cell</button>
            <button type="button" className={buttonClass} disabled={!edited} onClick={() => commit(fresh(length))}>Reset candidates</button>
          </div>
          <p role="status" className={`mt-3 text-fs-7 ${valid ? '' : 'text-red-400'}`}>
            {valid ? `Cell ${selected + 1}: ${candidates[selected].join(', ')}. Every displayed candidate fits at least one complete increasing sequence.`
              : 'No increasing sequence fits these edits. Undo, restore a removed digit, or reset the candidates.'}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-current/20">
        <table className="w-full text-left text-fs-7">
          <caption className="sr-only">Current candidate digits at each position of the {length}-cell thermometer</caption>
          <thead><tr className="border-b border-current/20">
            <th scope="col" className="p-3">Position</th>
            <th scope="col" className="p-3">Minimum</th>
            <th scope="col" className="p-3">Maximum</th>
            <th scope="col" className="p-3">Candidates</th>
          </tr></thead>
          <tbody>{candidates.map((domain, index) => (
            <tr key={index} className="border-b last:border-0 border-current/10">
              <th scope="row" className="p-3">{index + 1}{index === 0 ? ' (bulb)' : index === length - 1 ? ' (tip)' : ''}</th>
              <td className="p-3">{domain[0] ?? '—'}</td>
              <td className="p-3">{domain[domain.length - 1] ?? '—'}</td>
              <td className="p-3 font-mono">{domain.length ? domain.join(', ') : 'None'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
