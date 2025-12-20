import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ArticleTitle from '../components/ui/ArticleTitle'
import { useTheme } from '../context/ThemeContext'

// Placeholder for MDX content - will be replaced with actual MDX loading
const blogContent: Record<string, { title: string; date: string; content: React.ReactNode }> = {
  welcome: {
    title: 'Welcome to My Blog',
    date: '2024-12-20',
    content: (
      <>
        <p>
          Welcome to my new React-powered blog! This site has been completely rebuilt using
          modern web technologies:
        </p>
        <ul>
          <li><strong>React 18</strong> with TypeScript for type-safe components</li>
          <li><strong>Vite</strong> for lightning-fast development and builds</li>
          <li><strong>Tailwind CSS</strong> for utility-first styling</li>
          <li><strong>React Router</strong> with HashRouter for GitHub Pages compatibility</li>
          <li><strong>MDX</strong> support for writing blog posts in Markdown with React components</li>
        </ul>
        <h2>Features</h2>
        <p>
          The new site includes several interactive features:
        </p>
        <ul>
          <li>Dark/Light theme toggle with localStorage persistence</li>
          <li>Responsive design that works on all devices</li>
          <li>Interactive Sudoku puzzle renderer</li>
          <li>MDX blog with syntax highlighting</li>
        </ul>
        <p>
          Stay tuned for more posts about puzzles, programming, and mathematics!
        </p>
      </>
    ),
  },
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { theme } = useTheme()

  const post = slug ? blogContent[slug] : null

  if (!post) {
    return (
      <>
        <ArticleTitle>Post Not Found</ArticleTitle>
        <p className={theme === 'dark' ? 'text-light-gray' : 'text-light-muted'}>
          The blog post you're looking for doesn't exist.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 mt-4 text-orange-yellow-crayola hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </>
    )
  }

  return (
    <>
      <Link
        to="/blog"
        className={`inline-flex items-center gap-2 mb-6 transition-colors ${
          theme === 'dark'
            ? 'text-light-gray hover:text-orange-yellow-crayola'
            : 'text-light-muted hover:text-light-accent'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <header>
        <ArticleTitle>{post.title}</ArticleTitle>
        <time className={`block mb-6 text-fs-6 ${
          theme === 'dark' ? 'text-vegas-gold' : 'text-light-accent'
        }`}>
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>

      <article className={`prose max-w-none ${
        theme === 'dark'
          ? 'prose-invert prose-headings:text-white-2 prose-p:text-light-gray prose-li:text-light-gray prose-a:text-orange-yellow-crayola prose-strong:text-white-2'
          : 'prose-headings:text-light-text prose-p:text-light-muted prose-li:text-light-muted prose-a:text-light-accent prose-strong:text-light-text'
      }`}>
        {post.content}
      </article>
    </>
  )
}
