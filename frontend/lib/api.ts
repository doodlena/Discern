import axios from 'axios'
import { AnalysisRequest, AnalysisResult, AnalyticsMetrics, DemoArticle } from '@discern/shared/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Analyze content for credibility
 */
export async function analyzeContent(request: AnalysisRequest): Promise<AnalysisResult> {
  try {
    const response = await api.post('/api/analyze', request)

    if (!response.data.success) {
      throw new Error(response.data.error || 'Analysis failed')
    }

    return response.data.data
  } catch (error: any) {
    // Extract error message from axios error response
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw new Error(error.message || 'Analysis failed')
  }
}

/**
 * Get demo content options
 */
export async function getDemoContent(): Promise<DemoArticle[]> {
  try {
    const response = await api.get('/api/analyze/demo')

    if (!response.data.success) {
      throw new Error('Failed to load demo content')
    }

    return response.data.data
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw new Error(error.message || 'Failed to load demo content')
  }
}

/**
 * Admin login
 */
export async function adminLogin(password: string): Promise<string> {
  try {
    const response = await api.post('/api/admin/login', { password })

    if (!response.data.success) {
      throw new Error(response.data.error || 'Login failed')
    }

    return response.data.data.token
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw new Error(error.message || 'Login failed')
  }
}

/**
 * Get analytics (admin only)
 */
export async function getAnalytics(token: string, days: number = 30): Promise<AnalyticsMetrics> {
  const response = await api.get('/api/admin/analytics', {
    params: { days },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.data.success) {
    throw new Error('Failed to load analytics')
  }

  return response.data.data
}

/**
 * Get quick stats (admin only)
 */
export async function getAdminStats(token: string): Promise<any> {
  const response = await api.get('/api/admin/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.data.success) {
    throw new Error('Failed to load stats')
  }

  return response.data.data
}

/**
 * Get advanced statistical analysis (admin only)
 */
export async function getAdvancedStats(token: string, days: number = 30): Promise<any> {
  const response = await api.get('/api/admin/advanced-stats', {
    params: { days },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.data.success) {
    throw new Error('Failed to load advanced statistics')
  }

  return response.data.data
}

/**
 * Export analytics as CSV
 */
export function getExportUrl(token: string, days: number = 30): string {
  return `${API_URL}/api/admin/export?days=${days}&token=${token}`
}
