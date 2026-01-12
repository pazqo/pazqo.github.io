import { Link } from 'react-router-dom'
import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import { useTheme } from '../context/ThemeContext'

export default function Games() {
  const { theme } = useTheme()

  const textClass = theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
  const cardClass = theme === 'dark'
    ? 'bg-eerie-black-2 border-jet hover:border-orange-yellow-crayola'
    : 'bg-white border-gray-200 hover:border-orange-yellow-crayola'

  return (
    <>
      <header>
        <ArticleTitle>Games</ArticleTitle>
      </header>

      <p className={`text-fs-6 mb-4 ${textClass}`}>
        A collection of word and logic games I've created to challenge your brain.
      </p>
      <p className={`text-fs-7 mb-8 ${textClass}`}>
        Have feedback or ideas? Drop me a line at{' '}
        <a href="mailto:pazqop@gmail.com" className="text-orange-yellow-crayola hover:underline">
          pazqop@gmail.com
        </a>
      </p>

      <section className="mb-8">
        <SectionTitle>Word Games</SectionTitle>

        <div className="grid gap-4">
          <Link
            to="/games/connect-words"
            className={`block p-5 rounded-lg border-2 transition-all ${cardClass}`}
          >
            <h3 className={`text-fs-5 font-semibold mb-2 ${
              theme === 'dark' ? 'text-white-2' : 'text-light-text'
            }`}>
              Connect Words
            </h3>
            <p className={`text-fs-7 ${textClass}`}>
              Group words by their common category. Select two words that belong together
              to merge them into a group. Find all the hidden categories to win!
            </p>
            <div className="mt-3 flex gap-2">
              <span className={`text-fs-8 px-2 py-1 rounded ${
                theme === 'dark' ? 'bg-jet text-light-gray' : 'bg-gray-100 text-gray-600'
              }`}>
                Word Puzzle
              </span>
              <span className={`text-fs-8 px-2 py-1 rounded ${
                theme === 'dark' ? 'bg-jet text-light-gray' : 'bg-gray-100 text-gray-600'
              }`}>
                Categories
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <SectionTitle>Logic Games</SectionTitle>

        <div className="grid gap-4">
          <Link
            to="/games/black-white"
            className={`block p-5 rounded-lg border-2 transition-all ${cardClass}`}
          >
            <h3 className={`text-fs-5 font-semibold mb-2 ${
              theme === 'dark' ? 'text-white-2' : 'text-light-text'
            }`}>
              Black & White Path
            </h3>
            <p className={`text-fs-7 ${textClass}`}>
              Create a path through the board to make each row or column a single color.
              Inner cells flip when visited. Plan your route carefully!
            </p>
            <div className="mt-3 flex gap-2">
              <span className={`text-fs-8 px-2 py-1 rounded ${
                theme === 'dark' ? 'bg-jet text-light-gray' : 'bg-gray-100 text-gray-600'
              }`}>
                Logic Puzzle
              </span>
              <span className={`text-fs-8 px-2 py-1 rounded ${
                theme === 'dark' ? 'bg-jet text-light-gray' : 'bg-gray-100 text-gray-600'
              }`}>
                Path Finding
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}
