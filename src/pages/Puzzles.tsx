import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import SudokuGrid from '../components/sudoku/SudokuGrid'
import { useTheme } from '../context/ThemeContext'

export default function Puzzles() {
  const { theme } = useTheme()

  // Example Sudoku puzzle (0 = empty)
  const examplePuzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'

  return (
    <>
      <header>
        <ArticleTitle>Puzzles</ArticleTitle>
      </header>

      <section className="mb-8">
        <SectionTitle>Interactive Sudoku</SectionTitle>
        <p className={`text-fs-6 mb-4 ${
          theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
        }`}>
          Here's an example Sudoku puzzle rendered with React. You can embed these in blog posts too!
        </p>
        <div className="flex justify-center">
          <SudokuGrid puzzle={examplePuzzle} />
        </div>
      </section>

      <section>
        <SectionTitle>Coming Soon</SectionTitle>
        <p className={`text-fs-6 ${
          theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
        }`}>
          More puzzle content and interactive features are in the works!
        </p>
      </section>
    </>
  )
}
