import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { ChevronRight, Sun, Moon } from 'lucide-react'

function GreenThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'dark'
          ? 'bg-ouroboros-card text-ouroboros-accent hover:bg-ouroboros-border'
          : 'bg-ouroboros-border-light text-ouroboros-accent-hover hover:bg-ouroboros-border-light/70'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

function GreenSpoiler({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <details
      className={`my-4 rounded-lg overflow-hidden border ${
        theme === 'dark'
          ? 'bg-ouroboros-card border-ouroboros-border'
          : 'bg-ouroboros-card-light border-ouroboros-border-light'
      }`}
    >
      <summary
        className={`px-4 py-3 cursor-pointer select-none font-medium flex items-center gap-2 ${
          theme === 'dark'
            ? 'text-ouroboros-accent hover:bg-ouroboros-border/30'
            : 'text-ouroboros-accent-hover hover:bg-ouroboros-border-light/50'
        }`}
      >
        <ChevronRight className="w-4 h-4 transition-transform duration-200 details-chevron" />
        {title}
      </summary>
      <div
        className={`px-4 py-3 border-t ${
          theme === 'dark'
            ? 'border-ouroboros-border text-ouroboros-muted'
            : 'border-ouroboros-border-light text-ouroboros-muted-light'
        }`}
      >
        {children}
      </div>
    </details>
  )
}

export default function Ouroboros() {
  const { theme } = useTheme()

  const textClass = theme === 'dark' ? 'text-ouroboros-muted' : 'text-ouroboros-muted-light'
  const headingClass = theme === 'dark' ? 'text-ouroboros-text' : 'text-ouroboros-text-light'

  return (
    <main className={`min-h-screen p-6 md:p-12 ${
      theme === 'dark' ? 'bg-ouroboros-bg' : 'bg-ouroboros-bg-light'
    }`}>
      <div className="max-w-2xl mx-auto">
        {/* Theme toggle */}
        <div className="flex justify-end mb-6">
          <GreenThemeToggle />
        </div>

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${headingClass}`}>
            Ouroboros
          </h1>
        </header>

        {/* Puzzle Image */}
        <div className="flex justify-center mb-10">
          <img
            src="/images/puzzles/Ouroboros_unsolved.jpeg"
            alt="Ouroboros puzzle"
            className={`w-full max-w-lg rounded-lg shadow-lg ${
              theme === 'dark'
                ? 'border border-ouroboros-border'
                : 'border border-ouroboros-border-light'
            }`}
          />
        </div>

        {/* Description */}
        <section className="mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>
            Objective
          </h2>
          <p className={`text-base leading-relaxed mb-6 ${textClass}`}>
            The long hinged snake must be folded so that it fits its entirety on the frame, with hinges fitting in the frame holes.
          </p>

          <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>
            About
          </h2>
          <p className={`text-base leading-relaxed ${textClass}`}>
            Ouroboros was presented at the{' '}
            <a
              href="http://www.puzzleparty.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ouroboros-accent hover:text-ouroboros-accent-hover hover:underline"
            >
              International Puzzle Party
            </a>
            {' '}XLIII (2026).
          </p>
          <p className={`text-base leading-relaxed mt-4 italic ${textClass}`}>
            More details about the design and production process coming soon.
          </p>
        </section>

        {/* Hints */}
        <section className="mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>
            Hints
          </h2>
          <p className={`text-sm mb-4 ${textClass}`}>
            Stuck? Each hint requires two clicks to reveal.
          </p>

          <GreenSpoiler title="Hint 1">
            <GreenSpoiler title="Are you sure?">
              <p>[First hint goes here]</p>
            </GreenSpoiler>
          </GreenSpoiler>
        </section>

        {/* Solution */}
        <section className="mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>
            Solution
          </h2>
          <p className={`text-base ${textClass}`}>
            The solution is not provided here. Keep trying - you can do it!
          </p>
        </section>

        {/* Get a copy */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>
            Get a copy
          </h2>
          <p className={`text-base ${textClass}`}>
            Interested in owning one? Contact me at{' '}
            <a
              href="mailto:pascoluttistefano@gmail.com"
              className="text-ouroboros-accent hover:text-ouroboros-accent-hover hover:underline"
            >
              pascoluttistefano@gmail.com
            </a>
            {' '}for pricing and availability.
          </p>
        </section>

        {/* Link to main site */}
        <footer className={`text-center pt-8 border-t ${
          theme === 'dark' ? 'border-ouroboros-border' : 'border-ouroboros-border-light'
        }`}>
          <Link
            to="/"
            className="text-ouroboros-accent hover:text-ouroboros-accent-hover hover:underline"
          >
            Visit my website
          </Link>
        </footer>
      </div>
    </main>
  )
}
