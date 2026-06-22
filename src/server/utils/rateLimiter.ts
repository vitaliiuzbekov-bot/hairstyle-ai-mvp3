import { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter per Telegram ID
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

function cleanupMap() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(key);
      }
    }
    lastCleanup = now;
  }
}

/**
 * Creates an express middleware to rate limit by generic userId (Telegram ID preferred)
 * @param windowMs Time window in milliseconds
 * @param maxRequests Maximum requests per windowMs
 */
export function createRateLimiter(windowMs: number, maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    cleanupMap();

    // Extract user identifier
    let userId = req.body.userId || req.body.tgUserId || req.query.tgUserId;
    
    // Fallback to IP if no user ID provided (e.g. for totally anonymous requests)
    if (!userId) {
       userId = req.ip || req.headers['x-forwarded-for'] || "anonymous";
    }
    
    if (Array.isArray(userId)) userId = userId[0];

    const now = Date.now();
    const key = `${req.path}:${userId}`;

    const limitData = rateLimitMap.get(key);

    if (!limitData || now > limitData.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (limitData.count >= maxRequests) {
      console.warn(`[RateLimit] User/IP ${userId} exceeded limit on ${req.path}`);
      return res.status(429).json({ 
        error: "Слишком много запросов. Пожалуйста, подождите немного перед следующей попыткой.", 
        retryAfterMs: limitData.resetTime - now 
      });
    }

    limitData.count++;
    next();
  };
}
