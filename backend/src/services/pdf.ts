import pdf from 'pdf-parse';
import logger from '../utils/logger';
import { MAX_PDF_SIZE } from '@discern/shared/constants';

/**
 * PDF Processing Service
 * Extracts text content from PDF documents
 */
export class PdfService {
  /**
   * Extract text from PDF buffer
   */
  async extractText(buffer: Buffer): Promise<string> {
    try {
      // Validate size
      if (buffer.length > MAX_PDF_SIZE) {
        throw new Error(`PDF exceeds maximum size of ${MAX_PDF_SIZE / 1024 / 1024}MB`);
      }

      logger.info('Extracting text from PDF', {
        size: buffer.length,
      });

      const data = await pdf(buffer);

      const extractedText = data.text;

      // Clean up extracted text
      const cleanedText = this.cleanExtractedText(extractedText);

      logger.info('PDF text extraction complete', {
        pages: data.numpages,
        textLength: cleanedText.length,
      });

      return cleanedText;
    } catch (error) {
      logger.error('PDF extraction failed', { error });
      throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF document.');
    }
  }

  /**
   * Parse base64 PDF string to buffer
   */
  parseBase64(base64String: string): Buffer {
    try {
      // Remove data URL prefix if present
      const base64Data = base64String.replace(/^data:application\/pdf;base64,/, '');
      return Buffer.from(base64Data, 'base64');
    } catch (error) {
      logger.error('Failed to parse base64 PDF', { error });
      throw new Error('Invalid PDF data format');
    }
  }

  /**
   * Clean and normalize extracted text
   */
  private cleanExtractedText(text: string): string {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove page numbers and headers/footers (common patterns)
      .replace(/Page \d+ of \d+/gi, '')
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      // Remove multiple consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim
      .trim();
  }

  /**
   * Extract metadata from PDF
   */
  async extractMetadata(buffer: Buffer): Promise<{
    title?: string;
    author?: string;
    pages: number;
    creationDate?: Date;
  }> {
    try {
      const data = await pdf(buffer);

      return {
        title: data.info?.Title,
        author: data.info?.Author,
        pages: data.numpages,
        creationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
      };
    } catch (error) {
      logger.error('Failed to extract PDF metadata', { error });
      return { pages: 0 };
    }
  }
}

export default new PdfService();
