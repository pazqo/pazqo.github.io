import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import L from 'leaflet'
import ArticleTitle from '../components/ui/ArticleTitle'
import { ring } from '../lib/circlemap/geo'
import { findMatches, type City, type Circle } from '../lib/circlemap/matches'
import 'leaflet/dist/leaflet.css'
import '../styles/circle-map.css'

const palette = ['#2dd4df', '#f5b965', '#a69af4', '#f18fb8', '#8bce8c', '#81aafa']
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const countries = new Intl.DisplayNames(['en'], { type: 'region' })
const country = (c: City) => countries.of(c.country) || c.country
const fmt = (n: number) => Math.round(n).toLocaleString()
const textNode = (s: string) => { const el = document.createElement('span'); el.textContent = s; return el }

function CitySearch({ cities, city, onSelect }: { cities: City[]; city: City; onSelect: (city: City) => void }) {
  const [query, setQuery] = useState(city.name)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const q = normalize(query.trim())
  const found = useMemo(() => cities.filter(c => normalize(`${c.name} ${c.ascii}`).includes(q))
    .sort((a, b) => Number(normalize(b.name).startsWith(q)) - Number(normalize(a.name).startsWith(q)) || b.population - a.population).slice(0, 7), [cities, q])
  const select = (c: City) => { onSelect(c); setQuery(c.name); setOpen(false); setHighlight(-1) }
  return <div className="cm-search" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setOpen(false); setQuery(city.name) } }}>
    <label htmlFor={`city-${city.id}`}>Starting city</label>
    <input id={`city-${city.id}`} value={query} placeholder="Search for a city…" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="city-suggestions" aria-activedescendant={open && highlight >= 0 ? `city-option-${highlight}` : undefined}
      onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true); setHighlight(-1) }} onKeyDown={e => {
        if (e.key === 'Escape') { setOpen(false); setQuery(city.name) }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setHighlight(h => Math.max(0, Math.min(found.length - 1, h + (e.key === 'ArrowDown' ? 1 : -1)))) }
        if (e.key === 'Enter' && open && found.length) { e.preventDefault(); select(found[Math.max(0, highlight)]) }
      }} />
    {open && <div className="cm-suggestions" id="city-suggestions" role="listbox" aria-label="Cities">
      {found.map((c, i) => <button key={c.id} id={`city-option-${i}`} role="option" aria-selected={highlight === i} onMouseDown={e => e.preventDefault()} onClick={() => select(c)}><strong>{c.name}</strong><span>{country(c)}</span></button>)}
      {!found.length && <p>No city found. Try a nearby larger city.</p>}
    </div>}
    <small>{country(city)} · {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°</small>
  </div>
}

export default function CircleMap() {
  const [cities, setCities] = useState<City[]>([])
  const [status, setStatus] = useState('Loading cities…')
  const [circles, setCircles] = useState<Circle[]>([])
  const [activeId, setActiveId] = useState(0)
  const [tolerance, setTolerance] = useState(50)
  const [population, setPopulation] = useState(100000)
  const [mode, setMode] = useState<'any' | 'all'>('any')
  const [fitVersion, setFitVersion] = useState(0)
  const nextId = useRef(1)
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markers = useRef(new Map<number, L.CircleMarker>())
  const active = circles.find(c => c.id === activeId)
  const matches = useMemo(() => findMatches(cities, circles, tolerance, population, mode), [cities, circles, tolerance, population, mode])

  useEffect(() => {
    const abort = new AbortController()
    fetch(`${import.meta.env.BASE_URL}data/cities.json`, { signal: abort.signal }).then(r => { if (!r.ok) throw Error(); return r.json() }).then((data: City[]) => {
      setCities(data)
      setCircles([{ id: 0, origin: data.find(c => c.id === 2657896) || data[0], km: 1000, color: palette[0] }])
      setStatus('')
    }).catch(e => { if (e.name !== 'AbortError') setStatus('City data could not load. Please reload to try again.') })
    return () => abort.abort()
  }, [])

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current, { minZoom: 1, maxZoom: 16, worldCopyJump: true, scrollWheelZoom: false, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false }).setView([47.37, 8.54], 4)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(instance)
    map.current = instance
    const observer = new ResizeObserver(() => instance.invalidateSize())
    observer.observe(container.current)
    return () => { observer.disconnect(); instance.stop(); instance.remove(); map.current = null }
  }, [])

  useEffect(() => {
    const instance = map.current
    if (!instance || !circles.length) return
    const layer = L.layerGroup().addTo(instance)
    const reference = circles[0].origin.lon
    markers.current.clear()
    for (const circle of circles) {
      const shift = 360 * Math.round((reference - circle.origin.lon) / 360)
      const points = ring(circle.origin, circle.km)
      for (const offset of [-360, 0, 360]) L.polyline(points.map(([lat, lon]) => [lat, lon + shift + offset]), { color: circle.color, weight: circle.id === activeId ? 3 : 2 }).addTo(layer)
      L.circleMarker([circle.origin.lat, circle.origin.lon + shift], { radius: 8, color: '#fff', weight: 2, fillColor: circle.color, fillOpacity: 1 }).bindTooltip(textNode(circle.origin.name), { permanent: true, direction: 'top' }).addTo(layer)
    }
    for (const city of matches) {
      const lon = city.lon + 360 * Math.round((reference - city.lon) / 360)
      const marker = L.circleMarker([city.lat, lon], { radius: 5, color: '#fff', weight: 1.5, fillColor: '#b5772a', fillOpacity: 1 }).addTo(layer)
      marker.bindTooltip(textNode(city.name)).bindPopup(textNode(`${city.name}, ${country(city)} · ${fmt(city.population)} people · ${city.hits.map(h => `${h.circle.origin.name}: ${fmt(h.distance)} km`).join(' / ')}`))
      markers.current.set(city.id, marker)
    }
    return () => {
      // Map teardown runs first on unmount and already removes every layer.
      // Calling stop() afterwards tries to reposition a destroyed map pane.
      if (map.current !== instance) return
      instance.stop()
      layer.remove()
    }
  }, [circles, matches, activeId])

  useEffect(() => {
    const instance = map.current
    if (!instance || !circles.length) return
    const reference = circles[0].origin.lon
    if (circles.some(c => c.km > 9000 || Math.abs(c.origin.lat) + c.km / 111 > 83)) instance.setView([0, reference], 2)
    else instance.fitBounds(L.latLngBounds(circles.flatMap(c => ring(c.origin, c.km).map(([lat, lon]): [number, number] => [lat, lon + 360 * Math.round((reference - c.origin.lon) / 360)]))), { padding: [35, 35], maxZoom: 9 })
    // Fit on request or when the number of circles changes; editing keeps the map in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitVersion, circles.length])

  function update(patch: Partial<Circle>) { setCircles(list => list.map(c => c.id === activeId ? { ...c, ...patch } : c)) }
  function add() { if (!active) return; const id = nextId.current++; setCircles(list => [...list, { ...active, id, km: Math.min(20000, active.km + 500), color: palette[id % palette.length] }]); setActiveId(id) }
  function remove(id: number) { const remaining = circles.filter(c => c.id !== id); setCircles(remaining); if (activeId === id) setActiveId(remaining[0].id) }
  function focus(city: City) { const marker = markers.current.get(city.id); if (marker) { map.current?.setView(marker.getLatLng(), 6); marker.openPopup(); container.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } }

  return <div className="cm-page">
    <Link to="/games" className="cm-back"><ArrowLeft size={16} /> Back to Games/Apps</Link>
    <ArticleTitle>Circle Map</ArticleTitle>
    <p className="cm-intro">What's a circle away? Pick a city and a distance to discover the cities along its circle. Add more circles to find where they meet.</p>
    {status && <p role="status" className="cm-panel">{status}</p>}
    {active && <div className="cm-panel">
      <div className="cm-heading"><h3>Your circles</h3><button onClick={add} className="cm-add"><Plus size={16} /> Add circle</button></div>
      <div className="cm-circles">{circles.map(c => <div className={`cm-chip ${c.id === activeId ? 'is-active' : ''}`} key={c.id}>
        <button aria-pressed={c.id === activeId} onClick={() => setActiveId(c.id)}><i style={{ background: c.color }} />{c.origin.name} · {fmt(c.km)} km</button>
        <button disabled={circles.length === 1} aria-label={`Remove ${c.origin.name} circle`} onClick={() => remove(c.id)}><X size={14} /></button>
      </div>)}</div>
      <div className="cm-fields">
        <CitySearch key={active.id} cities={cities} city={active.origin} onSelect={origin => { update({ origin }); setFitVersion(v => v + 1) }} />
        <div><label htmlFor="cm-distance">Distance (km)</label><input id="cm-distance" key={`${active.id}-${active.km}`} type="number" min="1" max="20000" step="1" defaultValue={active.km} onBlur={e => { const n = Number(e.target.value); const km = Math.max(1, Math.min(20000, Number.isFinite(n) && n > 0 ? n : active.km)); e.target.value = String(km); update({ km }) }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }} /><small>Approximate surface distance</small></div>
      </div>
      <label className="cm-sr" htmlFor="cm-range">Distance slider (km)</label><input id="cm-range" type="range" min="1" max="20000" step="1" value={active.km} onChange={e => update({ km: Number(e.target.value) })} />
      <div className="cm-range-labels"><span>1 km</span><span>20,000 km</span></div>
    </div>}
    <div className="cm-map-heading"><span><i className="cm-result-dot" /> Matching cities</span><button disabled={!active} onClick={() => setFitVersion(v => v + 1)}>Fit all circles</button></div>
    <div ref={container} className="cm-map" role="region" aria-label="Interactive city distance map" />
    {active && <section className="cm-results">
      <div className="cm-heading"><h3>Cities along the circles <span className="cm-count">{matches.length}</span></h3><span>Largest population first</span></div>
      <div className="cm-filters">
        <label>Close enough<select value={tolerance} onChange={e => setTolerance(Number(e.target.value))}>{[25, 50, 100, 250].map(n => <option key={n} value={n}>± {n} km</option>)}</select></label>
        <label>Population<select value={population} onChange={e => setPopulation(Number(e.target.value))}><option value="100000">100,000+</option><option value="500000">500,000+</option><option value="1000000">1,000,000+</option><option value="0">All in dataset</option></select></label>
        <label>Match<select value={mode} onChange={e => setMode(e.target.value as 'any' | 'all')}><option value="any">Any circle</option><option value="all">Every circle</option></select></label>
      </div>
      <p aria-live="polite" className="cm-summary">{matches.length ? `${matches.length} matching cities · within ± ${tolerance} km of ${mode === 'all' ? 'every' : 'any'} circle` : 'No cities match. Try a wider tolerance, a different distance, or a lower population.'}</p>
      <div className="cm-result-list">{matches.map((city, i) => <button key={city.id} className="cm-result" onClick={() => focus(city)}>
        <span className="cm-rank">{i + 1}</span><span className="cm-city"><strong>{city.name}</strong><small>{country(city)} · {fmt(city.population)} people</small><span className="cm-hits">{city.hits.map(hit => <span key={hit.circle.id}><i style={{ background: hit.circle.color }} />{hit.circle.origin.name} · {fmt(hit.distance)} km</span>)}</span></span><span aria-hidden="true">↗</span>
      </button>)}</div>
    </section>}
    <p className="cm-footnote">Distances follow the Earth's surface, not travel routes. Search and calculations run locally; map tiles need an internet connection. City coverage and population estimates vary. City data: <a href="https://www.geonames.org/">GeoNames</a> (<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>), cities5000 snapshot.</p>
  </div>
}
