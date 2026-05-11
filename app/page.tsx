import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/lib/projects'

export default function HomePage() {
  return (
    <div className="px-12 py-16 max-w-4xl">
      {/* Hero */}
      <div className="mb-20">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-5">
          SDE → Robotics ML Engineer
        </p>
        <h1 className="text-[72px] font-black leading-none tracking-[-0.05em] text-fg mb-4">
          Building<br />embodied AI<br />systems.
        </h1>
        <div className="w-9 h-[3px] bg-accent mb-5" />
        <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm">
          First-principles experiments in robot manipulation and generalization.
        </p>
        <div className="flex gap-3">
          <Link
            href="/projects"
            className="bg-fg text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-[2px] hover:opacity-80 transition-opacity"
          >
            Projects →
          </Link>
          <Link
            href="/blog"
            className="border border-fg text-fg text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-[2px] hover:bg-fg hover:text-white transition-colors"
          >
            Blog →
          </Link>
        </div>
      </div>

      {/* Selected Work */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-6">
          Selected Work
        </p>
        <div className="grid grid-cols-2 gap-5">
          {projects.map(p => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
