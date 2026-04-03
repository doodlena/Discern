'use client'

import { useState, useEffect } from 'react'
import { adminLogin, getAnalytics, getAdminStats, getAdvancedStats } from '@/lib/api'
import { AnalyticsMetrics } from '@discern/shared/types'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import AdvancedStats from '@/components/AdvancedStats'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [advancedStats, setAdvancedStats] = useState<any>(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    // Check if already authenticated
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      setAuthenticated(true)
      loadData(savedToken)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = await adminLogin(password)
      setToken(token)
      setAuthenticated(true)
      localStorage.setItem('admin_token', token)
      await loadData(token)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async (authToken: string, selectedDays: number = 30) => {
    try {
      const [analyticsData, statsData, advancedStatsData] = await Promise.all([
        getAnalytics(authToken, selectedDays),
        getAdminStats(authToken),
        getAdvancedStats(authToken, selectedDays),
      ])

      setAnalytics(analyticsData)
      setStats(statsData)
      setAdvancedStats(advancedStatsData)
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    }
  }

  const handleLogout = () => {
    setAuthenticated(false)
    setToken(null)
    setAnalytics(null)
    setStats(null)
    localStorage.removeItem('admin_token')
  }

  const handleExport = () => {
    if (token) {
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/export?days=${days}&token=${token}`,
        '_blank'
      )
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300"
              >
                {loading ? 'Authenticating...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Analytics and insights for DISCERN platform
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={days}
            onChange={(e) => {
              const newDays = parseInt(e.target.value)
              setDays(newDays)
              if (token) loadData(token, newDays)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Scans
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalScans.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Average Score
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.averageScore.toFixed(1)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Low Credibility %
              </h3>
              <p className="text-3xl font-bold text-red-600">
                {stats.lowCredibilityPercentage}%
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Top Flagged Source
              </h3>
              <p className="text-lg font-bold text-gray-900 truncate">
                {stats.topFlaggedSource}
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        {analytics && <AnalyticsCharts analytics={analytics} />}

        {/* Advanced Statistical Analysis */}
        <div className="mt-8">
          <AdvancedStats stats={advancedStats} />
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
