import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllPosts, getPost } from '@/lib/posts'
import YouTubeEmbed from '@/components/YouTubeEmbed'
import LocalVideo from '@/components/LocalVideo'

const components = { YouTubeEmbed, LocalVideo }
const mdxOptions = { mdxOptions: { remarkPlugins: [remarkGfm] } }

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = getPost(params.slug)
    return { title: post.title, description: post.summary }
  } catch {
    return {}
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  let post
  try {
    post = getPost(params.slug)
  } catch {
    notFound()
  }

  return (
    <div className="px-12 py-16">
      <div className="max-w-[680px]">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-fg leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] text-muted">{post.date}</span>
          {post.tags.map(tag => (
            <span key={tag} className="text-[9px] uppercase tracking-widest text-muted font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="w-9 h-[3px] bg-accent mb-10" />
        <article className="prose prose-sm max-w-none
          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
          prose-p:text-fg prose-p:leading-relaxed
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-code:text-accent prose-code:bg-fg/5 prose-code:rounded
          prose-pre:bg-fg prose-pre:text-white [&_pre_code]:text-white [&_pre_code]:bg-transparent
          prose-img:rounded-[2px]
          prose-strong:text-fg
          prose-blockquote:border-accent
        ">
          <MDXRemote source={post.content} components={components} options={mdxOptions} />
        </article>
      </div>
    </div>
  )
}
