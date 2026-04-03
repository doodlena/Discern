'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [demoUrl, setDemoUrl] = useState('')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Know What to <span className="text-blue-600">Trust</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              AI-powered credibility scoring for online articles, news, and documents.
              Built with transparency, designed for truth.
            </p>

            <div className="flex justify-center gap-4 mb-16">
              <Link
                href="/analyze"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
              >
                Analyze Content
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition border border-gray-300"
              >
                Learn More
              </Link>
            </div>

            {/* Quick Demo Box */}
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Try it now - Paste a URL
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="https://example.com/article"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Link
                  href={`/analyze?url=${encodeURIComponent(demoUrl)}`}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Analyze
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How DISCERN Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Meter Demo */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transparent Credibility Scoring
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Every score is backed by explainable AI analysis across four key factors
          </p>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              {scoringFactors.map((factor, index) => (
                <div key={index} className="text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{factor.icon}</span>
                    <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{factor.description}</p>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${factor.demoValue}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chrome Extension Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Get the Chrome Extension
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Analyze articles directly while browsing - right-click any page to check credibility
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/discern-extension.zip"
              download
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Extension
            </a>
          </div>
          <p className="text-sm text-purple-100 mt-6">
            Download → Unzip → Chrome Settings → Extensions → Load Unpacked
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Analyzing Content Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the fight against misinformation with AI-powered transparency
          </p>
          <Link
            href="/analyze"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
          >
            Get Started Free
          </Link>
          <p className="text-sm text-blue-100 mt-4">
            Free • 10 analyses per day • No account required
          </p>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: '🔍',
    title: 'Multi-Input Analysis',
    description: 'Analyze URLs, pasted text, or upload PDF documents for comprehensive credibility assessment.',
  },
  {
    icon: '🎯',
    title: 'AI-Powered Scoring',
    description: 'Advanced AI evaluates neutrality, source reputation, evidence quality, and logical consistency.',
  },
  {
    icon: '📊',
    title: 'Citation Verification',
    description: 'Automatically verify claims with supporting or contradicting sources for full transparency.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Results',
    description: 'Get instant credibility scores with detailed breakdowns and explanations.',
  },
  {
    icon: '🔐',
    title: 'Ethical AI',
    description: 'Built with transparency and designed to acknowledge limitations and uncertainty.',
  },
  {
    icon: '📈',
    title: 'Analytics Dashboard',
    description: 'Track misinformation trends and analyze credibility patterns over time.',
  },
]

const scoringFactors = [
  {
    icon: '⚖️',
    name: 'Neutrality',
    description: 'Evaluates fact-based language vs. emotional manipulation and loaded terminology',
    demoValue: 85,
  },
  {
    icon: '🏛️',
    name: 'Source Reputation',
    description: 'Evaluates domain authority and institutional credibility',
    demoValue: 92,
  },
  {
    icon: '📚',
    name: 'Evidence Quality',
    description: 'Assesses citations, data sources, and expert references',
    demoValue: 78,
  },
  {
    icon: '🧠',
    name: 'Logical Consistency',
    description: 'Checks for contradictions and reasoning soundness',
    demoValue: 88,
  },
]
