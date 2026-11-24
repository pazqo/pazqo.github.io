import { useState, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import ArticleTitle from '../components/ui/ArticleTitle'
import KillerTips from '../components/sudoku/KillerTips'
import ThermoTips from '../components/sudoku/ThermoTips'
import ArrowTips from '../components/sudoku/ArrowTips'
import { useTheme } from '../context/ThemeContext'

interface VariantSection {
  title: string
  tips: string[]
  content?: ComponentType
}

// Add tips to each list, or add another variant section here.
const variants: VariantSection[] = [
  { title: 'Killer Sudoku', tips: [], content: KillerTips },
  { title: 'Thermo Sudoku', tips: [], content: ThermoTips },
  { title: 'Arrow Sudoku', tips: [], content: ArrowTips },
  { title: 'Kropki Sudoku', tips: [] },
  { title: 'XV Sudoku', tips: [] },
  { title: 'Renban', tips: [] },
  { title: 'German Whispers', tips: [] },
  { title: 'Palindrome Sudoku', tips: [] },
  { title: 'Sandwich Sudoku', tips: [] },
  { title: 'Little Killer Sudoku', tips: [] },
]

const hasContent = (variant: VariantSection) => !!variant.content || variant.tips.length > 0
const comingSoonBadge = <span className="rounded-full border border-current/30 px-2 py-0.5 text-fs-8 font-normal whitespace-nowrap">Coming Soon</span>

export default function SudokuTips() {
  const { theme } = useTheme()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(() => new Set(variants.map(variant => variant.title)))
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
  const disabledClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const visible = variants.filter(variant => selected.has(variant.title) && variant.title.toLowerCase().includes(query.trim().toLowerCase()))

  function toggleVariant(title: string) {
    setSelected(previous => {
      const next = new Set(previous)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  return (
    <>
      <Link to="/sudoku" className="inline-flex items-center gap-2 text-orange-yellow-crayola hover:underline text-fs-7 mb-6">
        <ArrowLeft size={16} /> Back to Sudoku
      </Link>
      <ArticleTitle>Tips and Tricks</ArticleTitle>
      <p className={`text-fs-6 mb-8 ${textClass}`}>
        A collection of solving techniques for variant sudoku, organised by variation. Choose the variants you want to see, then open a section to explore its tips. More tips are on the way.
      </p>
      <div className={`mb-8 space-y-4 text-fs-6 ${textClass}`}>
        <label className="block">
          <span className="block mb-2">Search variants</span>
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="e.g. Killer or Thermo" className="w-full rounded-lg border border-current/30 bg-[var(--bg-primary)] text-[var(--text-primary)] px-3 py-2" />
        </label>
        <fieldset>
          <legend className="mb-2">Show variants</legend>
          <div className="flex gap-4 mb-3 text-fs-7">
            <button type="button" className="text-orange-yellow-crayola hover:underline" onClick={() => setSelected(new Set(variants.map(variant => variant.title)))}>Select all</button>
            <button type="button" className="text-orange-yellow-crayola hover:underline" onClick={() => setSelected(new Set())}>Clear selection</button>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {variants.map(variant => <label key={variant.title} className={`flex items-center gap-2 text-fs-7 ${hasContent(variant) ? 'cursor-pointer' : `cursor-default ${disabledClass}`}`}>
              <input type="checkbox" disabled={!hasContent(variant)} checked={selected.has(variant.title)} onChange={() => toggleVariant(variant.title)} className="accent-orange-yellow-crayola disabled:opacity-40" />
              {variant.title}
              {!hasContent(variant) && comingSoonBadge}
            </label>)}
          </div>
        </fieldset>
        <p role="status" className="text-fs-7">Showing {visible.length} of {variants.length} variants.</p>
      </div>
      {!visible.length && <p className={textClass}>No variants to show. Select a variant or change your search.</p>}
      {visible.map(variant => {
        if (!hasContent(variant)) return (
          <section key={variant.title} aria-disabled="true" className={`mb-4 rounded-lg border border-current/20 p-4 ${disabledClass}`}>
            <div className="flex flex-wrap items-center gap-3 pl-6">
              <h3 className="text-fs-2 font-medium">{variant.title}</h3>
              {comingSoonBadge}
            </div>
          </section>
        )
        const Content = variant.content
        return (
          <details key={variant.title} className={`mb-4 rounded-lg border border-current/20 ${textClass}`}>
            <summary className={`flex items-center gap-2 cursor-pointer p-4 text-fs-2 font-medium ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}>
              <ChevronRight size={18} aria-hidden="true" className="details-chevron shrink-0 transition-transform" />
              <h3>{variant.title}</h3>
            </summary>
            <div className="px-4 pb-5 text-fs-6">
              {Content ? <Content /> : (
                <ul className={`list-disc pl-5 space-y-2 text-fs-6 ${textClass}`}>
                  {variant.tips.map(tip => <li key={tip}>{tip}</li>)}
                </ul>
              )}
            </div>
          </details>
        )
      })}
    </>
  )
}
