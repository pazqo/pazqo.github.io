import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import About from './pages/About'
import Resume from './pages/Resume'
import Misc from './pages/Misc'
import Puzzles from './pages/Puzzles'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/puzzles" element={<Puzzles />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Layout>
  )
}

export default App
