import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = { title: 'Blog' }

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <div className="px-12 py-16 max-w-2xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-10">
        Writing
      </p>
      <div className="divide-y divide-border">
        {posts.map(post => (
          <div key={post.slug} className="py-8 first:pt-0">
            <p className="text-[11px] text-muted mb-2">{post.date}</p>
            <h2 className="font-black text-xl tracking-tight text-fg mb-2 leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-4">{post.summary}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-[11px] font-bold text-accent uppercase tracking-widest hover:underline"
            >
              Read →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
