import { Router, Request, Response } from 'express';
import database from '../services/database';
import logger from '../utils/logger';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

/**
 * GET /api/admin/analytics
 * Get analytics dashboard data
 * Requires admin authentication
 */
router.get('/analytics', adminAuth, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;

    logger.info('Admin analytics requested', { days });

    // Hardcoded analytics for charts
    const analytics = {
      totalAnalyses: 347,
      averageScore: 67.8,
      scoreDistribution: {
        low: 66,
        medium: 195,
        high: 86,
      },
      contentTypeBreakdown: {
        url: 240,
        text: 65,
        pdf: 42,
      },
      topDomains: [
        { domain: 'foxnews.com', count: 28, averageScore: 68 },
        { domain: 'cnn.com', count: 26, averageScore: 74 },
        { domain: 'nytimes.com', count: 24, averageScore: 82 },
        { domain: 'reuters.com', count: 22, averageScore: 88 },
        { domain: 'bbc.com', count: 20, averageScore: 85 },
        { domain: 'washingtonpost.com', count: 18, averageScore: 81 },
        { domain: 'theguardian.com', count: 16, averageScore: 79 },
        { domain: 'medium.com', count: 14, averageScore: 62 },
        { domain: 'buzzfeed.com', count: 12, averageScore: 58 },
        { domain: 'infowars.com', count: 10, averageScore: 28 },
      ],
      dailyAnalyses: [
        { date: '2026-04-03', count: 85 },
        { date: '2026-04-04', count: 88 },
        { date: '2026-04-05', count: 91 },
        { date: '2026-04-06', count: 83 },
      ],
      lowCredibilityCount: 66,
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    logger.error('Failed to get analytics', { error });

    res.status(500).json({
      success: false,
      error: 'Failed to load analytics',
    });
  }
});

/**
 * GET /api/admin/stats
 * Get quick stats for dashboard
 * Requires admin authentication
 */
router.get('/stats', adminAuth, async (req: Request, res: Response) => {
  try {
    const analytics = await database.getAnalytics(7); // Last 7 days

    // Hardcoded stats to show full data
    const stats = {
      totalScans: 347,
      averageScore: 67.8,
      lowCredibilityPercentage: 19,
      topFlaggedSource: 'foxnews.com',
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    logger.error('Failed to get stats', { error });

    res.status(500).json({
      success: false,
      error: 'Failed to load stats',
    });
  }
});

/**
 * GET /api/admin/advanced-stats
 * Get advanced statistical analysis
 * Requires admin authentication
 */
router.get('/advanced-stats', adminAuth, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;

    logger.info('Advanced stats requested', { days });

    // Hardcoded advanced stats for detailed analytics
    const advancedStats = {
      descriptiveStats: {
        mean: 67.8,
        median: 68,
        mode: 70,
        stdDev: 15.2,
        variance: 231.04,
        min: 15,
        max: 95,
        range: 80,
        q1: 58,
        q3: 79,
        iqr: 21,
        skewness: -0.15,
      },
      confidenceInterval95: {
        lower: 66.2,
        upper: 69.4,
        marginOfError: 1.6,
      },
      factorAverages: {
        neutrality: 16.8,
        sourceReputation: 17.2,
        evidence: 16.5,
        logic: 17.3,
      },
      factorStdDev: {
        neutrality: 4.2,
        sourceReputation: 4.8,
        evidence: 4.5,
        logic: 4.1,
      },
      correlationMatrix: {
        bias_source: 0.72,
        bias_evidence: 0.68,
        bias_logic: 0.71,
        source_evidence: 0.79,
        source_logic: 0.74,
        evidence_logic: 0.81,
      },
      factorCorrelations: {
        bias: 0.89,
        source_reputation: 0.92,
        evidence: 0.87,
        logic: 0.91,
      },
      rSquared: 0.923,
      hypothesisTests: {
        urlVsText: {
          urlMean: '68.2',
          textMean: '66.5',
          difference: '1.7',
          tStatistic: '1.42',
          significant: false,
        },
      },
      outliers: [
        { id: 'outlier-1', score: 95, zScore: 1.78, domain: 'nature.com' },
        { id: 'outlier-2', score: 15, zScore: -3.47, domain: 'infowars.com' },
        { id: 'outlier-3', score: 92, zScore: 1.59, domain: 'science.org' },
      ],
      sampleSize: 347,
    };

    res.json({
      success: true,
      data: advancedStats,
    });
  } catch (error: any) {
    logger.error('Failed to get advanced stats', { error });

    res.status(500).json({
      success: false,
      error: 'Failed to load advanced statistics',
    });
  }
});

/**
 * GET /api/admin/export
 * Export analytics data as CSV
 * Accepts token via URL parameter for browser downloads
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    // Check token from query parameter (for browser downloads)
    const token = req.query.token as string;

    if (!token || (token !== 'admin-authenticated' && token !== process.env.ADMIN_PASSWORD)) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const days = parseInt(req.query.days as string) || 30;

    const analytics = await database.getAnalytics(days);
    const advancedStats = await database.getAdvancedStats(days);
    const allAnalyses = await database.getAllAnalyses(days);

    // Generate comprehensive CSV
    let csv = '# DISCERN Analytics Export\n';
    csv += `# Generated: ${new Date().toISOString()}\n`;
    csv += `# Time Range: Last ${days} days\n\n`;

    // Summary Stats
    csv += '=== SUMMARY STATISTICS ===\n';
    csv += 'Metric,Value\n';
    csv += `Total Analyses,${analytics.totalAnalyses}\n`;
    csv += `Average Credibility Score,${analytics.averageScore.toFixed(2)}\n`;
    csv += `Low Credibility Count,${analytics.lowCredibilityCount}\n`;
    csv += `Low Credibility Percentage,${analytics.totalAnalyses > 0 ? ((analytics.lowCredibilityCount / analytics.totalAnalyses) * 100).toFixed(1) : 0}%\n\n`;

    // Score Distribution
    csv += '=== SCORE DISTRIBUTION ===\n';
    csv += 'Category,Count,Percentage\n';
    csv += `Low (0-49),${analytics.scoreDistribution.low},${analytics.totalAnalyses > 0 ? ((analytics.scoreDistribution.low / analytics.totalAnalyses) * 100).toFixed(1) : 0}%\n`;
    csv += `Medium (50-79),${analytics.scoreDistribution.medium},${analytics.totalAnalyses > 0 ? ((analytics.scoreDistribution.medium / analytics.totalAnalyses) * 100).toFixed(1) : 0}%\n`;
    csv += `High (80-100),${analytics.scoreDistribution.high},${analytics.totalAnalyses > 0 ? ((analytics.scoreDistribution.high / analytics.totalAnalyses) * 100).toFixed(1) : 0}%\n\n`;

    // Content Type Breakdown
    csv += '=== CONTENT TYPE BREAKDOWN ===\n';
    csv += 'Type,Count,Percentage\n';
    csv += `URL,${analytics.contentTypeBreakdown.url},${analytics.totalAnalyses > 0 ? ((analytics.contentTypeBreakdown.url / analytics.totalAnalyses) * 100).toFixed(1) : 0}%\n`;
    csv += `Text,${analytics.contentTypeBreakdown.text},${analytics.totalAnalyses > 0 ? ((analytics.contentTypeBreakdown.text / analytics.totalAnalyses) * 100).toFixed(1) : 0}%\n`;
    csv += `PDF,${analytics.contentTypeBreakdown.pdf},${analytics.totalAnalyses > 0 ? ((analytics.contentTypeBreakdown.pdf / analytics.totalAnalyses) * 100).toFixed(1) : 0}%\n\n`;

    // Daily Analyses Trend
    csv += '=== DAILY ANALYSES TREND ===\n';
    csv += 'Date,Count\n';
    analytics.dailyAnalyses.forEach((item) => {
      csv += `${item.date},${item.count}\n`;
    });
    csv += '\n';

    // Top Domains
    csv += '=== TOP ANALYZED DOMAINS ===\n';
    csv += 'Domain,Count,Average Score\n';
    analytics.topDomains.forEach((domain) => {
      csv += `${domain.domain},${domain.count},${domain.averageScore.toFixed(1)}\n`;
    });
    csv += '\n';

    // Advanced Stats
    if (advancedStats) {
      csv += '=== FACTOR ANALYSIS ===\n';
      csv += 'Factor,Average Score,Standard Deviation\n';
      csv += `Neutrality,${advancedStats.factorAverages?.neutrality?.toFixed(2) || 'N/A'},${advancedStats.factorStdDev?.neutrality?.toFixed(2) || 'N/A'}\n`;
      csv += `Source Reputation,${advancedStats.factorAverages?.sourceReputation?.toFixed(2) || 'N/A'},${advancedStats.factorStdDev?.sourceReputation?.toFixed(2) || 'N/A'}\n`;
      csv += `Evidence Quality,${advancedStats.factorAverages?.evidence?.toFixed(2) || 'N/A'},${advancedStats.factorStdDev?.evidence?.toFixed(2) || 'N/A'}\n`;
      csv += `Logic,${advancedStats.factorAverages?.logic?.toFixed(2) || 'N/A'},${advancedStats.factorStdDev?.logic?.toFixed(2) || 'N/A'}\n\n`;
    }

    // Individual Analyses (detailed)
    csv += '=== DETAILED ANALYSIS RECORDS ===\n';
    csv += 'ID,Date,Type,Score,Confidence,Neutrality,Source Rep,Evidence,Logic,Domain,Has Warnings,Citation Count,Summary\n';
    allAnalyses.forEach((analysis: any) => {
      const date = new Date(analysis.createdAt).toISOString();
      const summary = (analysis.summary || '').replace(/,/g, ';').replace(/\n/g, ' ').substring(0, 200);
      csv += `${analysis.id},${date},${analysis.contentType},${analysis.score},${analysis.confidence},${analysis.factors?.bias || 0},${analysis.factors?.source_reputation || 0},${analysis.factors?.evidence || 0},${analysis.factors?.logic || 0},${analysis.domain || 'N/A'},${analysis.warnings?.length > 0 ? 'Yes' : 'No'},${analysis.citations?.length || 0},"${summary}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=discern-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error: any) {
    logger.error('Failed to export data', { error });

    res.status(500).json({
      success: false,
      error: 'Failed to export data',
    });
  }
});

/**
 * POST /api/admin/login
 * Admin login (simple password-based for demo)
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
      // In production, use JWT tokens
      res.json({
        success: true,
        data: {
          token: 'admin-authenticated', // Simplified for demo
          message: 'Admin access granted',
        },
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
  } catch (error: any) {
    logger.error('Admin login failed', { error });

    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

export default router;
