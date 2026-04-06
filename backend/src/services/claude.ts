import Anthropic from '@anthropic-ai/sdk';
import logger from '../utils/logger';
import { AnalysisResult, ContentType, ProcessingStep } from '@discern/shared/types';

const MODEL = 'claude-sonnet-4-6';

// Lazy initialization of client to ensure env vars are loaded
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('Creating Anthropic client, API key present:', !!apiKey, 'Length:', apiKey?.length);

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    client = new Anthropic({
      apiKey: apiKey,
    });
    console.log('Anthropic client created successfully');
  }
  return client;
}

/**
 * Claude API Service for DISCERN
 * Handles all AI-powered credibility analysis
 */
export class ClaudeService {
  /**
   * Analyze content for credibility using Claude
   */
  async analyzeContent(
    content: string,
    contentType: ContentType,
    explainabilityMode: boolean = false,
    analysisMode: 'brief' | 'detailed' = 'brief'
  ): Promise<AnalysisResult> {
    const startTime = Date.now();
    const processingSteps: ProcessingStep[] = [];

    try {
      const systemPrompt = this.buildSystemPrompt(analysisMode);
      const userPrompt = this.buildAnalysisPrompt(content, contentType, explainabilityMode, analysisMode);

      if (explainabilityMode) {
        processingSteps.push({
          step: 'prompt_construction',
          description: 'Building structured analysis prompt',
          timestamp: Date.now() - startTime,
        });
      }

      logger.info(`Analyzing ${contentType} content with Claude`, {
        contentLength: content.length,
        explainabilityMode,
      });

      // Adjust max_tokens based on analysis mode
      const maxTokens = analysisMode === 'detailed' ? 2500 : 1500;

      const response = await getClient().messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        temperature: 0.2, // Lower temperature to reduce hallucination in citations
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      if (explainabilityMode) {
        processingSteps.push({
          step: 'claude_analysis',
          description: 'Claude AI processing and analysis',
          timestamp: Date.now() - startTime,
          details: {
            model: MODEL,
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
        });
      }

      const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      const result = this.parseClaudeResponse(responseText);

      if (explainabilityMode) {
        result.processingSteps = processingSteps;
        processingSteps.push({
          step: 'result_parsing',
          description: 'Parsing and structuring analysis results',
          timestamp: Date.now() - startTime,
        });
      }

      logger.info(`Analysis complete`, {
        score: result.score,
        confidence: result.confidence,
        processingTime: Date.now() - startTime,
      });

      return result;
    } catch (error: any) {
      logger.error('Claude analysis failed', {
        error: error.message,
        stack: error.stack,
        details: error
      });
      throw new Error(error.message || 'AI analysis failed. Please try again.');
    }
  }

  /**
   * Build system prompt for credibility analysis
   */
  private buildSystemPrompt(analysisMode: 'brief' | 'detailed' = 'brief'): string {
    const citationLimit = analysisMode === 'detailed' ? '4-6' : '2-3';
    const explanationLength = analysisMode === 'detailed' ? 'detailed' : 'very brief (one short sentence)';

    return `You are DISCERN, an AI-powered credibility assessment system designed for the Presidential AI Challenge. Your purpose is to analyze content and provide transparent, explainable credibility scores.

# Analysis Mode: ${analysisMode.toUpperCase()}
${analysisMode === 'brief' ? '- Focus on speed and essential information\n- Concise explanations\n- 2-3 key citations' : '- Comprehensive analysis\n- Detailed explanations\n- 4-6 supporting citations'}

# Your Mission
Help users identify reliable information by:
- Assessing source reputation and authority
- Evaluating neutrality vs. bias and emotional manipulation
- Evaluating evidence quality and citations
- Checking logical consistency

# Scoring Framework (0-100 scale)

You must score content across 4 factors (each worth 0-25 points):

1. **Neutrality** (0-25, higher score = more neutral)
   - 25: Neutral, fact-based language
   - 12-15: Slight editorial tone but balanced
   - 5-10: Clear bias, emotional language
   - 0-4: Extreme bias, propaganda techniques

2. **Source Reputation** (0-25)
   - 25: Peer-reviewed journals, established institutions
   - 15-20: Reputable news organizations, verified experts
   - 8-14: Mixed credibility, some verification
   - 0-7: Unknown sources, no credentials

3. **Evidence Quality** (0-25)
   - 25: Multiple high-quality sources, data, citations
   - 15-20: Some credible sources and data
   - 8-14: Few sources, questionable quality
   - 0-7: No sources, anecdotal only

4. **Logical Consistency** (0-25)
   - 25: Sound reasoning, no contradictions
   - 15-20: Generally logical with minor gaps
   - 8-14: Some logical fallacies present
   - 0-7: Major contradictions, poor reasoning

# Confidence Levels
- **High**: Factors are consistent, clear evidence
- **Medium**: Mixed signals, some uncertainty
- **Low**: Conflicting indicators, limited data

# Critical Rules
1. **Transparency**: Always explain your reasoning
2. **Nuance**: Avoid absolute judgments; acknowledge complexity
3. **Cross-verification**: Before flagging claims as extraordinary or unusual, verify against current events and recent news
4. **Citations**: Provide ${citationLimit} citations when possible, but prioritize accuracy over quantity
5. **Warnings**:
   - Flag potential misinformation, health claims, or conspiracy theories
   - For breaking news or rapidly evolving events: Add warning that "Rapidly evolving events may have limited verification sources and are subject to change"
   - Do NOT flag recent events as "future" or "unlikely" without verification
6. **Ethics**: Remind users this is AI-assisted analysis, not absolute truth

# Citation Integrity - CRITICAL ANTI-HALLUCINATION RULES
**NEVER fabricate or invent information. Honesty over completeness.**

STRICT RULES for citations:
1. **NO Fake URLs**: NEVER create made-up URLs. If you don't know the actual URL, omit the "url" field entirely or use null
2. **NO Fake Source Names**: Do NOT invent specific article titles, author names, or publication names. Use general descriptions like "Major news outlets report..." if uncertain
3. **Be Honest About Uncertainty**: If you cannot verify a claim with specific sources, use phrases like:
   - "claim": "Unable to independently verify this specific claim"
   - "source": "General knowledge / Unable to verify specific source"
   - "reliability": "low"
   - "supports": false
4. **Real vs. Hypothetical**: Only cite sources you have actual knowledge of. If reasoning from general knowledge of a domain's reputation (e.g., "Reuters is generally credible"), that's acceptable, but don't fabricate specific articles
5. **Reduce Citations If Needed**: If you can only find ${citationLimit === '4-6' ? '2-3' : '1-2'} legitimate citations, provide those instead of inventing fake ones to meet the quota
6. **Domain Analysis**: You CAN assess the general credibility of a news domain (e.g., "Reuters is a high-credibility wire service") without citing specific articles
7. **Contextual Claims**: For claims made IN the content you're analyzing, you can quote those claims without needing external verification - just mark reliability as "low" and supports as "false" if unverifiable

**Priority Order**: Honesty > Completeness > Meeting citation count

If content makes unverifiable claims, it's better to have 1-2 honest citations saying "cannot verify" than 4-6 made-up sources.

# Output Format
You MUST respond with valid JSON only:

{
  "score": <0-100>,
  "confidence": "low" | "medium" | "high",
  "summary": "<2-3 sentence explanation of credibility assessment>",
  "citations": [
    {
      "claim": "<key claim from content>",
      "source": "<credible source name>",
      "reliability": "low" | "medium" | "high",
      "reliabilityReason": "<1 sentence explaining why this reliability rating>",
      "supports": true | false,
      "supportsReason": "<1 sentence explaining how it supports or contradicts>",
      "excerpt": "<optional relevant quote>",
      "url": "<optional source URL>"
    }
  ],
  "factors": {
    "bias": <0-25>,
    "source_reputation": <0-25>,
    "evidence": <0-25>,
    "logic": <0-25>
  },
  "warnings": ["<optional warning messages>"],
  "articleCitation": {
    "apa": "<APA 7th edition formatted citation>",
    "mla": "<MLA 9th edition formatted citation>"
  }
}

IMPORTANT CITATION REQUIREMENTS:
- **Target**: ${citationLimit} citations when verifiable sources exist
- **Minimum**: Provide at least 1-2 citations, even if you must note "Unable to verify"
- **NO FABRICATION**: Never invent URLs, specific article titles, or author names
- **Honesty**: If uncertain, use general descriptions or mark as "Unable to verify specific source"
- For each citation, you MUST include:
  - "reliabilityReason": ${explanationLength.charAt(0).toUpperCase() + explanationLength.slice(1)} explanation of why this reliability rating
  - "supportsReason": ${explanationLength.charAt(0).toUpperCase() + explanationLength.slice(1)} explanation of how it supports or contradicts
- **Quality over Quantity**: 2 honest citations > 6 fabricated ones`;
  }

  /**
   * Build user prompt for specific content analysis
   */
  private buildAnalysisPrompt(
    content: string,
    contentType: ContentType,
    explainabilityMode: boolean,
    analysisMode: 'brief' | 'detailed' = 'brief'
  ): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    let prompt = `Today's date: ${today}\n\n`;
    prompt += `Analyze the following ${contentType} content for credibility:\n\n`;

    if (contentType === 'url') {
      prompt += `Content from URL:\n`;
    } else if (contentType === 'pdf') {
      prompt += `Content extracted from PDF document:\n`;
    } else {
      prompt += `Text content:\n`;
    }

    prompt += `---\n${content}\n---\n\n`;

    if (explainabilityMode) {
      prompt += `EXPLAINABILITY MODE: Provide extra detail in your analysis. In the summary, briefly explain your reasoning for each scoring factor.\n\n`;
    }

    prompt += `IMPORTANT GUIDELINES:
1. **Current Events Awareness**: Consider that this content may discuss recent or breaking news events. Do NOT flag claims as extraordinary, impossible, or "future events" without first considering if they could be legitimate current events.

2. **Breaking News Handling**: For rapidly evolving or breaking news stories:
   - Apply appropriate scrutiny but acknowledge time-sensitive nature
   - Include warning: "Rapidly evolving events may have limited verification sources and are subject to change"
   - Do NOT penalize legitimate recent events for lack of extensive historical sources

3. **Academic Citations**: Generate properly formatted citations:
   - Extract the title, author(s), publication date, publisher/domain, and URL from the content
   - Format an APA 7th edition citation
   - Format an MLA 9th edition citation
   - Use today's date (${today}) as the access date for web articles
   - If author is unknown, start with the title
   - Use proper formatting (italics for titles, punctuation, etc.)

Provide your credibility assessment as JSON only. No additional text outside the JSON.`;

    return prompt;
  }

  /**
   * Parse Claude's JSON response
   */
  private parseClaudeResponse(responseText: string): AnalysisResult {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate structure
      if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 100) {
        throw new Error('Invalid score');
      }

      return {
        score: Math.round(parsed.score),
        confidence: parsed.confidence || 'medium',
        summary: parsed.summary || 'Analysis completed',
        citations: Array.isArray(parsed.citations) ? parsed.citations : [],
        factors: {
          bias: parsed.factors?.bias || 0,
          source_reputation: parsed.factors?.source_reputation || 0,
          evidence: parsed.factors?.evidence || 0,
          logic: parsed.factors?.logic || 0,
        },
        warnings: parsed.warnings || [],
        articleCitation: parsed.articleCitation || undefined,
      };
    } catch (error) {
      logger.error('Failed to parse Claude response', { error, responseText });

      // Return fallback result
      return {
        score: 50,
        confidence: 'low',
        summary: 'Unable to complete full analysis. Please try again.',
        citations: [],
        factors: {
          bias: 12,
          source_reputation: 12,
          evidence: 12,
          logic: 12,
        },
        warnings: ['Analysis parsing error occurred'],
      };
    }
  }
}

export default new ClaudeService();
