import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: { default: 'viviwei', template: '%s · viviwei' },
  description: 'Creating embodied AI from zero.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
