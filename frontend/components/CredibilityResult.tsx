'use client'

import { AnalysisResult } from '@discern/shared/types'
import CredibilityMeter from './CredibilityMeter'
import FactorsChart from './FactorsChart'
import CitationPanel from './CitationPanel'

interface Props {
  result: AnalysisResult
  onAnalyzeNew: () => void
}

export default function CredibilityResult({ result, onAnalyzeNew }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800',
    }
    return colors[confidence as keyof typeof colors] || colors.medium
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analysis Complete</h2>
          <p className="text-gray-600 mt-1">
            Credibility assessment with AI-powered analysis
          </p>
        </div>
        <button
          onClick={onAnalyzeNew}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
        >
          Analyze New Content
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Credibility Score
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceBadge(
                result.confidence
              )}`}
            >
              {result.confidence} confidence
            </span>
          </div>
          <CredibilityMeter score={result.score} />
          <p className={`text-6xl font-bold text-center mt-6 ${getScoreColor(result.score)}`}>
            {result.score}
            <span className="text-2xl text-gray-400">/100</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Scoring Breakdown
          </h3>
          <FactorsChart factors={result.factors} />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary</h3>
        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* Article Citations */}
      {result.articleCitation && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            📚 Cite This Article
          </h3>
          <div className="space-y-6">
            {/* APA Citation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">APA (7th Edition)</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(result.articleCitation!.apa)}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm">
                {result.articleCitation.apa}
              </p>
            </div>

            {/* MLA Citation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">MLA (9th Edition)</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(result.articleCitation!.mla)}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm">
                {result.articleCitation.mla}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            ⚠️ Warnings
          </h3>
          <ul className="space-y-2">
            {result.warnings.map((warning, index) => (
              <li key={index} className="text-yellow-800">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Citations */}
      {result.citations && result.citations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Citations & Verification
          </h3>
          <CitationPanel citations={result.citations} />
        </div>
      )}

      {/* Processing Steps (Explainability Mode) */}
      {result.processingSteps && result.processingSteps.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            🔍 Explainability: Processing Steps
          </h3>
          <div className="space-y-3">
            {result.processingSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{step.step}</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.details && (
                    <pre className="text-xs text-gray-500 mt-1">
                      {JSON.stringify(step.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
        <p className="text-sm text-gray-700 text-center">
          <strong>Disclaimer:</strong> This is an AI-assisted credibility analysis, not
          absolute truth. Always verify important information from multiple sources and
          use critical thinking alongside this assessment.
        </p>
      </div>
    </div>
  )
}
