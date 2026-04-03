'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  score: number
}

export default function CredibilityMeter({ score }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const getColor = (value: number) => {
    if (value >= 80) return '#10b981' // green
    if (value >= 50) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  return (
    <div className="relative w-full h-32 overflow-visible">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
        {/* Background Arc */}
        <path
          d="M 10 90 A 80 80 0 0 1 190 90"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Colored Arc */}
        <motion.path
          d="M 10 90 A 80 80 0 0 1 190 90"
          fill="none"
          stroke={getColor(animatedScore)}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="251.2"
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (animatedScore / 100) * 251.2 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}
