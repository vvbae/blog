# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a minimalist portfolio + blog site at `~/viviwei/website/` using Next.js 14, Tailwind CSS, fixed left sidebar, forest green accent, MDX blog posts.

**Architecture:** Next.js 14 App Router with a sticky left sidebar shell. Projects are defined in a static TypeScript array. Blog posts are MDX files with gray-matter frontmatter. All pages are server components by default; sidebar uses a client component for active link detection.

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS v3 · @tailwindcss/typography · next-mdx-remote · gray-matter · Vercel

---

## File Map

```
~/viviwei/website/
├── app/
│   ├── layout.tsx                    ← root shell: html + body + Sidebar + main
│   ├── globals.css                   ← Tailwind directives + Google Fonts import
│   ├── page.tsx                      ← home: hero + project cards
│   ├── projects/page.tsx             ← full project grid
│   ├── blog/page.tsx                 ← blog list (title + date + summary)
│   ├── blog/[slug]/page.tsx          ← individual MDX post
│   └── about/page.tsx               ← short bio
├── components/
│   ├── Sidebar.tsx                   ← sticky left sidebar with active-link detection
│   ├── ProjectCard.tsx               ← thumbnail + title + tags + links
│   └── YouTubeEmbed.tsx             ← iframe embed, accepts videoId prop
├── content/blog/
│   └── decomposition-learning.mdx   ← adapted from ~/viviwei/blog/posts/en.md
├── lib/
│   ├── projects.ts                   ← Project interface + static projects array
│   └── posts.ts                      ← getAllPosts() + getPost(slug) using gray-matter
├── public/figures/                   ← images copied from ~/viviwei/blog/figures/
├── tailwind.config.ts
└── next.config.mjs
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `~/viviwei/website/` (entire project)

- [ ] **Step 1: Run create-next-app**

```bash
cd ~/viviwei
npx create-next-app@14 website \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-git
```

When prompted for "Would you like to use Turbopack?": select **No**.

- [ ] **Step 2: Install additional dependencies**

```bash
cd ~/viviwei/website
npm install next-mdx-remote gray-matter @tailwindcss/typography
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -o '<title>[^<]*' | head -1
# Expected: <title>Create Next App  (or similar)
kill %1
```

- [ ] **Step 4: Commit scaffold**

```bash
cd ~/viviwei/website
git init
git add .
git commit -m "chore: scaffold Next.js 14 project"
```

---

## Task 2: Design system — Tailwind config + globals

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        bg:     '#f8f8f8',
        fg:     '#0a0a0a',
        accent: '#166534',
        border: '#e5e5e5',
        muted:  '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
```

- [ ] **Step 2: Replace app/globals.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,900;1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-fg font-sans antialiased;
  }
  ::selection {
    @apply bg-accent text-white;
  }
}
```

- [ ] **Step 3: Verify build compiles**

```bash
cd ~/viviwei/website && npm run build 2>&1 | tail -5
# Expected: ✓ Compiled successfully  (no type errors)
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add design system tokens and Inter font"
```

---

## Task 3: Sidebar component + root layout

**Files:**
- Create: `components/Sidebar.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/Sidebar.tsx**

```tsx
// components/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/projects', label: 'projects' },
  { href: '/blog',     label: 'blog'     },
  { href: '/about',    label: 'about'    },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[90px] shrink-0 border-r border-border flex flex-col justify-between py-6 px-4 sticky top-0 h-screen">
      <div>
        <Link
          href="/"
          className="block font-black text-sm tracking-tight mb-8 hover:text-accent transition-colors"
        >
          viviwei
        </Link>
        <nav className="flex flex-col gap-3">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[11px] transition-colors ${
                pathname?.startsWith(href)
                  ? 'text-accent font-bold'
                  : 'text-muted hover:text-fg'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex gap-3">
        <a
          href="https://github.com/viviwei"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted hover:text-fg transition-colors"
        >
          gh
        </a>
        <a
          href="https://linkedin.com/in/viviwei"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted hover:text-fg transition-colors"
        >
          li
        </a>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Replace app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: { default: 'viviwei', template: '%s · viviwei' },
  description: 'SDE → Robotics ML Engineer. Building embodied AI systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Delete the default Next.js placeholder page content**

Replace `app/page.tsx` with a temporary placeholder so the build passes:

```tsx
// app/page.tsx  (temporary — replaced in Task 5)
export default function HomePage() {
  return <div className="p-8 text-fg">home</div>
}
```

- [ ] **Step 4: Verify layout renders**

```bash
cd ~/viviwei/website
npm run dev &
sleep 6
curl -s http://localhost:3000 | grep -o 'viviwei' | head -1
# Expected: viviwei
kill %1
```

- [ ] **Step 5: Commit**

```bash
git add components/Sidebar.tsx app/layout.tsx app/page.tsx
git commit -m "feat: add sidebar shell and root layout"
```

---

## Task 4: Project data + ProjectCard component

**Files:**
- Create: `lib/projects.ts`
- Create: `components/ProjectCard.tsx`
- Create: `components/YouTubeEmbed.tsx`

- [ ] **Step 1: Create lib/projects.ts**

```ts
// lib/projects.ts
export interface Project {
  slug:          string
  title:         string
  description:   string
  tags:          string[]
  videoYouTubeId: string | null   // set after uploading to YouTube
  blogSlug:      string | null
  github:        string | null
}

export const projects: Project[] = [
  {
    slug:          'decomposition-learning',
    title:         'Decomposition Learning',
    description:   'Contact-only Diffusion Policy for peg insertion. Negative result + full covariate shift diagnosis.',
    tags:          ['Diffusion Policy', 'ManiSkill3', 'Negative result'],
    videoYouTubeId: null,
    blogSlug:      'decomposition-learning',
    github:        'https://github.com/viviwei/decomp-learn',
  },
  {
    slug:          'so101-imitation',
    title:         'SO-101 Imitation Learning',
    description:   'Grasp policy trained on a physical SO-101 arm using LeRobot.',
    tags:          ['LeRobot', 'Physical arm', 'Grasp task'],
    videoYouTubeId: null,
    blogSlug:      null,
    github:        null,
  },
]
```

- [ ] **Step 2: Create components/YouTubeEmbed.tsx**

```tsx
// components/YouTubeEmbed.tsx
export default function YouTubeEmbed({ videoId, title = 'Video' }: { videoId: string; title?: string }) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-[2px]"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
```

- [ ] **Step 3: Create components/ProjectCard.tsx**

```tsx
// components/ProjectCard.tsx
import Link from 'next/link'
import type { Project } from '@/lib/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border border-border rounded-[2px] overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:border-accent group">
      {/* Thumbnail */}
      <div className="bg-fg h-[100px] flex items-center justify-center overflow-hidden">
        {project.videoYouTubeId ? (
          <img
            src={`https://img.youtube.com/vi/${project.videoYouTubeId}/mqdefault.jpg`}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          // Play button placeholder when no video yet
          <div className="w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-accent ml-0.5" />
          </div>
        )}
      </div>
      {/* Body */}
      <div className="p-3">
        <h3 className="text-[13px] font-black tracking-tight text-fg mb-1 leading-snug">
          {project.title}
        </h3>
        <p className="text-[10px] text-muted leading-relaxed mb-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mb-3">
          {project.tags.map(tag => (
            <span key={tag} className="text-[8px] uppercase tracking-wider text-muted">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          {project.blogSlug && (
            <Link
              href={`/blog/${project.blogSlug}`}
              className="text-[10px] text-accent font-bold hover:underline"
            >
              BLOG →
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted hover:text-fg transition-colors"
            >
              GITHUB →
            </a>
          )}
          {project.videoYouTubeId && (
            <a
              href={`https://youtube.com/watch?v=${project.videoYouTubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted hover:text-fg transition-colors"
            >
              VIDEO →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd ~/viviwei/website && npx tsc --noEmit 2>&1 | head -20
# Expected: no output (zero type errors)
```

- [ ] **Step 5: Commit**

```bash
git add lib/projects.ts components/ProjectCard.tsx components/YouTubeEmbed.tsx
git commit -m "feat: add project data model and ProjectCard + YouTubeEmbed components"
```

---

## Task 5: Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
// app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'

export const metadata: Metadata = { title: 'viviwei' }

export default function HomePage() {
  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      {/* Hero */}
      <section className="mb-16">
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-3">
          SDE → Robotics ML Engineer
        </p>
        <h1 className="text-[clamp(48px,8vw,72px)] font-black leading-none tracking-[-0.05em] text-fg mb-4">
          Building<br />
          embodied AI<br />
          systems.
        </h1>
        <div className="w-9 h-[3px] bg-accent mb-5" />
        <p className="text-sm text-muted max-w-sm leading-relaxed mb-8">
          First-principles experiments in robot manipulation and generalization.
        </p>
        <div className="flex gap-3">
          <Link
            href="/projects"
            className="bg-fg text-bg text-[11px] font-bold px-4 py-2.5 rounded-[2px] hover:bg-accent transition-colors"
          >
            PROJECTS →
          </Link>
          <Link
            href="/blog"
            className="border-[1.5px] border-fg text-fg text-[11px] font-bold px-4 py-2.5 rounded-[2px] hover:border-accent hover:text-accent transition-colors"
          >
            BLOG →
          </Link>
        </div>
      </section>

      {/* Selected work */}
      <section>
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-4">
          Selected Work
        </p>
        <div className="grid grid-cols-2 gap-4">
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify page builds**

```bash
cd ~/viviwei/website && npm run build 2>&1 | grep -E '(error|✓|○|●)' | head -20
# Expected: ✓ Compiled, routes listed without error
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: home page — hero + project cards"
```

---

## Task 6: Projects page + About page

**Files:**
- Create: `app/projects/page.tsx`
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create app/projects/page.tsx**

```tsx
// app/projects/page.tsx
import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Work</p>
      <h1 className="text-4xl font-black tracking-tight mb-8">Projects</h1>
      <div className="grid grid-cols-2 gap-4">
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/about/page.tsx**

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="p-8 lg:p-12 max-w-lg">
      <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Background</p>
      <h1 className="text-4xl font-black tracking-tight mb-8">About</h1>

      <div className="space-y-6 text-sm text-fg leading-relaxed">
        <p>
          Software engineer turned robotics ML researcher.
          {/* ← fill in years */} years in backend systems, now focused on embodied AI —
          specifically making robot manipulation policies that generalize.
        </p>

        <div>
          <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Stack</p>
          <p className="text-muted">
            Python · PyTorch · LeRobot · ManiSkill3 · Diffusion Policy · ROS2
          </p>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Currently learning</p>
          <p className="text-muted">
            Contact-rich manipulation · Cross-embodiment transfer · DAgger
          </p>
        </div>

        <div className="flex gap-6 pt-2">
          <a
            href="https://linkedin.com/in/viviwei"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-accent hover:underline"
          >
            LinkedIn →
          </a>
          <a
            href="https://github.com/viviwei"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-accent hover:underline"
          >
            GitHub →
          </a>
          <a
            href="mailto:polarsatellitest@gmail.com"
            className="text-[11px] font-bold text-accent hover:underline"
          >
            Email →
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
cd ~/viviwei/website && npm run build 2>&1 | grep -E '(error|✓)' | head -5
# Expected: ✓ Compiled successfully
```

- [ ] **Step 4: Commit**

```bash
git add app/projects/page.tsx app/about/page.tsx
git commit -m "feat: projects page and about page"
```

---

## Task 7: MDX blog infrastructure

**Files:**
- Create: `lib/posts.ts`
- Modify: `next.config.mjs`
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create lib/posts.ts**

```ts
// lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export interface PostFrontmatter {
  title:   string
  date:    string
  summary: string
  tags?:   string[]
}

export interface Post {
  slug:        string
  frontmatter: PostFrontmatter
  content:     string
}

export function getAllPosts(): Omit<Post, 'content'>[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw  = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
      const { data } = matter(raw)
      return { slug, frontmatter: data as PostFrontmatter }
    })
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export function getPost(slug: string): Post {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf-8')
  const { data, content } = matter(raw)
  return { slug, frontmatter: data as PostFrontmatter, content }
}
```

- [ ] **Step 2: Update next.config.mjs to allow MDX**

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {}
export default nextConfig
```

(next-mdx-remote handles MDX at runtime — no special Next.js config needed.)

- [ ] **Step 3: Create app/blog/page.tsx**

```tsx
// app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = { title: 'Blog' }

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Writing</p>
      <h1 className="text-4xl font-black tracking-tight mb-10">Blog</h1>

      {posts.length === 0 && (
        <p className="text-sm text-muted">No posts yet.</p>
      )}

      <div className="divide-y divide-border">
        {posts.map(post => (
          <article key={post.slug} className="py-6">
            <p className="text-[10px] tracking-wider uppercase text-muted mb-1">
              {post.frontmatter.date}
            </p>
            <h2 className="text-base font-black tracking-tight text-fg mb-2 leading-snug">
              {post.frontmatter.title}
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              {post.frontmatter.summary}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-[10px] font-bold text-accent hover:underline"
            >
              READ →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create app/blog/[slug]/page.tsx**

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPost } from '@/lib/posts'
import YouTubeEmbed from '@/components/YouTubeEmbed'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = getPost(params.slug)
  return { title: post.frontmatter.title }
}

const mdxComponents = { YouTubeEmbed }

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  return (
    <article className="p-8 lg:p-12">
      <header className="mb-10 max-w-[680px]">
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">
          {post.frontmatter.date}
        </p>
        <h1 className="text-3xl font-black tracking-tight leading-tight mb-4">
          {post.frontmatter.title}
        </h1>
        <div className="w-9 h-[3px] bg-accent" />
      </header>
      <div className="prose prose-sm max-w-[680px] prose-headings:font-black prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent prose-code:bg-fg/5 prose-img:rounded-[2px]">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  )
}
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd ~/viviwei/website && npx tsc --noEmit 2>&1 | head -10
# Expected: no output
```

- [ ] **Step 6: Commit**

```bash
git add lib/posts.ts next.config.mjs app/blog/page.tsx app/blog/[slug]/page.tsx
git commit -m "feat: blog list and MDX post pages"
```

---

## Task 8: Blog content — decomposition-learning.mdx

**Files:**
- Create: `content/blog/decomposition-learning.mdx`

- [ ] **Step 1: Create content/blog/ directory and MDX file**

Adapt `~/viviwei/blog/posts/en.md` to MDX with frontmatter. The YouTube embed comments become `<YouTubeEmbed>` component calls (with placeholder IDs until you upload the videos).

```bash
mkdir -p ~/viviwei/website/content/blog
```

- [ ] **Step 2: Write content/blog/decomposition-learning.mdx**

```mdx
---
title: "I Tried to Make Robot Policies Generalizable. Here's What Broke."
date: "2026-05-10"
summary: "Contact-only Diffusion Policy for peg insertion. Negative result, full covariate shift diagnosis, and what I'd do differently."
tags: ["Diffusion Policy", "ManiSkill3", "Robotics", "Negative result"]
---

I'm a software engineer. I've spent years building backend systems, not training neural networks. But I'd been watching the embodied AI space with growing interest, and at some point I decided the only way to actually understand it was to run an experiment myself.

This is the story of that experiment. It produced a negative result — my method didn't beat the baseline. But I learned more from the failure than I would have from a clean win, and I think the failure mode is interesting enough to write up.

The task: peg-in-hole insertion with a robot arm. The hypothesis: we can beat end-to-end imitation learning by decomposing the task. The outcome: we couldn't. Here's exactly why.

{/* Replace PLACEHOLDER_SUCCESS with your YouTube video ID after upload */}
<YouTubeEmbed videoId="PLACEHOLDER_SUCCESS" title="Successful peg insertion episode" />

## The Idea

Most robot manipulation policies are trained end-to-end: show the robot a thousand expert demonstrations, train a neural network to map observations to actions, done. This works, but it has a structural problem.

**The policy learns joint angles.** Not manipulation strategies — joint angles. Train on a Franka Panda arm, and the policy knows nothing about a UR5, even if the task is identical. The reason is that the observation space includes the robot's own joint configuration, which is completely different between robot models. You've taught the policy *how this specific robot moves*, not *how to insert a peg*.

This struck me as a strange thing to optimize for. If I were a human learning to insert a peg, I wouldn't be memorizing the angle of my elbow joint — I'd be learning how to react to the peg's position relative to the hole. The robot-specific kinematics would be handled by my motor cortex, invisibly, and I wouldn't need to relearn the task to use a different hand.

So the idea was: what if we decompose the task?

A peg-in-hole task has two natural phases:

```
Phase 1 — Geometric:   move the arm until the peg is near the hole opening
Phase 2 — Contact:     align and insert under positional uncertainty
```

Phase 1 is purely geometric. Given the peg and hole positions, a motion planner can solve it analytically. No learning needed, and the solution is robot-agnostic.

Phase 2 is where things get hard. Contact physics — friction, compliance, misalignment — can't be modeled cleanly. You need to learn it from data.

The decomposed approach: replace Phase 1 with a motion planner, and only train a learned policy for Phase 2. Critically, make the policy input **robot-agnostic**: instead of joint angles, use the relative position of the tool center point (TCP) to the hole.

Two claims followed naturally:

1. **Data efficiency**: since the policy only learns Phase 2, it should reach the same success rate with fewer demonstrations.
2. **Cross-embodiment**: since the input doesn't depend on robot kinematics, a policy trained on a Panda arm should transfer zero-shot to a different arm.

## Building the Experiment

The setup: **PegInsertionSide-v1** in ManiSkill3, a simulated peg-in-hole task with a Franka Panda robot. For the learned policy I used Diffusion Policy via the LeRobot framework.

I collected 996 expert demonstrations using ManiSkill3's built-in motion planner. The contact split was defined as the first frame where contact force exceeded 0.1N. On average, contact onset happened at step ~29 out of ~150 total steps — about 20% of each trajectory. The other 80% was the geometric approach phase.

**Two mistakes I made early on:**

*Wrong control mode.* I initially trained with absolute joint position control. Switching to delta control improved the baseline significantly.

*No train/test split.* I trained on all 996 demos and evaluated on the same distribution. Fixed: 800 demos for training, 200 held-out test demos. All numbers in this post use the held-out test set.

## The Numbers

**E2E baseline**: 800 demos, 200k training steps, 200 held-out episodes. **65.5% success rate.**

**Contact policy sweep:**

| Demos | Success rate |
|-------|-------------|
| 50    | 36.0%       |
| 100   | 42.5%       |
| 200   | 40.0%       |
| 500   | 37.0%       |
| 796   | 49.5%       |

The best contact policy reached **49.5%** — 16 points below E2E. The data efficiency claim is already in trouble.

More puzzling: scaling up training doesn't help. The learning curve for the 796-demo contact policy, from 1k to 100k steps:

![Learning curve — flat from 1k to 100k steps](/figures/learning_curve.png)

The success rate bounces randomly between 39–56% with no trend. Something more fundamental is wrong.

## The Diagnosis

{/* Replace PLACEHOLDER_FAILURE with your YouTube video ID after upload */}
<YouTubeEmbed videoId="PLACEHOLDER_FAILURE" title="Failed peg insertion episode" />

I ran a failure diagnostic: record peg-tip position relative to the hole throughout each episode, separate successes from failures, and plot the trajectories.

![Insertion depth over time: successes vs failures](/figures/failure_analysis/insertion_depth.png)

*Successful episodes insert the peg steadily. Failing episodes never reach the hole entrance at all.*

![Lateral error over time](/figures/failure_analysis/lateral_error.png)

*Failing episodes drift 3–4× the hole radius laterally from the first step.*

![Final peg position scatter (y-z plane)](/figures/failure_analysis/final_lateral.png)

*Successes cluster near the hole center. Failures are scattered — mean lateral error 54.7mm, hole radius ~15mm.*

**The failure mode is binary.** No near-misses. Episodes either succeed completely or fail completely.

This is **covariate shift**. The 996 training demos were generated by a scripted motion planner that follows a fixed approach path. Every demo reaches contact onset from almost the same direction, angle, and velocity. The **distribution of contact onset states in the training data is narrow**.

At evaluation time, small variations in initial configuration lead the planner down a slightly different path, arriving at contact onset from a different angle. These states are **outside the training distribution**. The policy has never seen them and outputs garbage.

This is not a model capacity problem. Training loss was fine, architecture was standard. The failure lives entirely in the data distribution.

![Sweep comparison: contact policy vs E2E baseline](/figures/sweep_comparison.png)

## The Fix That Didn't Work

**Data augmentation at contact onset.** For each demo, take the contact onset frame, apply a random displacement (±3mm, ±7mm, ±15mm in y/z), let the scripted planner recover, keep successful trajectories.

This produced **4539 trajectories** from 996 originals. Result: **41.0%** — worse than unaugmented (49.5%).

Why: the scripted planner's own recovery is stereotyped. Adding offset copies of the same correction pattern doesn't add real behavioral diversity. The ceiling was the scripted planner's behavioral diversity, which is low.

## What I Learned

**Technically:** Covariate shift in imitation learning is invisible until you run the experiment. Every metric looked fine — training loss converged, architecture was standard. The failure lived entirely in the data distribution.

The "contact segment" from scripted demos is not what I imagined. 29 steps of near-optimal straight-line correction from the same starting configuration isn't enough signal to train a robust policy on.

**On research process:** Run the diagnostic early. I spent time tuning hyperparameters before I ran the failure visualization. The visualization took an hour to write and immediately revealed the root cause.

**As an outsider:** The gap between "I understand this conceptually" and "I can run this experiment" is large. I spent more time on experimental hygiene — test splits, seed handling, control modes — than on the ML itself.

## What Would Actually Work

**DAgger** is the principled fix. Roll out the learned policy, collect states where it fails, get expert actions, add to training. Directly addresses covariate shift.

**Longer contact tasks.** Peg-in-hole's contact segment is ~29 steps from a narrow distribution. Tasks with richer contact dynamics (PlugCharger-v1) would give the policy more to learn from.

**Cross-embodiment transfer** remains an open question. The relative-coordinate design is sound in principle — but needs to work on one robot first.

---

Code and experiment logs: [GitHub](https://github.com/viviwei/decomp-learn)
```

- [ ] **Step 3: Verify MDX parses and build succeeds**

```bash
cd ~/viviwei/website && npm run build 2>&1 | grep -E '(error|✓|/blog)' | head -20
# Expected: ✓ and route /blog/decomposition-learning listed
```

- [ ] **Step 4: Commit**

```bash
git add content/blog/decomposition-learning.mdx
git commit -m "content: add decomposition-learning blog post"
```

---

## Task 9: Copy image assets

**Files:**
- Create: `public/figures/` (copied from `~/viviwei/blog/figures/`)

- [ ] **Step 1: Copy figures**

```bash
cp -r ~/viviwei/blog/figures/failure_analysis ~/viviwei/website/public/figures/failure_analysis
cp ~/viviwei/blog/figures/learning_curve.png ~/viviwei/website/public/figures/
cp ~/viviwei/blog/figures/sweep_comparison.png ~/viviwei/website/public/figures/
```

- [ ] **Step 2: Verify files exist**

```bash
ls ~/viviwei/website/public/figures/
ls ~/viviwei/website/public/figures/failure_analysis/
# Expected: learning_curve.png  sweep_comparison.png  failure_analysis/
# failure_analysis/: insertion_depth.png  lateral_error.png  final_lateral.png
```

- [ ] **Step 3: Verify images load in built site**

```bash
cd ~/viviwei/website && npm run build 2>&1 | grep error | head -5
# Expected: no errors
```

- [ ] **Step 4: Commit**

```bash
git add public/figures/
git commit -m "assets: add figures for blog post"
```

---

## Task 10: Full build verification + Vercel deploy

**Files:** none new

- [ ] **Step 1: Final clean build**

```bash
cd ~/viviwei/website && npm run build 2>&1 | tail -15
# Expected: ✓ Compiled successfully, all routes listed without errors
```

- [ ] **Step 2: Smoke test local production server**

```bash
cd ~/viviwei/website
npm run start &
sleep 4
for path in "/" "/projects" "/blog" "/about" "/blog/decomposition-learning"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$path)
  echo "$path → $status"
done
kill %1
# Expected: all routes → 200
```

- [ ] **Step 3: Install Vercel CLI and deploy**

```bash
cd ~/viviwei/website
npm install -g vercel
vercel --yes
# Follow prompts: link to your Vercel account, set project name "viviwei-website"
# Expected: deployment URL printed
```

- [ ] **Step 4: Verify deployed site**

```bash
# Replace <DEPLOYMENT_URL> with the URL printed by vercel
curl -s -o /dev/null -w "%{http_code}" https://<DEPLOYMENT_URL>
# Expected: 200
```

- [ ] **Step 5: Final commit**

```bash
cd ~/viviwei/website
git add .
git commit -m "chore: production build verified and deployed to Vercel"
```

---

## Post-deploy checklist (manual)

After the site is live:

- [ ] Upload success video to YouTube → copy video ID → update `projects[0].videoYouTubeId` in `lib/projects.ts` → update `PLACEHOLDER_SUCCESS` in `decomposition-learning.mdx`
- [ ] Upload failure video to YouTube → update `PLACEHOLDER_FAILURE` in `decomposition-learning.mdx`
- [ ] Fill in years of SDE experience in `app/about/page.tsx`
- [ ] Update GitHub URL (`viviwei/decomp-learn`) if actual repo name differs
- [ ] Update LinkedIn URL (`linkedin.com/in/viviwei`) if different
- [ ] Register `viviweirobots.com` and configure DNS in Vercel dashboard
- [ ] Publish `zh.md` to Zhihu + WeChat (manual, not hosted on this site)
