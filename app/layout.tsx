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
