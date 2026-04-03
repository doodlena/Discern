'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

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

  // Convert score (0-100) to rotation angle (-90 to 90 degrees)
  const rotation = (animatedScore / 100) * 180 - 90

  return (
    <div className="relative w-full h-44 overflow-visible">
      {/* Background Arc */}
      <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Define the needle as a reusable element */}
          <g id="needle">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-70"
              stroke="#374151"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </defs>

        {/* Background Arc */}
        <path
          d="M 10 100 A 80 80 0 0 1 190 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Colored Arc */}
        <motion.path
          d="M 10 100 A 80 80 0 0 1 190 100"
          fill="none"
          stroke={getColor(animatedScore)}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="251.2"
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (animatedScore / 100) * 251.2 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Needle - using transform attribute for proper centering */}
        <motion.use
          href="#needle"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            originX: '100px',
            originY: '100px',
          }}
          transform="translate(100, 100)"
        />

        {/* Center circle - always on top */}
        <circle cx="100" cy="100" r="6" fill="#374151" />
      </svg>

      {/* Labels */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}
