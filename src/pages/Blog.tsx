import { Link } from 'react-router-dom'
import ArticleTitle from '../components/ui/ArticleTitle'
import { useTheme } from '../context/ThemeContext'

// This would be dynamically loaded from MDX files
const blogPosts = [
  {
    slug: 'welcome',
    title: 'Welcome to My Blog',
    date: '2024-12-20',
    description: 'An introduction to my new React-powered blog with MDX support.',
    tags: ['introduction', 'react', 'mdx'],
  },
]

export default function Blog() {
  const { theme } = useTheme()

  return (
    <>
      <header>
        <ArticleTitle>Blog</ArticleTitle>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={`relative rounded-16 overflow-hidden shadow-shadow-4 group ${
              theme === 'dark'
                ? 'bg-border-gradient-onyx'
                : 'bg-white border border-gray-100'
            }`}
          >
            <div className={`absolute inset-[1px] rounded-16 -z-10 ${
              theme === 'dark' ? 'bg-eerie-black-1' : 'bg-white'
            }`} />

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <time className={`text-fs-6 font-light ${
                  theme === 'dark' ? 'text-light-gray-70' : 'text-light-muted'
                }`}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <h3 className={`text-fs-3 mb-3 transition-colors group-hover:text-orange-yellow-crayola ${
                theme === 'dark' ? 'text-white-2' : 'text-light-text'
              }`}>
                {post.title}
              </h3>

              <p className={`text-fs-6 font-light leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
              }`}>
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded text-fs-8 ${
                      theme === 'dark'
                        ? 'bg-jet text-light-gray'
                        : 'bg-gray-100 text-light-muted'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
