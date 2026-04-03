import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../utils/logger';
import { MAX_URL_LENGTH } from '@discern/shared/constants';

/**
 * Content Extraction Service
 * Fetches and extracts content from URLs
 */
export class ContentExtractorService {
  private readonly userAgent = 'DISCERN-Bot/1.0 (Credibility Analysis)';
  private readonly timeout = 15000; // 15 seconds

  /**
   * Fetch and extract main content from URL
   */
  async extractFromUrl(url: string): Promise<{
    content: string;
    title: string;
    domain: string;
  }> {
    try {
      // Validate URL
      if (url.length > MAX_URL_LENGTH) {
        throw new Error('URL exceeds maximum length');
      }

      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      logger.info('Fetching content from URL', { url, domain });

      // Fetch page
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
        },
        timeout: this.timeout,
        maxRedirects: 5,
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract title
      const title = this.extractTitle($);

      // Extract main content
      const content = this.extractMainContent($);

      if (!content || content.length < 100) {
        throw new Error('Insufficient content extracted from URL');
      }

      logger.info('Content extraction complete', {
        domain,
        contentLength: content.length,
        title,
      });

      return {
        content,
        title,
        domain,
      };
    } catch (error: any) {
      logger.error('URL content extraction failed', {
        url,
        error: error.message,
      });

      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Unable to reach the website. Please check the URL and try again.');
      }

      if (error.code === 'ETIMEDOUT') {
        throw new Error('Website took too long to respond. The site may be down or blocking automated access.');
      }

      if (error.response?.status === 404) {
        throw new Error('Page not found (404). Please verify the URL is correct.');
      }

      if (error.response?.status === 403 || error.response?.status === 401) {
        throw new Error('⛔ This website is blocking web scraping. Try copying the article text and pasting it into the "Text" tab instead.');
      }

      if (error.response?.status === 429) {
        throw new Error('Too many requests to this website. Try copying the article text and using the "Text" tab instead.');
      }

      if (error.response?.status >= 500) {
        throw new Error('The website is experiencing server issues. Try again later or use the "Text" tab.');
      }

      throw new Error('Unable to extract content from this URL. Try copying the article text and using the "Text" tab instead.');
    }
  }

  /**
   * Extract page title
   */
  private extractTitle($: cheerio.CheerioAPI): string {
    // Try various title sources
    let title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      'Untitled';

    return title.trim();
  }

  /**
   * Extract main content from page
   */
  private extractMainContent($: cheerio.CheerioAPI): string {
    // Remove unwanted elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('header').remove();
    $('footer').remove();
    $('aside').remove();
    $('.advertisement').remove();
    $('.ad').remove();
    $('.sidebar').remove();
    $('.comments').remove();

    // Try to find main content area
    let content = '';

    // Common content selectors
    const contentSelectors = [
      'article',
      '[role="main"]',
      'main',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      '#content',
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }

    // Fallback to body if no content found
    if (!content || content.length < 100) {
      content = $('body').text();
    }

    // Clean up content
    return this.cleanExtractedContent(content);
  }

  /**
   * Clean extracted content
   */
  private cleanExtractedContent(text: string): string {
    return text
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove multiple spaces
      .replace(/ {2,}/g, ' ')
      // Trim
      .trim()
      // Limit length
      .substring(0, 50000);
  }

  /**
   * Check if URL is accessible
   */
  async checkUrlAccessibility(url: string): Promise<boolean> {
    try {
      await axios.head(url, {
        timeout: 5000,
        maxRedirects: 3,
      });
      return true;
    } catch {
      return false;
    }
  }
}

export default new ContentExtractorService();
