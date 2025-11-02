import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import documentRoutes from './routes/documents';
import assetRoutes from './routes/assets';
import blockchainRoutes from './routes/blockchain';
import aiRoutes from './routes/ai';
import marketplaceRoutes from './routes/marketplace';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'CastleGate Backend'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 CastleGate Backend running on port ${PORT}`);
  logger.info(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

