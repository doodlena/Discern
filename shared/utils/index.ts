import crypto from 'crypto';

/**
 * Generate a hash for content caching
 */
export function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Determine credibility level from score
 */
export function getCredibilityLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

/**
 * Get color for credibility score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // green
  if (score >= 50) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate confidence level based on various factors
 */
export function calculateConfidence(
  factors: { bias: number; source_reputation: number; evidence: number; logic: number }
): 'low' | 'medium' | 'high' {
  const variance = Math.max(
    Math.abs(factors.bias - 12.5),
    Math.abs(factors.source_reputation - 12.5),
    Math.abs(factors.evidence - 12.5),
    Math.abs(factors.logic - 12.5)
  );

  if (variance > 10) return 'low';
  if (variance > 5) return 'medium';
  return 'high';
}

/**
 * Sanitize text input
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Parse PDF base64 string
 */
export function parsePdfBase64(base64: string): Buffer {
  const base64Data = base64.replace(/^data:application\/pdf;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

/**
 * Validate analysis request
 */
export function validateAnalysisRequest(request: any): {
  valid: boolean;
  error?: string;
} {
  if (!request.type || !['url', 'text', 'pdf'].includes(request.type)) {
    return { valid: false, error: 'Invalid content type' };
  }

  if (!request.content) {
    return { valid: false, error: 'Content is required' };
  }

  if (request.type === 'url' && !isValidUrl(request.content)) {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (request.type === 'text' && request.content.length > 50000) {
    return { valid: false, error: 'Text exceeds maximum length' };
  }

  return { valid: true };
}
