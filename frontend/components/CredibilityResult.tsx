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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-red-50 text-red-700 border-red-200',
    }
    return colors[confidence as keyof typeof colors] || colors.medium
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

  const handleThumbsClick = (value: boolean) => {
    setThumbsUp(value)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
            Analysis complete
          </h2>
          <p className="text-lg text-[#6e6e73]">
            Comprehensive credibility assessment
          </p>
        </div>
        <button
          onClick={onAnalyzeNew}
          className="px-6 py-3 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-full hover:bg-[#e8e8ed] transition-all duration-200 hover:scale-[1.02]"
        >
          New analysis
        </button>
      </div>

      {/* Score Overview - Large Featured Card */}
      <div className="backdrop-blur-xl bg-white/90 rounded-[40px] p-12 shadow-2xl border border-black/5 mb-8">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Score Display */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                Credibility Score
              </h3>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getConfidenceBadge(
                  result.confidence
                )}`}
              >
                {result.confidence} confidence
              </span>
            </div>

            <div className="mb-8">
              <CredibilityMeter score={result.score} />
            </div>

            <div className={`text-8xl font-bold tracking-tight ${getScoreColor(result.score)}`}>
              {result.score}
              <span className="text-4xl text-[#86868b] font-normal">/100</span>
            </div>
          </div>

          {/* Factors Breakdown */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
              Analysis Factors
            </h3>
            <FactorsChart factors={result.factors} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="backdrop-blur-xl bg-white/90 rounded-[40px] p-12 shadow-xl border border-black/5">
        <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">Summary</h3>
        <p className="text-lg text-[#6e6e73] leading-relaxed">{result.summary}</p>
      </div>

      {/* Article Citations */}
      {result.articleCitation && (
        <div className="backdrop-blur-xl bg-white/90 rounded-[40px] p-12 shadow-xl border border-black/5">
          <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
            Citation Formats
          </h3>
          <div className="space-y-8">
            {/* APA Citation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-[#1d1d1f]">APA (7th Edition)</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(result.articleCitation!.apa)}
                  className="text-sm px-4 py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-full hover:bg-[#e8e8ed] transition-all duration-200"
                >
                  Copy
                </button>
              </div>
              <p className="text-base text-[#6e6e73] bg-[#f5f5f7] p-6 rounded-[20px] border border-black/5 font-mono leading-relaxed">
                {result.articleCitation.apa}
              </p>
            </div>

            {/* MLA Citation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-[#1d1d1f]">MLA (9th Edition)</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(result.articleCitation!.mla)}
                  className="text-sm px-4 py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-full hover:bg-[#e8e8ed] transition-all duration-200"
                >
                  Copy
                </button>
              </div>
              <p className="text-base text-[#6e6e73] bg-[#f5f5f7] p-6 rounded-[20px] border border-black/5 font-mono leading-relaxed">
                {result.articleCitation.mla}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-[28px]">
          <h3 className="text-xl font-semibold text-amber-900 mb-4 tracking-tight">
            Important Considerations
          </h3>
          <ul className="space-y-2">
            {result.warnings.map((warning, index) => (
              <li key={index} className="text-amber-800 leading-relaxed">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Citations */}
      {result.citations && result.citations.length > 0 && (
        <div className="backdrop-blur-xl bg-white/90 rounded-[40px] p-12 shadow-xl border border-black/5">
          <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
            Source Verification
          </h3>
          <CitationPanel citations={result.citations} />
        </div>
      )}

      {/* Processing Steps */}
      {result.processingSteps && result.processingSteps.length > 0 && (
        <div className="bg-[#f5f5f7] rounded-[40px] p-12 border border-black/5">
          <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
            Analysis Process
          </h3>
          <div className="space-y-6">
            {result.processingSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0071e3] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-[#1d1d1f] mb-1">{step.step}</p>
                  <p className="text-base text-[#6e6e73]">{step.description}</p>
                  {step.details && (
                    <pre className="text-xs text-[#86868b] mt-2 overflow-x-auto">
                      {JSON.stringify(step.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Feedback */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-[#f5f5f7] to-white rounded-[40px] p-12 border border-black/5">
        <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
          Was this helpful?
        </h3>

        {!feedbackSubmitted ? (
          <div className="space-y-6">
            {/* Thumbs Up/Down */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleThumbsClick(true)}
                className={`flex items-center gap-3 px-6 py-4 rounded-full font-medium transition-all duration-200 ${
                  thumbsUp === true
                    ? 'bg-[#0071e3] text-white shadow-lg'
                    : 'bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] border border-black/10'
                }`}
              >
                <span className="text-xl">👍</span>
                <span>Helpful</span>
              </button>
              <button
                onClick={() => handleThumbsClick(false)}
                className={`flex items-center gap-3 px-6 py-4 rounded-full font-medium transition-all duration-200 ${
                  thumbsUp === false
                    ? 'bg-[#1d1d1f] text-white shadow-lg'
                    : 'bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] border border-black/10'
                }`}
              >
                <span className="text-xl">👎</span>
                <span>Not helpful</span>
              </button>
            </div>

            {/* Feedback Comment */}
            <div>
              <label className="block text-sm font-medium text-[#6e6e73] mb-3">
                Share your thoughts (optional)
              </label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Tell us how we can improve..."
                className="w-full px-6 py-4 border border-black/10 rounded-[20px] bg-white text-[#1d1d1f] placeholder-[#86868b] focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3]/30 outline-none resize-none transition-all duration-200"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleFeedbackSubmit}
              disabled={submittingFeedback || (thumbsUp === null && !feedbackComment.trim())}
              className="px-8 py-4 bg-[#0071e3] text-white font-medium rounded-full hover:bg-[#0077ed] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {submittingFeedback ? 'Submitting...' : 'Submit feedback'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[28px] p-10 text-center border border-green-200">
            <div className="text-5xl mb-4">✓</div>
            <p className="text-xl font-medium text-green-700 mb-2">
              Thank you for your feedback
            </p>
            <p className="text-sm text-[#6e6e73]">
              Your input helps us improve DISCERN
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-[#f5f5f7] rounded-[28px] p-8 border border-black/5">
        <p className="text-sm text-[#6e6e73] text-center leading-relaxed">
          <strong className="text-[#1d1d1f]">Disclaimer:</strong> This analysis is provided for informational purposes.
          Always verify important information from multiple sources and apply critical thinking.
        </p>
      </div>
    </div>
  )
}
