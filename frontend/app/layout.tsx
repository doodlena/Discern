import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DISCERN - AI-Powered Credibility Scoring',
  description: 'Know what to trust. AI-powered credibility analysis for online content and documents.',
  keywords: ['credibility', 'fact-checking', 'AI', 'misinformation', 'transparency'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">D</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">DISCERN</span>
                </a>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                  Home
                </a>
                <a href="/analyze" className="text-gray-700 hover:text-gray-900 font-medium">
                  Analyze
                </a>
                <a href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
                  About
                </a>
                <a href="/admin" className="text-gray-500 hover:text-gray-700 text-sm">
                  Admin
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                <strong>DISCERN</strong> - Built for the Presidential AI Challenge
              </p>
              <p className="text-sm">
                AI-assisted credibility analysis. Always verify important information independently.
              </p>
              <p className="text-xs mt-4 text-gray-500">
                Powered by Anthropic Claude | Designed for transparency and trust
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
