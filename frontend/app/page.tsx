'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')

  return (
    <div className="min-h-screen">
      {/* Hero Section - Editorial Impact */}
      <section className="relative pt-24 md:pt-32 pb-32 md:pb-48 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
          >
            {/* Kicker */}
            <p className="text-ui text-sm font-medium tracking-wide uppercase text-stone-500 mb-6">
              Presidential AI Challenge 2024
            </p>

            {/* Main Headline - Editorial Serif */}
            <h1 className="text-editorial text-6xl md:text-7xl lg:text-8xl mb-8 text-stone-950 max-w-5xl">
              Know what to trust.
            </h1>

            {/* Subhead */}
            <p className="text-ui text-xl md:text-2xl text-stone-600 mb-12 max-w-3xl leading-relaxed">
              Advanced credibility analysis that reveals bias, verifies sources, and assesses evidence quality—helping you navigate the information age with confidence.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20">
              <Link
                href="/analyze"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                <span>Start analyzing</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/about" className="btn-secondary">
                How it works
              </Link>
            </div>

            {/* Quick Input */}
            <div className="max-w-2xl">
              <label className="block text-ui text-sm font-medium text-stone-700 mb-3">
                Try it now
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="Paste any article URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-5 py-3 bg-white border-refined rounded-lg text-stone-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2 transition-refined"
                />
                <Link
                  href={url ? `/analyze?url=${encodeURIComponent(url)}` : '/analyze'}
                  className="px-6 py-3 bg-stone-950 text-white font-medium rounded-lg hover:bg-stone-900 transition-refined whitespace-nowrap"
                >
                  Analyze
                </Link>
              </div>
              <p className="text-ui text-xs text-stone-500 mt-2">
                No account needed • 10 free analyses daily
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-stone-200 bg-white py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center md:text-left"
              >
                <div className="text-editorial text-4xl md:text-5xl text-stone-950 mb-2">
                  {stat.value}
                </div>
                <div className="text-ui text-sm text-stone-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pillars - Grid Layout */}
      <section className="py-32 px-6 bg-stone-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <h2 className="text-editorial text-4xl md:text-5xl text-stone-950 mb-4">
              Four pillars of analysis
            </h2>
            <p className="text-ui text-lg text-stone-600 max-w-2xl">
              Every piece of content is evaluated across these critical dimensions to deliver a comprehensive credibility assessment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-refined p-10"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-editorial text-2xl text-stone-950">
                    {pillar.title}
                  </h3>
                  <div className="text-ui text-sm font-medium px-3 py-1 bg-stone-100 text-stone-700 rounded-full">
                    0–25 pts
                  </div>
                </div>
                <p className="text-ui text-base text-stone-600 leading-relaxed mb-6">
                  {pillar.description}
                </p>
                <div className="flex items-center gap-2 text-ui text-sm text-stone-500">
                  <div className="w-2 h-2 rounded-full bg-stone-300" />
                  <span>{pillar.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Stepped Process */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-editorial text-4xl md:text-5xl text-stone-950 mb-20 max-w-3xl">
            Transparent analysis you can trust
          </h2>

          <div className="space-y-16">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid md:grid-cols-12 gap-8 items-start"
              >
                <div className="md:col-span-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 border-2 border-stone-950 rounded-full text-editorial text-xl">
                    {index + 1}
                  </div>
                </div>
                <div className="md:col-span-10">
                  <h3 className="text-editorial text-3xl text-stone-950 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-ui text-lg text-stone-600 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Extension Callout */}
      <section className="py-32 px-6 bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-editorial text-4xl md:text-5xl mb-6">
              Analyze as you browse
            </h2>
            <p className="text-ui text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
              The Chrome extension brings instant credibility analysis to every article you read online.
            </p>
            <a
              href="/discern-extension.zip"
              download
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-950 font-medium rounded-lg hover:bg-stone-100 transition-refined"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for Chrome
            </a>
            <p className="text-ui text-sm text-stone-400 mt-6">
              Free • Privacy-focused • Works offline
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-editorial text-5xl md:text-6xl text-stone-950 mb-8">
              Start analyzing today
            </h2>
            <p className="text-ui text-xl text-stone-600 mb-10">
              No account required. Get 10 free credibility analyses every day.
            </p>
            <Link href="/analyze" className="btn-primary inline-flex items-center gap-2">
              <span>Get started</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const stats = [
  { value: '10k+', label: 'Analyses performed' },
  { value: '94%', label: 'Accuracy rate' },
  { value: '4.8/5', label: 'User rating' },
  { value: '<30s', label: 'Average analysis time' },
]

const pillars = [
  {
    title: 'Neutrality',
    description: 'Identifies emotional manipulation, loaded language, and partisan framing to distinguish factual reporting from opinion and propaganda.',
    metric: 'Bias detection & language analysis',
  },
  {
    title: 'Source Reputation',
    description: 'Evaluates publisher authority, institutional credibility, and journalistic standards based on established reliability metrics.',
    metric: 'Publisher & domain authority',
  },
  {
    title: 'Evidence Quality',
    description: 'Assesses citation practices, data provenance, and expert attribution to verify claims are supported by credible sources.',
    metric: 'Citations & supporting data',
  },
  {
    title: 'Logical Consistency',
    description: 'Detects contradictions, fallacies, and reasoning errors to ensure arguments are coherent and conclusions follow from premises.',
    metric: 'Reasoning & argumentation',
  },
]

const process = [
  {
    title: 'Content extraction',
    description: 'We fetch and parse content from URLs, PDFs, or direct text input while preserving structure and context for accurate analysis.',
  },
  {
    title: 'Multi-factor assessment',
    description: 'Claude AI evaluates the content across four key dimensions: neutrality, source reputation, evidence quality, and logical consistency.',
  },
  {
    title: 'Citation verification',
    description: 'Key claims are identified and cross-referenced against credible sources, with each citation labeled for reliability and support.',
  },
  {
    title: 'Results & transparency',
    description: 'You receive a comprehensive credibility score with detailed breakdowns, explanations, and actionable insights.',
  },
]
