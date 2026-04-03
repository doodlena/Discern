'use client'

import { useState } from 'react'
import { AnalysisResult } from '@discern/shared/types'
import CredibilityMeter from './CredibilityMeter'
import FactorsChart from './FactorsChart'
import CitationPanel from './CitationPanel'

interface Props {
  result: AnalysisResult
  onAnalyzeNew: () => void
}

export default function CredibilityResult({ result, onAnalyzeNew }: Props) {
  const [thumbsUp, setThumbsUp] = useState<boolean | null>(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'High credibility', color: 'text-emerald-700' }
    if (score >= 50) return { label: 'Medium credibility', color: 'text-amber-700' }
    return { label: 'Low credibility', color: 'text-red-800' }
  }

  const getConfidenceBadge = (confidence: string) => {
    const styles = {
      high: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      medium: 'bg-amber-50 text-amber-800 border-amber-200',
      low: 'bg-red-50 text-red-800 border-red-200',
    }
    return styles[confidence as keyof typeof styles] || styles.medium
  }

  const handleFeedbackSubmit = async () => {
    if (thumbsUp === null && !feedbackComment.trim()) {
      return
    }

    setSubmittingFeedback(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisId: result.id,
          thumbsUp,
          comment: feedbackComment.trim() || null,
        }),
      })

      if (response.ok) {
        setFeedbackSubmitted(true)
      }
    } catch (error) {
      console.error('Failed to submit feedback', error)
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const scoreCategory = getScoreCategory(result.score)

  return (
    <div className="max-w-[1400px] mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
        <div>
          <h1 className="text-editorial text-4xl md:text-5xl text-stone-950 mb-3">
            Analysis complete
          </h1>
          <p className="text-ui text-lg text-stone-600">
            Comprehensive credibility assessment
          </p>
        </div>
        <button
          onClick={onAnalyzeNew}
          className="btn-secondary whitespace-nowrap"
        >
          New analysis
        </button>
      </div>

      {/* Score Overview - Featured */}
      <div className="mb-12">
        <div className="card-refined p-12 md:p-16">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Score Display */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-ui text-sm font-medium tracking-wide uppercase text-stone-500">
                  Credibility Score
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceBadge(result.confidence)}`}>
                  {result.confidence} confidence
                </span>
              </div>

              <div className="mb-8">
                <div className={`text-editorial text-8xl md:text-9xl ${scoreCategory.color} leading-none mb-4`}>
                  {result.score}
                  <span className="text-stone-400 text-5xl">/100</span>
                </div>
                <p className="text-ui text-xl text-stone-600">
                  {scoreCategory.label}
                </p>
              </div>

              <div className="mb-6">
                <CredibilityMeter score={result.score} />
              </div>
            </div>

            {/* Factors Breakdown */}
            <div className="lg:col-span-3">
              <h3 className="text-ui text-sm font-medium tracking-wide uppercase text-stone-500 mb-6">
                Analysis Factors
              </h3>
              <FactorsChart factors={result.factors} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <div className="card-refined p-10">
          <h2 className="text-editorial text-2xl text-stone-950 mb-6">Summary</h2>
          <p className="text-ui text-base text-stone-700 leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="mb-8">
          <div className="bg-amber-50 border-l-4 border-amber-600 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-ui text-sm font-semibold text-amber-900 mb-3 uppercase tracking-wide">
                  Important Considerations
                </h3>
                <ul className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="text-ui text-sm text-amber-800 leading-relaxed">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Citations */}
      {result.citations && result.citations.length > 0 && (
        <div className="mb-8">
          <div className="card-refined p-10">
            <h2 className="text-editorial text-2xl text-stone-950 mb-8">Source Verification</h2>
            <CitationPanel citations={result.citations} />
          </div>
        </div>
      )}

      {/* Article Citations */}
      {result.articleCitation && (
        <div className="mb-8">
          <div className="card-refined p-10">
            <h2 className="text-editorial text-2xl text-stone-950 mb-8">
              Citation Formats
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* APA Citation */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-ui text-sm font-semibold text-stone-900 uppercase tracking-wide">
                    APA (7th Edition)
                  </h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.articleCitation!.apa)}
                    className="text-ui text-xs px-3 py-1.5 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition-refined"
                  >
                    Copy
                  </button>
                </div>
                <div className="bg-stone-50 p-5 rounded-lg border-refined">
                  <p className="text-ui text-sm text-stone-700 leading-relaxed font-mono break-words">
                    {result.articleCitation.apa}
                  </p>
                </div>
              </div>

              {/* MLA Citation */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-ui text-sm font-semibold text-stone-900 uppercase tracking-wide">
                    MLA (9th Edition)
                  </h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.articleCitation!.mla)}
                    className="text-ui text-xs px-3 py-1.5 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition-refined"
                  >
                    Copy
                  </button>
                </div>
                <div className="bg-stone-50 p-5 rounded-lg border-refined">
                  <p className="text-ui text-sm text-stone-700 leading-relaxed font-mono break-words">
                    {result.articleCitation.mla}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Steps */}
      {result.processingSteps && result.processingSteps.length > 0 && (
        <div className="mb-8">
          <div className="bg-stone-100 rounded-xl p-10 border-refined">
            <h2 className="text-editorial text-2xl text-stone-950 mb-8">Analysis Process</h2>
            <div className="space-y-6">
              {result.processingSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-stone-950 text-white rounded-full flex items-center justify-center text-ui text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-ui text-sm font-semibold text-stone-950 mb-1">{step.step}</p>
                    <p className="text-ui text-sm text-stone-600">{step.description}</p>
                    {step.details && (
                      <pre className="text-xs text-stone-500 mt-3 overflow-x-auto bg-white p-3 rounded border-refined">
                        {JSON.stringify(step.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Feedback */}
      <div className="mb-8">
        <div className="card-refined p-10">
          <h2 className="text-editorial text-2xl text-stone-950 mb-6">
            Was this helpful?
          </h2>

          {!feedbackSubmitted ? (
            <div className="space-y-6">
              {/* Thumbs Up/Down */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setThumbsUp(true)}
                  className={`px-5 py-3 rounded-lg font-medium transition-refined text-ui text-sm ${
                    thumbsUp === true
                      ? 'bg-stone-950 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-refined'
                  }`}
                >
                  Helpful
                </button>
                <button
                  onClick={() => setThumbsUp(false)}
                  className={`px-5 py-3 rounded-lg font-medium transition-refined text-ui text-sm ${
                    thumbsUp === false
                      ? 'bg-stone-950 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-refined'
                  }`}
                >
                  Not helpful
                </button>
              </div>

              {/* Feedback Comment */}
              <div>
                <label className="block text-ui text-sm font-medium text-stone-700 mb-3">
                  Share your thoughts (optional)
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Tell us how we can improve..."
                  className="w-full px-5 py-3.5 border-refined rounded-lg bg-white text-stone-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 transition-refined resize-none text-ui text-sm"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleFeedbackSubmit}
                disabled={submittingFeedback || (thumbsUp === null && !feedbackComment.trim())}
                className="btn-primary disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                {submittingFeedback ? 'Submitting...' : 'Submit feedback'}
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-xl p-8 text-center border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-ui text-base font-semibold text-emerald-900 mb-2">
                Thank you for your feedback
              </p>
              <p className="text-ui text-sm text-emerald-700">
                Your input helps us improve DISCERN
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-stone-100 rounded-xl p-6 border-refined">
        <p className="text-ui text-xs text-center text-stone-600 leading-relaxed">
          <strong className="text-stone-900">Disclaimer:</strong> This analysis is provided for informational purposes.
          Always verify important information from multiple sources and apply critical thinking.
        </p>
      </div>
    </div>
  )
}
