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
          href="https://github.com/vvbae"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted hover:text-fg transition-colors"
        >
          gh
        </a>
        <a
          href="https://linkedin.com/in/vivi-wei-zw"
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
