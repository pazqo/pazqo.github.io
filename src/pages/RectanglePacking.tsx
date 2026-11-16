import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Shuffle, Undo2 } from 'lucide-react'
import ArticleTitle from '../components/ui/ArticleTitle'
import { area, maximalRectangles, generatePoints, type PointLayout, type Rectangle } from '../lib/rectangle-packing/geometry'
import { pointSetKey, readPackings, storageKey, type SavedPacking } from '../lib/rectangle-packing/configurations'
import { chainCertificate, seededRandom } from '../lib/rectangle-packing/puzzles'
import { randomStaircase, staircaseChallenge } from '../lib/rectangle-packing/staircase'
import type { SearchProgress } from '../lib/rectangle-packing/optimizer'
import '../styles/rectangle-packing.css'

const percent = (n: number) => `${(n * 100).toFixed(2)}%`
const color = (id: number) => `hsl(${(id * 137.508 + 160) % 360} 75% 65%)`

export default function RectanglePacking() {
  const [count, setCount] = useState(8)
  const [seed, setSeed] = useState(1)
  const [seedInput, setSeedInput] = useState(1)
  const [layout, setLayout] = useState<PointLayout>('random')
  const [points, setPoints] = useState(() => generatePoints(8, 'random'))
  const [placed, setPlaced] = useState<Rectangle[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [choice, setChoice] = useState(0)
  const [saved, setSaved] = useState<SavedPacking[]>(readPackings)
  const [saveName, setSaveName] = useState('')
  const [storageError, setStorageError] = useState('')
  const [search, setSearch] = useState<SearchProgress | null>(null)
  const [running, setRunning] = useState(false)
  const [objective, setObjective] = useState<'maximum' | 'minimum-greedy'>('minimum-greedy')
  const [seconds, setSeconds] = useState(10)
  const worker = useRef<Worker | null>(null)
  useEffect(() => () => worker.current?.terminate(), [])
  const anchor = points.find(p => p.id === selected)
  const candidates = useMemo(() => anchor ? maximalRectangles(anchor, points, placed) : [], [anchor, points, placed])
  const preview = candidates[choice]
  const covered = placed.reduce((sum, r) => sum + area(r), 0)
  const remaining = points.filter(p => !placed.some(r => r.pointId === p.id))
  const blocked = remaining.filter(p => !maximalRectangles(p, points, placed).length)
  function select(id: number) { if (selected !== id) { setSelected(id); setChoice(0) } }
  function reset() { setPlaced([]); setSelected(null); setChoice(0) }
  function generate(nextLayout = layout, randomize = true) {
    stopSearch(); setSearch(null)
    const nextSeed = randomize ? Math.floor(Math.random() * 2 ** 32) : seedInput
    const total = nextLayout === 'fifty-puzzle' && count < 12 ? 24 : count
    setSeed(nextSeed); setSeedInput(nextSeed)
    const generated = generatePoints(total, nextLayout, nextSeed)
    setPoints(generated); setCount(generated.length); reset()
  }
  function place() {
    if (!preview) return
    setPlaced(list => [...list, preview]); setSelected(null); setChoice(0)
  }
  function remove(id: number) { setPlaced(list => list.filter(r => r.pointId !== id)); select(id) }

  function toggleRectangle(id: number) {
    if (placed.some(r => r.pointId === id)) { remove(id); return }
    const p = points.find(p => p.id === id)!
    const r = selected === id && preview ? preview : maximalRectangles(p, points, placed)[0]
    if (r) { setPlaced(list => [...list, r]); setSelected(null); setChoice(0) }
  }
  function persist(next: SavedPacking[]) {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError('') }
    catch { setStorageError('Browser storage is unavailable or full. These saves will only last for this session.') }
    setSaved(next)
  }
  function saveConfiguration() {
    persist([...saved, { id: crypto.randomUUID(), name: saveName.trim() || `Configuration ${saved.length + 1}`, points: points.map(p => ({ ...p })), rectangles: placed.map(r => ({ ...r })), layout, seed }])
    setSaveName('')
  }
  function loadConfiguration(c: SavedPacking) {
    stopSearch(); setSearch(null); setPoints(c.points); setCount(c.points.length); setLayout(c.layout); setSeed(c.seed ?? 1); setSeedInput(c.seed ?? 1); setPlaced(c.rectangles); setSelected(null); setChoice(0)
  }
  function stopSearch() { worker.current?.terminate(); worker.current = null; setRunning(false) }
  function optimize() {
    stopSearch(); setSearch(null)
    try {
      const next = new Worker(new URL('../lib/rectangle-packing/optimizer.worker.ts', import.meta.url), { type: 'module' })
      worker.current = next; setRunning(true)
      next.onmessage = (event: MessageEvent<SearchProgress & { done: boolean }>) => {
        setSearch(event.data)
        if (event.data.done) stopSearch()
      }
      next.onerror = () => { stopSearch(); setStorageError('The optimizer could not run. Please reload and try again.') }
      next.postMessage({ points, initial: placed, seconds, objective })
    } catch { stopSearch(); setStorageError('The optimizer could not start in this browser.') }
  }
  const challenge = useMemo(() => {
    if (layout !== 'staircase' && layout !== 'random-staircase') return null
    let fixture = layout === 'random-staircase' ? randomStaircase(points.length, seededRandom(seed)) : staircaseChallenge()
    if (pointSetKey(fixture.points) !== pointSetKey(points)) {
      // Retain demonstration replay for saves created by the older generator.
      fixture = staircaseChallenge(seededRandom(seed))
      if (pointSetKey(fixture.points) !== pointSetKey(points)) return null
    }
    const rectangles: Rectangle[] = []
    for (const id of fixture.order) {
      const p = points.find(p => p.id === id)!
      const r = maximalRectangles(p, points, rectangles)[0]
      if (r) rectangles.push(r)
    }
    return { rectangles, covered: rectangles.reduce((sum, r) => sum + area(r), 0) }
  }, [layout, points, seed])
  const certificate = useMemo(() => layout === 'fifty-puzzle' ? chainCertificate(points) : null, [layout, points])
  const followsDemo = !!challenge && placed.length <= challenge.rectangles.length && placed.every((r, i) => JSON.stringify(r) === JSON.stringify(challenge.rectangles[i]))
  const samePoints = saved.filter(c => pointSetKey(c.points) === pointSetKey(points))
  const worstSaved = Math.min(...samePoints.map(c => c.rectangles.reduce((sum, r) => sum + area(r), 0)))
  const bestSaved = Math.max(0, ...samePoints.map(c => c.rectangles.reduce((sum, r) => sum + area(r), 0)))

  return <div className="rp-page">
    <Link className="rp-back" to="/games"><ArrowLeft size={16} /> Back to Games/Apps</Link>
    <ArticleTitle>Rectangle Lab</ArticleTitle>
    <p className="rp-notice">This is a work in progress. If something looks wrong or doesn't work as expected, please <a className="underline" href="mailto:pazqop@gmail.com?subject=Rectangle%20Lab%20feedback">contact me</a>.</p>
    <p className="rp-intro">How much of a square can you cover? The origin (0, 0) is always included, plus n−1 interior points in your chosen layout. Choose an anchor and explore its maximal rectangles.</p>
    <div className="rp-toolbar">
      <label>Number of points<input aria-label="Number of points" disabled={layout === 'staircase'} type="number" min="1" max="40" value={count} onChange={e => setCount(Math.max(1, Math.min(40, Number(e.target.value) || 1)))} /></label>
      <label>Point layout<select value={layout} onChange={e => { const next = e.target.value as PointLayout; setLayout(next); generate(next) }}>
        <option value="random">Random</option>
        <option value="diagonal">Diagonal · y = x</option>
        <option value="anti-diagonal">Anti-diagonal · y = 1 − x</option>
        <option value="increasing">Increasing x and y</option>
        <option value="fifty-puzzle">50% puzzle · tight coverage</option>
        <option value="random-staircase">Randomized staircase puzzle</option>
        <option value="staircase">Staircase challenge · 37 points</option>
      </select></label>
      <button onClick={() => generate()}><Shuffle size={15} /> {layout === 'staircase' ? 'Reset challenge' : 'New points'}</button>
      <button disabled={!placed.length} onClick={() => { const last = placed[placed.length - 1]; setPlaced(list => list.slice(0, -1)); select(last.pointId) }}><Undo2 size={15} /> Undo</button>
      <button disabled={!placed.length} onClick={reset}><RotateCcw size={15} /> Clear rectangles</button>
    </div>
    {(layout === 'random-staircase' || layout === 'fifty-puzzle') && <div className="rp-save-controls"><label>Puzzle seed<input aria-label="Puzzle seed" type="number" min="0" max="4294967295" value={seedInput} onChange={e => setSeedInput(Math.max(0, Math.min(4294967295, Number(e.target.value) || 0)))} /></label><button onClick={() => generate(layout, false)}>Apply seed</button><span className="rp-muted">New points creates a new seed. Save a configuration to keep this puzzle.</span></div>}
    <p className="rp-layout-note">{layout === 'fifty-puzzle' ? 'Reach 50% with a shuffled, perturbed near-diagonal point set. More points leave less room above the target.' : layout === 'random-staircase' ? 'Uses your chosen point count, including the origin. Small sets have fewer staircase corners; larger sets add recursive tiles and fence points. Structure alone does not guarantee that reaching 50% is difficult.' : layout === 'staircase' ? 'A fixed, two-level staircase-and-fence challenge with 37 points.' : layout === 'random' ? 'Independent random interior points.' : layout === 'diagonal' ? 'Randomly spaced interior points on y = x.' : layout === 'anti-diagonal' ? 'Randomly spaced interior points on x + y = 1. The fixed origin is included separately.' : 'Random x and y coordinates paired in increasing order, so both rankings agree.'} Changing the layout or generating new points clears the rectangles.</p>
    {challenge && <section className="rp-challenge">
      <h3>Can you beat the greedy demonstration?</h3>
      <p>{layout === 'staircase' ? 'A fixed 37-point example' : `A randomized ${points.length}-point puzzle`} with staircase corners following local hyperbolas and nearby fence points. The demonstration always chooses a maximum-area rectangle and covers <strong>{percent(challenge.covered)}</strong>. {layout === 'random-staircase' ? 'Your first target is 50%; then try to beat the demonstration.' : 'Try another order or other rectangle choices to cover more.'}</p>
      <p>This finite preset is inspired by <a href="https://adriandumitrescu.org/anchored.pdf#page=14" target="_blank" rel="noreferrer">Theorem 9 of Packing anchored rectangles</a>. It is not the full recursive construction that drives greedy coverage below 50%.</p>
      <div className="rp-save-controls"><button disabled={!followsDemo || placed.length === challenge.rectangles.length} onClick={() => { setPlaced(challenge.rectangles.slice(0, placed.length + 1)); setSelected(null); setChoice(0) }}>Next demonstration step</button><button onClick={() => { setPlaced(challenge.rectangles); setSelected(null); setChoice(0) }}>Show full greedy demonstration</button></div>
      <p>{followsDemo ? `Demonstration: ${placed.length} / ${challenge.rectangles.length} steps.` : 'Your own packing. Clear rectangles to replay the demonstration step by step.'} {covered > challenge.covered + 1e-10 ? `You beat the demonstration by ${((covered - challenge.covered) * 100).toFixed(2)} percentage points!` : ''}</p>
    </section>}
    {certificate && <section className="rp-challenge">
      <h3>{covered >= .5 - 1e-10 ? '50% target reached!' : 'Cover at least 50%'}</h3>
      <p>This puzzle has a certified coverage ceiling of <strong>{percent(certificate.upper)}</strong>. A valid packing covering <strong>{percent(certificate.lower)}</strong> is known. These bounds show how little area is available above 50%; they do not measure how hard the puzzle is to solve.</p>
      <details className="rp-rules"><summary>Hint and coverage certificate</summary><p>Sort the points by x. Their y coordinates increase in the same order. A rectangle must stop before the next point in at least one direction. Summing the larger of these two per-point area bounds gives the ceiling above. Disjoint vertical strips or horizontal strips give the displayed achievable coverage.</p><button onClick={() => { setPlaced(certificate.solution); setSelected(null); setChoice(0) }}>Reveal a valid solution</button></details>
    </section>}
    <div className="rp-stats" aria-live="polite">
      <div><strong>{percent(covered)}</strong><span>covered</span></div>
      <div><strong>{placed.length} / {points.length}</strong><span>rectangles placed</span></div>
      <div><strong>{percent(1 - covered)}</strong><span>uncovered</span></div>
    </div>
    <div className="rp-progress" role="progressbar" aria-label="Covered area" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number((covered * 100).toFixed(2))}><span style={{ width: percent(covered) }} /></div>
    <div className="rp-workspace">
      <div className="rp-board-wrap">
        <svg className="rp-board" viewBox="-5 -5 110 110" role="group" aria-label="Unit square with rectangle anchors">
          <defs><pattern id="rp-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth=".15" /></pattern></defs>
          <rect className="rp-square" width="100" height="100" />
          <rect className="rp-grid" width="100" height="100" fill="url(#rp-grid)" />
          {placed.map(r => <g key={r.pointId}>
            <rect className="rp-rectangle" x={r.x * 100} y={(1 - r.y - r.height) * 100} width={r.width * 100} height={r.height * 100} fill={color(r.pointId)} stroke={color(r.pointId)} />
            {r.width > .1 && r.height > .07 && <text className="rp-area-label" x={(r.x + r.width / 2) * 100} y={(1 - r.y - r.height / 2) * 100}>{percent(area(r))}</text>}
          </g>)}
          {preview && <rect className="rp-preview" x={preview.x * 100} y={(1 - preview.y - preview.height) * 100} width={preview.width * 100} height={preview.height * 100} />}
          {points.map(p => {
            const used = placed.some(r => r.pointId === p.id)
            return <g key={p.id} role="button" tabIndex={0} aria-label={`Point ${p.id}${used ? ', rectangle placed' : ''}`} aria-pressed={selected === p.id} className={`rp-point ${selected === p.id ? 'is-selected' : ''} ${used ? 'is-placed' : ''}`} onClick={() => select(p.id)} onDoubleClick={() => toggleRectangle(p.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(p.id) } }}>
              <title>Point {p.id} · ({p.x.toFixed(3)}, {p.y.toFixed(3)})</title>
              <circle cx={p.x * 100} cy={(1 - p.y) * 100} r="2.4" className="rp-hit" />
              <circle cx={p.x * 100} cy={(1 - p.y) * 100} r=".9" className="rp-dot" />
              <text x={p.x * 100 + 1.5} y={(1 - p.y) * 100 - 1.6}>{p.id}</text>
            </g>
          })}
          <text className="rp-axis" x="0" y="104">(0, 0)</text><text className="rp-axis" x="100" y="-2" textAnchor="end">(1, 1)</text>
        </svg>
        <p className="rp-caption"><span className="rp-legend-dot" /> Anchor point <span className="rp-legend-preview" /> Preview · double-click a dot to place/remove</p>
      </div>
      <section className="rp-options" aria-label="Rectangle choices">
        <h3>{anchor ? `Point ${anchor.id}` : 'Choose an anchor'}</h3>
        {anchor ? <>
          <p className="rp-muted">({anchor.x.toFixed(3)}, {anchor.y.toFixed(3)})</p>
          {placed.some(r => r.pointId === anchor.id) ? <><p>This point already has a rectangle. Remove it to explore other choices.</p><button onClick={() => remove(anchor.id)}>Remove rectangle</button></> : <>
            <p>{candidates.length ? `${candidates.length} maximal ${candidates.length === 1 ? 'rectangle' : 'rectangles'} available. Select a size to preview it.` : 'No positive-area rectangle fits here. Undo or remove a nearby rectangle to make room.'}</p>
            <div className="rp-candidates">{candidates.map((r, i) => <button className={choice === i ? 'is-selected' : ''} aria-pressed={choice === i} key={`${r.width}-${r.height}`} onClick={() => setChoice(i)}>
              <span><strong>{percent(area(r))}</strong>{i === 0 && <small>Largest available</small>}</span><small>{r.width.toFixed(3)} × {r.height.toFixed(3)}</small>
            </button>)}</div>
            {!!candidates.length && <button className="rp-primary" onClick={place}>Place rectangle · +{percent(area(preview))}</button>}
          </>}
        </> : <p>Select a numbered point in the square or below. Each choice is maximal for the rectangles already placed; the largest one is previewed first.</p>}
      </section>
    </div>
    <div className="rp-point-list" aria-label="Select an anchor point">{points.map(p => <button key={p.id} aria-pressed={selected === p.id} onClick={() => select(p.id)} className={selected === p.id ? 'is-selected' : ''}>Point {p.id}{placed.some(r => r.pointId === p.id) ? ' ✓' : ''}</button>)}</div>
    {blocked.length > 0 && <p className="rp-notice" role="status">{blocked.length} {blocked.length === 1 ? 'point has' : 'points have'} no room for a rectangle. You can undo a step or remove a placed rectangle.</p>}
    {placed.length === points.length && <p className="rp-notice" role="status">All points have a rectangle. Your packing covers {percent(covered)} of the square.</p>}
    {!!placed.length && <section className="rp-placed"><h3>Placed rectangles</h3>{placed.map((r, i) => <div key={r.pointId}><span><i style={{ background: color(r.pointId) }} />{i + 1}. Point {r.pointId}</span><span>{percent(area(r))}</span><button aria-label={`Remove rectangle for point ${r.pointId}`} onClick={() => remove(r.pointId)}>Remove</button></div>)}</section>}
    <section className="rp-experiments">
      <h3>Saved configurations</h3>
      <p className="rp-muted">Save a packing, clear the rectangles, and try a different order. Saves include the points and persist in this browser.</p>
      <div className="rp-save-controls"><input aria-label="Configuration name" placeholder={`Configuration ${saved.length + 1}`} maxLength={80} value={saveName} onChange={e => setSaveName(e.target.value)} /><button onClick={saveConfiguration}>Save configuration</button></div>
      {storageError && <p role="alert">{storageError}</p>}
      {!!samePoints.length && <p className="rp-muted">Saved range for these points: {percent(worstSaved)}–{percent(bestSaved)} · Current: {percent(covered)} ({covered >= bestSaved ? '+' : '−'}{Math.abs((covered - bestSaved) * 100).toFixed(2)} percentage points)</p>}
      {!saved.length && <p className="rp-muted">No configurations saved yet.</p>}
      <div className="rp-saved-list">{[...saved].sort((a, b) => b.rectangles.reduce((s, r) => s + area(r), 0) - a.rectangles.reduce((s, r) => s + area(r), 0)).map(c => {
        const same = pointSetKey(c.points) === pointSetKey(points)
        const score = c.rectangles.reduce((s, r) => s + area(r), 0)
        return <div key={c.id}><span><strong>{c.name}</strong><small>{c.points.length} points · {same ? 'Same point set' : 'Different point set'}{same && Math.abs(score - bestSaved) < 1e-10 ? ' · Highest saved' : ''}{same && Math.abs(score - worstSaved) < 1e-10 ? ' · Lowest saved' : ''}</small></span><strong>{percent(score)}</strong><button onClick={() => loadConfiguration(c)} aria-label={`Load ${c.name}`}>Load</button><button onClick={() => persist(saved.filter(item => item.id !== c.id))} aria-label={`Delete ${c.name}`}>Delete</button></div>
      })}</div>
    </section>
    <section className="rp-experiments">
      <h3>Search packings</h3>
      <div className="rp-save-controls"><label>Search objective<select aria-label="Search objective" value={objective} disabled={running} onChange={e => { setObjective(e.target.value as 'maximum' | 'minimum-greedy'); setSearch(null) }}><option value="minimum-greedy">Minimum greedy coverage</option><option value="maximum">Maximum possible coverage</option></select></label></div>
      <p className="rp-muted">{objective === 'minimum-greedy' ? 'Tries every point order, always placing a maximum-area rectangle for the chosen point. All tied maximum-area choices are explored too. Only finished greedy runs are compared; smaller maximal rectangles are not allowed in this search.' : 'Searches all valid rectangle combinations on the point-coordinate grid, starting from an empty square. This grid contains a globally optimal packing.'} Both searches start from an empty square. Larger point sets can take a very long time.</p>
      <div className="rp-save-controls"><label>Search time<select value={seconds} disabled={running} onChange={e => setSeconds(Number(e.target.value))}><option value={10}>10 seconds</option><option value={60}>1 minute</option><option value={300}>5 minutes</option><option value={Infinity}>Until complete</option></select></label><button onClick={optimize} disabled={running}>{objective === 'minimum-greedy' ? 'Find minimum greedy coverage' : 'Find best packing'}</button>{running && <button onClick={stopSearch}>Stop search</button>}</div>
      {search && <>
        <div className="rp-search-result"><p role="status"><strong>{percent(search.covered)}</strong> · {running ? 'Searching…' : search.complete ? objective === 'minimum-greedy' ? 'Proven minimum greedy coverage' : 'Proven maximum coverage' : objective === 'minimum-greedy' ? 'Lowest found · search incomplete' : 'Best found · search incomplete'}<br /><small>{search.visited.toLocaleString()} states explored · {(search.elapsed / 1000).toFixed(1)} seconds</small></p><button onClick={() => { setPlaced(search.rectangles); setSelected(null); setChoice(0) }}>{objective === 'minimum-greedy' ? 'Use lowest-coverage packing' : 'Use best packing'}</button></div>
        {objective === 'minimum-greedy' && <>
          <p className="rp-muted">{search.complete ? 'No greedy order covers less for this point set (including ties).' : 'This is a completed greedy run, but another order may cover less. Until the search finishes, this is an upper bound on the minimum.'} {search.covered < .5 - 1e-10 ? 'A greedy run below 50% was found. This does not contradict the conjecture about optimal packings.' : 'This run covers at least 50%; that does not prove every greedy order does.'}</p>
          <details className="rp-rules"><summary>Greedy placement order</summary><ol>{search.rectangles.map((r, i) => <li key={r.pointId}>{i + 1}. Point {r.pointId} · {percent(area(r))} · {r.width.toFixed(3)} × {r.height.toFixed(3)}</li>)}</ol></details>
        </>}
      </>}

    </section>
    <details className="rp-rules"><summary>How this experiment works</summary><p>The square has area 1. The total point count includes the fixed origin (0, 0); the other n−1 points follow the chosen layout. The anti-diagonal preset places those interior points on x + y = 1 while retaining the origin separately. Each point anchors the bottom-left corner of an axis-aligned rectangle. Rectangles stay inside the square, have disjoint interiors, and cannot contain another point in their interior. Shared sides and points on rectangle boundaries are allowed.</p><p>A maximal rectangle cannot grow in width or height without violating a rule, with earlier rectangles held fixed. There can be several maximal choices; they are listed by area. The optimizer also considers smaller choices on the point-coordinate grid. Any packing can be expanded until every top and right edge meets a point coordinate or the square boundary, so this finite grid contains an optimum. An incomplete search gives a lower bound, not a proven maximum. Removing rectangles may let earlier choices grow again.</p><p>Coverage is the sum of the rectangle areas because their interiors do not overlap. Coordinates and areas in the interface are rounded for display.</p></details>
  </div>
}
