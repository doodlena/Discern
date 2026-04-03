'use client'

import { Citation } from '@discern/shared/types'

interface Props {
  citations: Citation[]
}

export default function CitationPanel({ citations }: Props) {
  const getReliabilityBadge = (reliability: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-red-100 text-red-800 border-red-300',
    }
    return colors[reliability as keyof typeof colors] || colors.medium
  }

  return (
    <div className="space-y-4">
      {citations.map((citation, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <h4 className="font-semibold text-gray-900 flex-1">{citation.claim}</h4>
            <div className="flex gap-2">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium border ${getReliabilityBadge(
                  citation.reliability
                )}`}
              >
                {citation.reliability} reliability
              </span>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  citation.supports
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {citation.supports ? '✓ Supports' : '✗ Contradicts'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              <strong>Source:</strong> {citation.source}
            </p>

            {citation.reliabilityReason && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>Reliability:</strong> {citation.reliabilityReason}
              </p>
            )}

            {citation.supportsReason && (
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <strong>{citation.supports ? 'Why it supports:' : 'Why it contradicts:'}</strong> {citation.supportsReason}
              </p>
            )}

            {citation.excerpt && (
              <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                "{citation.excerpt}"
              </p>
            )}

            {citation.url && (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                View source →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
