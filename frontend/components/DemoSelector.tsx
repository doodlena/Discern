'use client'

import { useEffect, useState } from 'react'
import { getDemoContent } from '@/lib/api'
import { DemoArticle } from '@discern/shared/types'

interface Props {
  onSelect: (demo: DemoArticle) => void
}

export default function DemoSelector({ onSelect }: Props) {
  const [demos, setDemos] = useState<DemoArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDemos = async () => {
      try {
        const data = await getDemoContent()
        setDemos(data)
      } catch (error) {
        console.error('Failed to load demo content', error)
      } finally {
        setLoading(false)
      }
    }

    loadDemos()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
          <p className="text-gray-600">Loading demo content...</p>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'science':
        return 'bg-purple-100 text-purple-800'
      case 'news':
        return 'bg-blue-100 text-blue-800'
      case 'misinformation':
        return 'bg-red-100 text-red-800'
      case 'opinion':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Select a Demo Article
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => onSelect(demo)}
              className="text-left p-5 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-semibold text-gray-900 flex-1">
                  {demo.title}
                </h4>
                <span className={`font-bold ${getScoreColor(demo.expectedScore)}`}>
                  {demo.expectedScore}
                </span>
              </div>

              <span
                className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(
                  demo.category
                )}`}
              >
                {demo.category}
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Demo mode uses pre-cached results for instant analysis
        </p>
      </div>
    </div>
  )
}
