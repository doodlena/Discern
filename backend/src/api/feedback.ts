import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/feedback
 * Submit user feedback for an analysis
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { analysisId, thumbsUp, comment } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        success: false,
        error: 'Analysis ID is required',
      });
    }

    // Validate that at least one feedback type is provided
    if (thumbsUp === undefined && !comment) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either a rating or comment',
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        analysisId,
        thumbsUp: thumbsUp !== undefined ? thumbsUp : null,
        comment: comment || null,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    logger.info('Feedback submitted', {
      feedbackId: feedback.id,
      analysisId,
      thumbsUp,
      hasComment: !!comment,
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error: any) {
    logger.error('Failed to submit feedback', { error });

    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback. Please try again.',
    });
  }
});

/**
 * GET /api/feedback/stats
 * Get feedback statistics (admin only - should add auth middleware)
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const allFeedback = await prisma.feedback.findMany({
      where: {
        createdAt: { gte: since },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalFeedback = allFeedback.length;
    const ratingsGiven = allFeedback.filter((f: any) => f.thumbsUp !== null).length;
    const thumbsUpCount = allFeedback.filter((f: any) => f.thumbsUp === true).length;
    const thumbsDownCount = allFeedback.filter((f: any) => f.thumbsUp === false).length;
    const satisfactionRate = ratingsGiven > 0
      ? Math.round((thumbsUpCount / ratingsGiven) * 100)
      : 0;

    const comments = allFeedback
      .filter((f: any) => f.comment)
      .slice(0, 50) // Latest 50 comments
      .map((f: any) => ({
        id: f.id,
        analysisId: f.analysisId,
        comment: f.comment,
        thumbsUp: f.thumbsUp,
        createdAt: f.createdAt,
      }));

    res.json({
      success: true,
      data: {
        totalFeedback,
        ratingsGiven,
        thumbsUpCount,
        thumbsDownCount,
        satisfactionRate,
        commentsCount: allFeedback.filter((f: any) => f.comment).length,
        recentComments: comments,
      },
    });
  } catch (error: any) {
    logger.error('Failed to get feedback stats', { error });

    res.status(500).json({
      success: false,
      error: 'Failed to get feedback statistics',
    });
  }
});

export default router;
