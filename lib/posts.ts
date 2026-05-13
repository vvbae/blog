import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

export interface Post {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  content: string
}

export function getAllPosts(): Omit<Post, 'content'>[] {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
      const { data } = matter(raw)
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: data.title as string,
        date: data.date as string,
        summary: data.summary as string,
        tags: (data.tags as string[]) ?? [],
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug: string): Post {
  const file = path.join(POSTS_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(file, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: data.summary as string,
    tags: (data.tags as string[]) ?? [],
    content,
  }
}
