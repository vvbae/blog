import type { Metadata } from 'next'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/lib/projects'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage() {
  return (
    <div className="px-12 py-16 max-w-4xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-8">
        Projects
      </p>
      <div className="grid grid-cols-2 gap-5">
        {projects.map(p => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  )
}
