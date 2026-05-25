import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import About from './pages/About'
import Resume from './pages/Resume'
import Puzzles from './pages/Puzzles'
import PuzzleCollection from './pages/PuzzleCollection'
import Sudoku from './pages/Sudoku'
import Games from './pages/Games'
import ConnectWords from './pages/ConnectWords'
import BlackWhite from './pages/BlackWhite'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Ouroboros from './pages/Ouroboros'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
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
            <Route path="/games" element={<Games />} />
            <Route path="/games/connect-words" element={<ConnectWords />} />
            <Route path="/games/black-white" element={<BlackWhite />} />
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
