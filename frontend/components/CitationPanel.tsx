'use client'

import { Citation } from '@discern/shared/types'

interface Props {
  citations: Citation[]
}

export default function CitationPanel({ citations }: Props) {
  const getReliabilityColor = (reliability: string) => {
    const colors = {
      high: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      medium: 'bg-amber-50 text-amber-800 border-amber-200',
      low: 'bg-red-50 text-red-800 border-red-200',
    }
    return colors[reliability as keyof typeof colors] || colors.medium
  }

  return (
    <div className="space-y-6">
      {citations.map((citation, index) => (
        <div
          key={index}
          className="bg-stone-50 rounded-xl p-6 border-refined hover:shadow-refined transition-refined-slow"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <h4 className="text-ui text-base font-semibold text-stone-950 flex-1">{citation.claim}</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getReliabilityColor(
                  citation.reliability
                )}`}
              >
                {citation.reliability} reliability
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  citation.supports
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {citation.supports ? 'Supports' : 'Contradicts'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-ui text-xs font-semibold text-stone-500 uppercase tracking-wide min-w-[80px] mt-0.5">
                Source
              </span>
              <p className="text-ui text-sm text-stone-700 flex-1">{citation.source}</p>
            </div>

            {citation.reliabilityReason && (
              <div className="flex items-start gap-3">
                <span className="text-ui text-xs font-semibold text-stone-500 uppercase tracking-wide min-w-[80px] mt-0.5">
                  Reliability
                </span>
                <p className="text-ui text-sm text-stone-700 flex-1 bg-white p-4 rounded-lg border-refined">
                  {citation.reliabilityReason}
                </p>
              </div>
            )}

            {citation.supportsReason && (
              <div className="flex items-start gap-3">
                <span className="text-ui text-xs font-semibold text-stone-500 uppercase tracking-wide min-w-[80px] mt-0.5">
                  {citation.supports ? 'Support' : 'Contradiction'}
                </span>
                <p className="text-ui text-sm text-stone-700 flex-1 bg-white p-4 rounded-lg border-refined">
                  {citation.supportsReason}
                </p>
              </div>
            )}

            {citation.excerpt && (
              <div className="flex items-start gap-3">
                <span className="text-ui text-xs font-semibold text-stone-500 uppercase tracking-wide min-w-[80px] mt-0.5">
                  Excerpt
                </span>
                <blockquote className="text-ui text-sm text-stone-600 italic flex-1 bg-white p-4 rounded-lg border-l-4 border-stone-300">
                  "{citation.excerpt}"
                </blockquote>
              </div>
            )}

            {citation.url && (
              <div className="flex items-start gap-3">
                <span className="text-ui text-xs font-semibold text-stone-500 uppercase tracking-wide min-w-[80px] mt-0.5">
                  Link
                </span>
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ui text-sm text-stone-950 hover:text-stone-700 underline decoration-stone-300 hover:decoration-stone-500 transition-refined inline-flex items-center gap-1.5"
                >
                  View source
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
