'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface Props {
  onAnalyze: (type: 'url' | 'text' | 'pdf', content: string) => void
  loading: boolean
  processingStep: string
}

export default function AnalyzerInput({ onAnalyze, loading, processingStep }: Props) {
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'pdf'>('url')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          onAnalyze('pdf', base64)
        }
        reader.readAsDataURL(file)
      }
    },
  })

  const handleSubmit = () => {
    if (activeTab === 'url' && urlInput) {
      onAnalyze('url', urlInput)
    } else if (activeTab === 'text' && textInput) {
      onAnalyze('text', textInput)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('url')}
          className={`px-6 py-3 text-ui text-sm font-medium transition-refined ${
            activeTab === 'url'
              ? 'text-stone-950 border-b-2 border-stone-950'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          URL
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`px-6 py-3 text-ui text-sm font-medium transition-refined ${
            activeTab === 'text'
              ? 'text-stone-950 border-b-2 border-stone-950'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`px-6 py-3 text-ui text-sm font-medium transition-refined ${
            activeTab === 'pdf'
              ? 'text-stone-950 border-b-2 border-stone-950'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          PDF
        </button>
      </div>

      {/* Input Area */}
      <div className="card-refined p-8">
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-ui text-sm font-medium text-stone-700 mb-3">
                Article or Website URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/article"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-3.5 bg-white border-refined rounded-lg text-stone-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 transition-refined disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-ui text-sm font-medium text-stone-700 mb-3">
                Paste Text Content
              </label>
              <textarea
                placeholder="Paste the article or text you want to analyze..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={loading}
                rows={12}
                className="w-full px-5 py-3.5 bg-white border-refined rounded-lg text-stone-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 transition-refined disabled:bg-stone-100 disabled:cursor-not-allowed resize-none font-mono text-sm leading-relaxed"
              />
              <p className="text-ui text-xs text-stone-500 mt-2">
                Maximum 50,000 characters
              </p>
            </div>
          </div>
        )}

        {activeTab === 'pdf' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-refined ${
              isDragActive
                ? 'border-stone-950 bg-stone-100'
                : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
            } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-stone-100 rounded-full">
                <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              {isDragActive ? (
                <p className="text-ui text-base text-stone-950 font-medium">
                  Drop PDF here
                </p>
              ) : (
                <>
                  <p className="text-ui text-base text-stone-950 font-medium mb-2">
                    Drag and drop a PDF file
                  </p>
                  <p className="text-ui text-sm text-stone-500">
                    or click to browse • max 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {(activeTab === 'url' || activeTab === 'text') && (
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || (activeTab === 'url' ? !urlInput : !textInput)}
              className="w-full btn-primary disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Content'}
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && processingStep && (
        <div className="mt-6 card-refined p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-ui text-sm font-medium text-stone-950 mb-1">
                {processingStep}
              </p>
              <p className="text-ui text-xs text-stone-500">
                This may take 20–30 seconds for comprehensive analysis
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
