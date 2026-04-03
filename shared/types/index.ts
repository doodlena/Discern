// Core Types for DISCERN Platform

export type ContentType = 'url' | 'text' | 'pdf';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type CitationReliability = 'low' | 'medium' | 'high';

export interface AnalysisRequest {
  type: ContentType;
  content: string; // URL, text, or base64 PDF
  demoMode?: boolean;
  explainabilityMode?: boolean;
}

export interface Citation {
  claim: string;
  source: string;
  reliability: CitationReliability;
  reliabilityReason?: string; // Explanation of reliability rating
  supports: boolean; // true = supports claim, false = contradicts
  supportsReason?: string; // Explanation of support/contradict
  excerpt?: string;
  url?: string;
}

export interface ScoringFactors {
  bias: number; // 0-25 (lower is better, less bias)
  source_reputation: number; // 0-25
  evidence: number; // 0-25
  logic: number; // 0-25
}

export interface AnalysisResult {
  id?: string;
  score: number; // 0-100
  confidence: ConfidenceLevel;
  summary: string;
  citations: Citation[];
  factors: ScoringFactors;
  warnings?: string[];
  processingSteps?: ProcessingStep[];
  createdAt?: Date;
  articleCitation?: {
    apa: string;
    mla: string;
  };
}

export interface ProcessingStep {
  step: string;
  description: string;
  timestamp: number;
  details?: any;
}

export interface AnalyticsMetrics {
  totalAnalyses: number;
  averageScore: number;
  scoreDistribution: {
    low: number; // 0-49
    medium: number; // 50-79
    high: number; // 80-100
  };
  contentTypeBreakdown: {
    url: number;
    text: number;
    pdf: number;
  };
  topDomains: Array<{
    domain: string;
    count: number;
    averageScore: number;
  }>;
  dailyAnalyses: Array<{
    date: string;
    count: number;
  }>;
  lowCredibilityCount: number; // score < 50
}

export interface DemoArticle {
  id: string;
  title: string;
  url: string;
  category: 'news' | 'science' | 'opinion' | 'misinformation';
  expectedScore: number;
  cachedResult: AnalysisResult;
}

export interface AdminStats extends AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  citationReliabilityTrends: Array<{
    date: string;
    highReliability: number;
    mediumReliability: number;
    lowReliability: number;
  }>;
}

// Database Models
export interface Analysis {
  id: string;
  contentType: ContentType;
  contentHash: string; // for caching
  originalContent: string;
  result: AnalysisResult;
  demoMode: boolean;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface User {
  id: string;
  email?: string;
  isAdmin: boolean;
  createdAt: Date;
  lastActiveAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StreamingProgress {
  step: string;
  progress: number; // 0-100
  message: string;
}
