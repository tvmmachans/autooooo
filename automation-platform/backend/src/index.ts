import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './database/index.js';
import authRoutes from './routes/authRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);

// Import additional routes
import mediaRoutes from './routes/mediaRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
app.use('/api/media', mediaRoutes);
app.use('/api/api', apiRoutes);
app.use('/api/settings', settingsRoutes);

// Error handler (must be last)
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler is now imported above

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
