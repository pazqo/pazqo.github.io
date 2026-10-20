import { Link } from 'react-router-dom'
import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import LinkedInGamesTable from '../components/ui/LinkedInGamesTable'
import { useTheme } from '../context/ThemeContext'
import puzzlePageData from '../data/puzzles-page.json'

type PuzzleLink = {
  id: string
  title: string
  url: string
  description: string
  internal?: boolean
  widget?: string
  relatedLink?: {
    before: string
    title: string
    url: string
    after: string
  }
  showLinkedInStats?: boolean
}

const { dailyPuzzles, interestingPuzzleResources, janeStreetPuzzles, mechanicalPuzzles } =
  puzzlePageData as {
    dailyPuzzles: PuzzleLink[]
    interestingPuzzleResources: PuzzleLink[]
    janeStreetPuzzles: PuzzleLink[]
    mechanicalPuzzles: PuzzleLink[]
  }

export default function Puzzles() {
  const { theme } = useTheme()

  const linkClass = 'text-orange-yellow-crayola hover:underline'
  const primaryLinkClass = 'text-orange-yellow-crayola hover:underline font-semibold'
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  const renderPuzzleLink = (item: PuzzleLink, primary = false) => {
    const className = primary ? primaryLinkClass : linkClass
    return item.internal ? (
      <Link to={item.url} className={className}>
        {item.title}
      </Link>
    ) : (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
        {item.title}
      </a>
    )
  }

  const renderPuzzleItems = (items: PuzzleLink[]) => items.map((item) => (
    <li key={item.id}>
      {renderPuzzleLink(item, true)}
      {' - '}{item.description}
      {item.relatedLink && (
        <>
          {' '}{item.relatedLink.before}
          <a href={item.relatedLink.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {item.relatedLink.title}
          </a>
          {item.relatedLink.after}
        </>
      )}
      {item.widget && (
        <>
          {' · '}
          <Link
            to={item.widget}
            className="font-semibold text-orange-yellow-crayola underline"
          >
            Try it live!
          </Link>
        </>
      )}
      {item.showLinkedInStats && <LinkedInGamesTable />}
    </li>
  ))

  return (
    <>
      <header>
        <ArticleTitle>Puzzles</ArticleTitle>
      </header>

      <p className={`text-fs-6 mb-8 ${textClass}`}>
        A collection of resources for puzzle enthusiasts - from pen-and-paper logic puzzles to mechanical puzzles you can hold in your hands.
      </p>

      <section className="mb-8">
        <SectionTitle>Daily Puzzles</SectionTitle>
        <p className={`text-fs-7 mb-3 ${textClass}`}>
          Online puzzles that refresh ~daily - perfect for a quick brain workout.
        </p>
        <ul className={`text-fs-6 space-y-2 ${textClass}`}>
          {renderPuzzleItems(dailyPuzzles)}
        </ul>
      </section>

      <section>
        <SectionTitle>Interesting Puzzle Resources</SectionTitle>
        <ul className={`text-fs-6 space-y-2 mb-8 ${textClass}`}>
          {renderPuzzleItems(interestingPuzzleResources)}
        </ul>
      </section>

      <section className="mb-8">
        <SectionTitle>Jane Street Puzzles</SectionTitle>
        <p className={`text-fs-7 mb-3 ${textClass}`}>
          Monthly puzzles from <a href={puzzlePageData.janeStreetPuzzlesPageLink.url} target="_blank" rel="noopener noreferrer" className={linkClass}>{puzzlePageData.janeStreetPuzzlesPageLink.title}</a> - challenging math and logic problems.{' '}
          You can find me as <b>pazqo</b> in the list of submissions, usually in the solution page.
        </p>
        <ul className={`text-fs-6 space-y-2 ${textClass}`}>
          {renderPuzzleItems(janeStreetPuzzles)}
        </ul>
      </section>

      <section>
        <SectionTitle>Mechanical Puzzles</SectionTitle>
        <p className={`text-fs-6 mb-3 ${textClass}`}>
          Physical puzzles you can hold in your hands - burrs, boxes, packing puzzles, and more.
        </p>
        <ul className={`text-fs-6 space-y-2 ${textClass}`}>
          {renderPuzzleItems(mechanicalPuzzles)}
        </ul>
      </section>
    </>
  )
}
