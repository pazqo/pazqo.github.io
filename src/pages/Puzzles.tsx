import { Link } from 'react-router-dom'
import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import LinkedInGamesTable from '../components/ui/LinkedInGamesTable'
import { useTheme } from '../context/ThemeContext'

export default function Puzzles() {
  const { theme } = useTheme()

  const linkClass = "text-orange-yellow-crayola hover:underline"
  const primaryLinkClass = "text-orange-yellow-crayola hover:underline font-semibold"
  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'

  return (
    <>
      <header>
        <ArticleTitle>Puzzles</ArticleTitle>
      </header>

      <p className={`text-fs-6 mb-8 ${textClass}`}>
        A collection of resources for puzzle enthusiasts - from pen-and-paper logic puzzles to mechanical puzzles you can hold in your hands.
      </p>

      {/* Daily Puzzles Section */}
      <section className="mb-8">
        <SectionTitle>Daily Puzzles</SectionTitle>
        <p className={`text-fs-7 mb-3 ${textClass}`}>
          Online puzzles that refresh ~daily - perfect for a quick brain workout.
        </p>
        <ul className={`text-fs-6 space-y-2 ${textClass}`}>
          <li>
            <a href="https://www.linkedin.com/games/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              LinkedIn Games
            </a>
            {' '}- A variety of daily puzzles including 6x6 Sudoku, Queens and more.
            If you want to challenge me, connect on <a href="https://www.linkedin.com/in/pazqo/" target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn</a>! My stats:
            <LinkedInGamesTable />
          </li>
          <li>
            <a href="https://inkwellgames.com/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Stars + Fields by Inkwell Games
            </a>
            {' '}- Classic Startbattle daily puzzle, plus Fields (probably more to come)
          </li>
          <li>
            <a href="https://replicube.xyz/staging/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Replicube
            </a>
            {' '}- Use Lua code to generate the picture/animation of the day (actually, Mon + Wed + Fri)
          </li>
          <li>
            <a href="https://enclose.horse/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Enclose Horse
            </a>
            {' '}- Create the largest enclosed area with limited blockers. Tricky to get the optimal score!
          </li>
          <li>
            <a href="https://cluesbysam.com/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Clues by Sam
            </a>
            {' '}- Solve the mistery by unveiling Innocents and Criminals.
          </li>
          <li>
            <a href="https://raddle.quest/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Raddle Quest
            </a>
            {' '}- A word-transformation game.
          </li>
          <li>
            <a href="https://www.reddit.com/r/syllo/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Syllo
            </a>
            {' '}- A reddit-hosted syllable arrangement game.
          </li>
          <li>
            <a href="https://thinkygames.com/dailies/" target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Thinky Games
            </a>
            {' '}- A new puzzle every day, differnt varieties, and story based too!
          </li>
          {/* Add more daily puzzles here */}
        </ul>
      </section>

      {/* Mechanical Puzzles */}
      <section>
        <SectionTitle>Mechanical Puzzles</SectionTitle>
        <p className={`text-fs-6 mb-3 ${textClass}`}>
          Physical puzzles you can hold in your hands - burrs, boxes, packing puzzles, and more.
        </p>
        <ul className={`text-fs-6 space-y-2 ${textClass}`}>
          <li>
            <Link to="/puzzle-collection" className={primaryLinkClass}>
              My Collection
            </Link>
            {' '}- Browse my personal puzzle collection with photos
          </li>
        </ul>
      </section>
    </>
  )
}
