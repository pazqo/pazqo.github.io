import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import usePageTracking from './hooks/usePageTracking'
import Layout from './components/layout/Layout'
import About from './pages/About'
import Resume from './pages/Resume'
import Puzzles from './pages/Puzzles'
import PuzzleCollection from './pages/PuzzleCollection'
import Sudoku from './pages/Sudoku'
import SudokuTips from './pages/SudokuTips'
import Games from './pages/Games'
import ConnectWords from './pages/ConnectWords'
import BlackWhite from './pages/BlackWhite'
import NationPuzzle from './pages/NationPuzzle'
import HallOfMirrors from './pages/HallOfMirrors'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Ouroboros from './pages/Ouroboros'

const RectanglePacking = lazy(() => import('./pages/RectanglePacking'))
const CircleMap = lazy(() => import('./pages/CircleMap'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  usePageTracking()

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Standalone landing page - no layout */}
        <Route path="/ouroboros" element={<Ouroboros />} />

      {/* All other pages with standard layout */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/puzzles" element={<Puzzles />} />
            <Route path="/puzzle-collection" element={<PuzzleCollection />} />
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/sudoku/tips-and-tricks" element={<SudokuTips />} />
            <Route path="/games" element={<Games />} />
            <Route path="/apps/rectangle-lab" element={<Suspense fallback={<p>Loading Rectangle Lab…</p>}><RectanglePacking /></Suspense>} />
            <Route path="/apps/circle-map" element={<Suspense fallback={<p>Loading Circle Map…</p>}><CircleMap /></Suspense>} />
            <Route path="/games/connect-words" element={<ConnectWords />} />
            <Route path="/games/black-white" element={<BlackWhite />} />
            <Route path="/games/nation-puzzle" element={<NationPuzzle />} />
            <Route path="/games/hall-of-mirrors" element={<HallOfMirrors />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </Layout>
      } />
      </Routes>
    </>
  )
}

export default App
