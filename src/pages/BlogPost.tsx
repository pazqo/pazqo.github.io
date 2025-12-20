import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ArticleTitle from '../components/ui/ArticleTitle'
import { useTheme } from '../context/ThemeContext'
import { getPostBySlug } from '../hooks/useBlogPosts'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { theme } = useTheme()

  const post = slug ? getPostBySlug(slug) : null

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

  const { Component, frontmatter } = post
  const title = (frontmatter.title as string) || slug
  const date = frontmatter.date as string

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
        <ArticleTitle>{title}</ArticleTitle>
        {date && (
          <time className={`block mb-6 text-fs-6 ${
            theme === 'dark' ? 'text-vegas-gold' : 'text-light-accent'
          }`}>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </header>

      <article className={`prose max-w-none ${
        theme === 'dark'
          ? 'prose-invert prose-headings:text-white-2 prose-p:text-light-gray prose-li:text-light-gray prose-a:text-orange-yellow-crayola prose-strong:text-white-2'
          : 'prose-headings:text-light-text prose-p:text-light-muted prose-li:text-light-muted prose-a:text-light-accent prose-strong:text-light-text'
      }`}>
        <Component />
      </article>
    </>
  )
}
