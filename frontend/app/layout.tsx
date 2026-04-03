import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DISCERN - Credibility Analysis',
  description: 'Advanced credibility analysis that reveals bias, verifies sources, and assesses evidence quality.',
  keywords: ['credibility', 'fact-checking', 'transparency', 'misinformation', 'AI analysis'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/90 border-b border-stone-200">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="text-editorial text-xl font-normal text-stone-950 tracking-tight">DISCERN</span>
              </a>

              {/* Navigation Links */}
              <div className="flex items-center gap-8">
                <a
                  href="/"
                  className="text-ui text-sm font-medium text-stone-700 hover:text-stone-950 transition-refined"
                >
                  Home
                </a>
                <a
                  href="/analyze"
                  className="text-ui text-sm font-medium text-stone-700 hover:text-stone-950 transition-refined"
                >
                  Analyze
                </a>
                <a
                  href="/about"
                  className="text-ui text-sm font-medium text-stone-700 hover:text-stone-950 transition-refined"
                >
                  About
                </a>
                <a
                  href="/admin"
                  className="text-ui text-sm font-medium text-stone-700 hover:text-stone-950 transition-refined"
                >
                  Statistics
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 py-20">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-stone-950 flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <span className="text-editorial text-3xl font-normal text-stone-950">DISCERN</span>
              </div>

              <p className="text-ui text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Advanced credibility analysis powered by Anthropic Claude Sonnet 4.6.
                Built for transparency, designed for trust.
              </p>

              <div className="pt-8 border-t border-stone-200 mt-10">
                <p className="text-ui text-xs text-stone-500">
                  Presidential AI Challenge 2024 • Always verify important information independently
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
