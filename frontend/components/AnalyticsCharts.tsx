'use client'

import { AnalyticsMetrics } from '@discern/shared/types'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  analytics: AnalyticsMetrics
}

export default function AnalyticsCharts({ analytics }: Props) {
  // Score distribution data
  const scoreDistData = [
    { name: 'Low (0-49)', value: analytics.scoreDistribution.low, color: '#ef4444' },
    { name: 'Medium (50-79)', value: analytics.scoreDistribution.medium, color: '#f59e0b' },
    { name: 'High (80-100)', value: analytics.scoreDistribution.high, color: '#10b981' },
  ]

  // Content type data
  const contentTypeData = [
    { name: 'URL', value: analytics.contentTypeBreakdown.url, color: '#3b82f6' },
    { name: 'Text', value: analytics.contentTypeBreakdown.text, color: '#8b5cf6' },
    { name: 'PDF', value: analytics.contentTypeBreakdown.pdf, color: '#ec4899' },
  ]

  return (
    <div className="space-y-8">
      {/* Daily Analyses Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Daily Analysis Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.dailyAnalyses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Analyses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Score Distribution
          </h2>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={scoreDistData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} analyses`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 w-full">
              {scoreDistData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {entry.value} ({((entry.value / scoreDistData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Type Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Content Type Breakdown
          </h2>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} analyses`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 w-full">
              {contentTypeData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {entry.value} ({((entry.value / contentTypeData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Domains */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Top Analyzed Domains
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.topDomains.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="domain" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Count" />
            <Bar dataKey="averageScore" fill="#10b981" name="Avg Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Total Analyses</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.totalAnalyses.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Average Credibility</p>
            <p className="text-2xl font-bold text-blue-600">
              {analytics.averageScore.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Low Credibility Flagged</p>
            <p className="text-2xl font-bold text-red-600">
              {analytics.lowCredibilityCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
