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
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'url'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🔗 URL
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'text'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📝 Text
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'pdf'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📄 PDF
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article or Website URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/article"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
              />
            </div>
          )}

          {activeTab === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Text Content
              </label>
              <textarea
                placeholder="Paste the article or text you want to analyze..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={loading}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Maximum 50,000 characters
              </p>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">📄</div>
              {isDragActive ? (
                <p className="text-lg text-blue-600 font-medium">
                  Drop PDF here...
                </p>
              ) : (
                <>
                  <p className="text-lg text-gray-700 font-medium mb-2">
                    Drag and drop a PDF file
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to browse (max 10MB)
                  </p>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          {(activeTab === 'url' || activeTab === 'text') && (
            <button
              onClick={handleSubmit}
              disabled={loading || (activeTab === 'url' ? !urlInput : !textInput)}
              className="mt-6 w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Content'}
            </button>
          )}

          {/* Loading State */}
          {loading && processingStep && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-blue-800 font-medium">{processingStep}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
