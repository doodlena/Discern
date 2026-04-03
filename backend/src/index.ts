import dotenv from 'dotenv';
// Load environment variables FIRST, before any other imports
dotenv.config();

// Debug: Check if API key is loaded
console.log('API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'YES (length: ' + process.env.ANTHROPIC_API_KEY.length + ')' : 'NO');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Import routes
import analyzeRoutes from './api/analyze';
import adminRoutes from './api/admin';
import healthRoutes from './api/health';

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 DISCERN Backend running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🌐 Frontend URL: ${FRONTEND_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
