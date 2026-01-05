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

      <p className={`text-fs-6 mb-8 ${textClass}`}>
        A collection of word and logic games to challenge your brain.
      </p>

      <section>
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
    </>
  )
}
