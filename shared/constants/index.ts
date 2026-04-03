// Constants for DISCERN Platform

export const CREDIBILITY_THRESHOLDS = {
  LOW: 0,
  MEDIUM: 50,
  HIGH: 80,
} as const;

export const SCORING_WEIGHTS = {
  BIAS: 25,
  SOURCE_REPUTATION: 25,
  EVIDENCE: 25,
  LOGIC: 25,
} as const;

export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_TEXT_LENGTH = 50000; // characters
export const MAX_URL_LENGTH = 2048;

export const CACHE_TTL = 3600; // 1 hour in seconds

export const RATE_LIMITS = {
  ANALYSIS_PER_HOUR: 50,
  ANALYSIS_PER_DAY: 200,
} as const;

export const DEMO_ARTICLES = [
  {
    id: 'demo-1',
    title: 'Climate Change: IPCC Sixth Assessment Report Summary',
    url: 'https://www.ipcc.ch/report/ar6/',
    category: 'science' as const,
    expectedScore: 95,
  },
  {
    id: 'demo-2',
    title: 'Opinion: Why We Should Ignore Climate Science',
    url: 'https://example.com/fake-climate-denial',
    category: 'misinformation' as const,
    expectedScore: 15,
  },
  {
    id: 'demo-3',
    title: 'Reuters: Global Markets Update',
    url: 'https://www.reuters.com/markets/',
    category: 'news' as const,
    expectedScore: 85,
  },
  {
    id: 'demo-4',
    title: 'Blog Post: Miracle Cure for All Diseases Discovered!',
    url: 'https://example.com/fake-cure',
    category: 'misinformation' as const,
    expectedScore: 8,
  },
];

export const PROCESSING_STEPS = {
  EXTRACTING: 'Extracting content',
  ANALYZING_BIAS: 'Analyzing bias and language',
  CHECKING_SOURCE: 'Evaluating source reputation',
  VERIFYING_EVIDENCE: 'Verifying evidence and citations',
  ASSESSING_LOGIC: 'Assessing logical consistency',
  GENERATING_CITATIONS: 'Generating supporting citations',
  CALCULATING_SCORE: 'Calculating final credibility score',
} as const;

export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL provided',
  PDF_TOO_LARGE: 'PDF file exceeds maximum size (10MB)',
  TEXT_TOO_LONG: 'Text content exceeds maximum length',
  ANALYSIS_FAILED: 'Analysis failed. Please try again.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access',
  SERVER_ERROR: 'Internal server error',
} as const;

export const COLOR_SCHEME = {
  HIGH_CREDIBILITY: '#10b981', // green
  MEDIUM_CREDIBILITY: '#f59e0b', // yellow
  LOW_CREDIBILITY: '#ef4444', // red
  NEUTRAL: '#6b7280', // gray
} as const;
