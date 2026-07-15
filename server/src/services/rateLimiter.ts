import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: { error: 'TOO_MANY_REQUESTS', message: 'Too many requests from this IP, please try again after an hour' },
  standardHeaders: true, 
  legacyHeaders: false, 
});
