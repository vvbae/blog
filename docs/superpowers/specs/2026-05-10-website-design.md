# Personal Website Design Spec

**Date:** 2026-05-10
**Status:** Approved

---

## Overview

Portfolio + blog site for viviwei — an SDE pivoting into Robotics ML / Embodied AI. Primary goal: let a hiring manager see in 30 seconds what you've built and that it's real (video proof). Secondary: host the blog.

**Target audience:** Embodied AI hiring managers + robotics ML practitioners

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#f8f8f8` (off-white) |
| Foreground | `#0a0a0a` (near-black) |
| Accent | `#166534` (forest green) |
| Border | `#e5e5e5` |
| Muted text | `#888888` |
| Font — headings | Inter Black (900 weight), tight letter-spacing (`-0.05em`) |
| Font — body | Inter Regular (400), `1.6` line-height |
| Font — labels | Inter Medium (500), `0.12em` letter-spacing, uppercase |
| Border radius | `2px` (near-flat, intentional) |

All sourced from Google Fonts (Inter). No custom fonts to load.

---

## Layout Shell

**Fixed left sidebar** — present on every page, never scrolls.

```
┌─────────┬──────────────────────────────────┐
│ sidebar │  main content (scrollable)        │
│  90px   │                                   │
│         │                                   │
│ viviwei │                                   │
│         │                                   │
│ projects│                                   │
│ blog    │                                   │
│ about   │                                   │
│         │                                   │
│ gh  li  │                                   │
└─────────┴──────────────────────────────────┘
```

**Sidebar contents (top to bottom):**
- `viviwei` — logo/name, font-weight 900, links to `/`
- Nav links: `projects`, `blog`, `about` — active link in forest green, others muted
- Bottom: `gh` (GitHub) + `li` (LinkedIn) icon links

**Mobile:** sidebar collapses to a top bar with hamburger. Out of scope for MVP — build desktop-first, add mobile responsiveness in a second pass.

---

## Pages

### `/` — Home

**Hero section:**
```
[label]  SDE → ROBOTICS ML ENGINEER
[h1]     Building
         embodied AI
         systems.
[bar]    ━━━━  (forest green, 36px wide, 3px tall)
[sub]    First-principles experiments in robot manipulation and generalization.
[ctas]   [PROJECTS →]  [BLOG →]
```

- H1: 72px, weight 900, letter-spacing -0.05em, line-height 1.0
- CTA primary: `#0a0a0a` background, white text, 2px radius
- CTA secondary: `#0a0a0a` border, transparent background

**Project cards section** (below hero, same page):

Heading: `SELECTED WORK` — small label style

Two cards side by side, each card:
```
┌──────────────────────────┐
│  [video thumbnail / dark  │
│   bg with ▶ play button] │
│         100px tall        │
├──────────────────────────┤
│ Project Title             │
│ tag · tag · tag           │
│ [BLOG]  [GITHUB]          │
└──────────────────────────┘
```

- Thumbnail background: `#0a0a0a`, play button in forest green
- On hover: slight lift (`translateY(-2px)`), border color shifts to `#166534`
- Tags: small uppercase label, muted color
- Action links: BLOG in forest green bold, GITHUB in muted

**Initial projects:**

| # | Title | Tags | Links |
|---|-------|------|-------|
| 1 | Decomposition Learning | Diffusion Policy · ManiSkill3 · Negative result | Blog, GitHub |
| 2 | SO-101 Imitation Learning | LeRobot · Physical arm · Grasp task | Video, GitHub |

---

### `/projects` — Full project list

Same card grid as homepage. When more projects exist, this page shows all of them. For MVP with 2 projects, this page is nearly identical to the homepage project section — it's fine, it exists so the nav link goes somewhere meaningful.

---

### `/blog` — Blog list

Text-first. No thumbnails required.

```
WRITING

2026-05-10   I Tried to Make Robot Policies Generalizable. Here's What Broke.
             Contact-only Diffusion Policy for peg insertion. Negative result, full
             covariate shift diagnosis, and what I'd do differently.
             [READ →]

...
```

- Each entry: date (muted) + title (bold) + 2-line summary + green READ link
- Entries separated by a thin `#e5e5e5` rule
- No thumbnails — pure text, no visual pressure for future posts
- Sorted newest first

---

### `/blog/[slug]` — Individual post

Markdown rendered to HTML. Layout:

```
┌─────────┬────────────────────────────┐
│ sidebar │  [post title — large]       │
│         │  [date · tag · tag]         │
│         │  ━━━━ (green bar)           │
│         │                             │
│         │  [body text — 680px max]    │
│         │  [images inline]            │
│         │  [video embeds inline]      │
└─────────┴────────────────────────────┘
```

- Body max-width: `680px`
- Code blocks: `#0a0a0a` background, monospace, forest green for inline code
- Images: full width within content column, `border-radius: 2px`
- No table of contents for MVP

Initial posts:
- `en.md` → `/blog/decomposition-learning` (English)
- `zh.md` → separate Zhihu/WeChat publish (not hosted on the site for MVP)

---

### `/about` — Short bio

No sidebar nav change needed. Content:

```
ABOUT

Background: [N] years as SDE. Now focused on robotics ML and embodied AI.  ← fill in

Stack: Python · PyTorch · LeRobot · ManiSkill3 · Diffusion Policy

Currently learning: contact-rich manipulation · cross-embodiment transfer

→ LinkedIn  → GitHub  → Email
```

Short. LinkedIn has the full resume. This page just gives enough context.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | File-based routing, MDX support, Vercel native |
| Styling | Tailwind CSS v3 | Utility-first, no runtime overhead, fast iteration |
| Blog content | MDX files in `/content/blog/` | Markdown + JSX components, no CMS |
| Deployment | Vercel (free tier) | Zero-config for Next.js |
| Domain | viviweirobots.com (~$12/yr) | Configure DNS after first deploy |

---

## File Structure

```
website/
├── app/
│   ├── layout.tsx          ← shell: sidebar + main
│   ├── page.tsx            ← home: hero + project cards
│   ├── projects/
│   │   └── page.tsx        ← full project grid
│   ├── blog/
│   │   ├── page.tsx        ← blog list
│   │   └── [slug]/
│   │       └── page.tsx    ← individual post
│   └── about/
│       └── page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── ProjectCard.tsx
│   └── BlogList.tsx
├── content/
│   └── blog/
│       └── decomposition-learning.mdx   ← en.md adapted
├── public/
│   └── figures/            ← images copied from ~/viviwei/blog/figures/
├── lib/
│   └── posts.ts            ← MDX frontmatter parser
├── tailwind.config.ts
└── next.config.ts
```

---

## Content Data

Projects are defined in a static array in `lib/projects.ts` (no DB, no CMS):

```ts
export const projects = [
  {
    slug: "decomposition-learning",
    title: "Decomposition Learning",
    description: "Contact-only Diffusion Policy for peg insertion. Negative result + full covariate shift diagnosis.",
    tags: ["Diffusion Policy", "ManiSkill3", "Negative result"],
    videoYouTube: "YOUTUBE_ID",   // fill in after upload
    blogSlug: "decomposition-learning",
    github: "https://github.com/viviwei/decomp-learn",
  },
  {
    slug: "so101-imitation",
    title: "SO-101 Imitation Learning",
    description: "Grasp policy trained on a physical SO-101 arm using LeRobot.",
    tags: ["LeRobot", "Physical arm", "Grasp task"],
    videoYouTube: "YOUTUBE_ID",   // fill in after upload
    github: "https://github.com/viviwei/so101-imitation",
  },
]
```

---

## MVP Scope (what gets built now)

- [ ] Next.js + Tailwind scaffold with sidebar layout
- [ ] Home page: hero + 2 project cards
- [ ] Blog list page
- [ ] Blog post page (MDX rendering)
- [ ] About page
- [ ] `decomposition-learning.mdx` adapted from `en.md`
- [ ] Images from `~/viviwei/blog/figures/` copied to `public/`
- [ ] YouTube embed component (placeholder until video uploaded)
- [ ] Deploy to Vercel

## Out of Scope for MVP

- Mobile responsiveness (second pass)
- Dark mode
- Chinese blog hosted on site (Zhihu/WeChat for now)
- `/projects/[slug]` detail pages (blog post serves this purpose for now)
- Search, tags filtering, RSS feed
- Analytics
