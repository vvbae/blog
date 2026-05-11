import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="px-12 py-16 max-w-2xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-10">
        About
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <p className="text-fg">
          Software engineer turned robotics ML researcher. Years of backend systems
          work, now focused on embodied AI and robot manipulation.
        </p>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-2">Stack</p>
          <p className="text-fg">Python · PyTorch · LeRobot · ManiSkill3 · Diffusion Policy</p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-2">Currently Learning</p>
          <p className="text-fg">Contact-rich manipulation · Cross-embodiment transfer</p>
        </div>

        <div className="flex gap-6 pt-2">
          <a
            href="https://linkedin.com/in/viviwei"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-bold text-sm hover:underline"
          >
            → LinkedIn
          </a>
          <a
            href="https://github.com/viviwei"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-bold text-sm hover:underline"
          >
            → GitHub
          </a>
          <a
            href="mailto:polarsatellitest@gmail.com"
            className="text-accent font-bold text-sm hover:underline"
          >
            → Email
          </a>
        </div>
      </div>
    </div>
  )
}
