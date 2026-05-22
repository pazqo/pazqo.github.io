import { useState } from 'react'
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
  const [isZoomed, setIsZoomed] = useState(false)

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

        {/* Backdrop when zoomed */}
        {isZoomed && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsZoomed(false)}
          />
        )}

        {/* Puzzle Image */}
        <div className="flex justify-center mb-10">
          <img
            src="/images/puzzles/Ouroboros_unsolved_2.jpeg"
            alt="Ouroboros puzzle"
            onClick={() => setIsZoomed(!isZoomed)}
            className={`w-full max-w-lg rounded-3xl shadow-lg cursor-pointer transition-transform duration-300 ${
              isZoomed ? 'scale-150 z-50 relative' : 'hover:scale-[1.02]'
            } ${
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
            Fold the hinged snake so it fits entirely on the frame, with each hinge sitting in one of the holes.
          </p>

          <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>
            About
          </h2>
          <p className={`text-base leading-relaxed ${textClass}`}>
            Ouroboros was presented and exchanged at the{' '}
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
          <p className={`text-base leading-relaxed mt-4 ${textClass}`}>
            It was initially inspired by{' '}
            <a
              href="https://www.constantin-puzzles.de/de/produkte/p/p2d-420"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ouroboros-accent hover:text-ouroboros-accent-hover hover:underline"
            >
              Metermass/Tough Measures
            </a>
            {' '} by J. Constantin, but I wanted to use a single closed component.
            I'm not going to explain the rest of the thinking process, as it could spoil the solution.
            <br/>
            I'll leave some notes later, but I suggest you solve it first.
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
              <p>The solution is symmetric</p>
            </GreenSpoiler>
          </GreenSpoiler>

          <GreenSpoiler title="Hint 2">
            <GreenSpoiler title="Are you sure?">
              <p>The solution snake will self-cross; this movement is only possible in specific sections of the snake</p>
            </GreenSpoiler>
          </GreenSpoiler>

          <GreenSpoiler title="Hint 3">
            <GreenSpoiler title="Are you sure?">
              <p>Not all segments need to be parallel to one of the sides</p>
            </GreenSpoiler>
          </GreenSpoiler>

          <GreenSpoiler title="Hint 4">
            <GreenSpoiler title="Are you sure?">
              <p>There is no approximation, think of Pythagoras</p>
            </GreenSpoiler>
          </GreenSpoiler>

          <GreenSpoiler title="Hint 5">
            <GreenSpoiler title="Are you sure?">
              <p>I already explained that the solution is symmetric, but the symmetry is not reflectional! It's a 180° rotational symmetry</p>
            </GreenSpoiler>
          </GreenSpoiler>

          <GreenSpoiler title="Hint 6">
            <GreenSpoiler title="Are you sure?">
              <p>Two of the longer pieces must be self-symmetric as they are on different planes. Hence they must be in the center of symmetry</p>
            </GreenSpoiler>
          </GreenSpoiler>
          
          <p className={`text-base ${textClass}`}>
            There is still something to figure out, you can drop an email if you are still stuck.
          </p>
        </section>

        {/* Solution */}
        <section className="mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${headingClass}`}>
            Solution
          </h2>
          <p className={`text-base ${textClass}`}>
            The solution is not provided here. Keep trying - you can do it!
            If you are really in trouble, drop me an email and I can give you a nudge.
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
