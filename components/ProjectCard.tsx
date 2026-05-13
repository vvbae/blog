import Link from 'next/link'
import { Project } from '@/lib/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border border-border rounded-[2px] overflow-hidden transition-all hover:-translate-y-0.5 hover:border-accent group">
      <div className="bg-fg h-[120px] relative overflow-hidden">
        {project.localVideo ? (
          <video
            src={project.localVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : project.videoYouTubeId ? (
          <a
            href={`https://youtube.com/watch?v=${project.videoYouTubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
          >
            <PlayIcon />
          </a>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayIcon />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-black text-sm tracking-tight text-fg mb-1">{project.title}</h3>
        <p className="text-[11px] text-muted mb-3 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.map(tag => (
            <span key={tag} className="text-[9px] uppercase tracking-widest text-muted font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.blogSlug && (
            <Link
              href={`/blog/${project.blogSlug}`}
              className="text-[11px] font-bold text-accent hover:underline uppercase tracking-wide"
            >
              blog
            </Link>
          )}
          {project.videoYouTubeId && (
            <a
              href={`https://youtube.com/watch?v=${project.videoYouTubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-accent hover:underline uppercase tracking-wide"
            >
              video
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted hover:text-fg uppercase tracking-wide"
            >
              github
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <div className="w-10 h-10 border-2 border-accent rounded-full flex items-center justify-center">
      <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-accent ml-1" />
    </div>
  )
}
