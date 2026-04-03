'use client'

import { ScoringFactors } from '@discern/shared/types'
import { motion } from 'framer-motion'

interface Props {
  factors: ScoringFactors
}

export default function FactorsChart({ factors }: Props) {
  const items = [
    { name: 'Neutrality', value: factors.bias, max: 25, description: '25 = neutral, fact-based' },
    { name: 'Source Rep.', value: factors.source_reputation, max: 25 },
    { name: 'Evidence', value: factors.evidence, max: 25 },
    { name: 'Logic', value: factors.logic, max: 25 },
  ]

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{item.name}</span>
            <span className="text-sm font-semibold text-gray-900">
              {item.value}/{item.max}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / item.max) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
              className={`h-full rounded-full ${
                item.value / item.max >= 0.8
                  ? 'bg-green-500'
                  : item.value / item.max >= 0.5
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
          </div>
          {'description' in item && (
            <p className="text-xs text-gray-500 mt-1 italic">
              ({item.description})
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
