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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Credibility Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze URLs, text, or PDF documents to get AI-powered credibility scores
            with transparent explanations
          </p>
        </div>

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
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="animate-fade-in">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AnalyzeContent />
    </Suspense>
  )
}
