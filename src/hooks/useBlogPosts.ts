import { useState, useEffect } from 'react'

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

// Import all MDX files from content/blog
const postFiles = import.meta.glob('../content/blog/*.mdx', { eager: true }) as Record<
  string,
  { default: React.ComponentType; frontmatter: Record<string, unknown> }
>

export function getAllPosts(): BlogPostMeta[] {
  const posts = Object.entries(postFiles).map(([path, module]) => {
    const slug = path.split('/').pop()?.replace('.mdx', '') || ''
    const frontmatter = module.frontmatter || {}

    return {
      slug,
      title: (frontmatter.title as string) || slug,
      date: (frontmatter.date as string) || '',
      description: (frontmatter.description as string) || '',
      tags: (frontmatter.tags as string[]) || [],
    }
  })

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string) {
  const matchingPath = Object.keys(postFiles).find((p) => p.endsWith(`/${slug}.mdx`))

  if (matchingPath && postFiles[matchingPath]) {
    const module = postFiles[matchingPath]
    return {
      Component: module.default,
      frontmatter: module.frontmatter || {},
    }
  }

  return null
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([])

  useEffect(() => {
    setPosts(getAllPosts())
  }, [])

  return posts
}
