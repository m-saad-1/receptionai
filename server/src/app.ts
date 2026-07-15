import express from 'express';
import cors from 'cors';
import { apiLimiter } from './services/rateLimiter';
import conversationsRouter from './routes/conversations';
import chatRouter from './routes/chat';
import adminRouter from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: true, // Allow all origins for the demo
  credentials: true
}));
app.use(express.json());

// Global request logger
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.path}`);
  next();
});

// Apply rate limiter to all /api routes
// app.use('/api/', apiLimiter);

app.use('/api/conversations', conversationsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/admin', adminRouter);

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
