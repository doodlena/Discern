'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AnalyzerInput from '@/components/AnalyzerInput'
import CredibilityResult from '@/components/CredibilityResult'
import { analyzeContent } from '@/lib/api'
import { AnalysisResult } from '@discern/shared/types'

function AnalyzeContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState<string>('')

  useEffect(() => {
    const urlParam = searchParams.get('url')

    if (urlParam) {
      handleAnalyze('url', urlParam)
    }
  }, [searchParams])

  const handleAnalyze = async (
    type: 'url' | 'text' | 'pdf',
    content: string
  ) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setProcessingStep('Initiating analysis...')

    try {
      // Simulate processing steps for better UX
      const steps = [
        'Extracting content...',
        'Analyzing bias and language...',
        'Evaluating source reputation...',
        'Verifying evidence and citations...',
        'Assessing logical consistency...',
        'Generating citations...',
        'Calculating credibility score...',
      ]

      let stepIndex = 0
      const stepInterval = setInterval(() => {
        if (stepIndex < steps.length) {
          setProcessingStep(steps[stepIndex])
          stepIndex++
        }
      }, 2000)

      const data = await analyzeContent({
        type,
        content,
        demoMode: false,
        explainabilityMode: false,
      })

      clearInterval(stepInterval)
      setResult(data)
      setProcessingStep('')
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.')
      setProcessingStep('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16 md:py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        {!result && (
          <div className="mb-16">
            <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-stone-950 mb-4">
              Analyze content
            </h1>
            <p className="text-ui text-lg md:text-xl text-stone-600 max-w-2xl">
              Paste a URL, enter text, or upload a PDF for comprehensive credibility analysis
            </p>
          </div>
        )}

        {/* Input Section */}
        {!result && (
          <AnalyzerInput
            onAnalyze={handleAnalyze}
            loading={loading}
            processingStep={processingStep}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-ui text-sm font-medium text-red-900">Error</p>
                <p className="text-ui text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="animate-fade-up">
            <CredibilityResult
              result={result}
              onAnalyzeNew={() => {
                setResult(null)
                setError(null)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ui text-sm text-stone-600">Loading...</p>
        </div>
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  )
}
