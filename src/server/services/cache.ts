import crypto from "crypto";

const memoryCache = new Map<string, { value: any; expiry: number }>();

export const getCacheKey = (payload: any): string => {
  const str = JSON.stringify(payload);
  return crypto.createHash("sha256").update(str).digest("hex");
};

export const getCachedValue = async <T>(key: string): Promise<T | null> => {
  // if REDIS_URL exists, we could use redis here
  const cached = memoryCache.get(key);
  if (cached) {
    if (Date.now() > cached.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return cached.value as T;
  }
  return null;
};

export const setCachedValue = async (key: string, value: any, ttlSeconds: number): Promise<void> => {
  // if REDIS_URL exists, we could use redis here
  const expiry = Date.now() + ttlSeconds * 1000;
  memoryCache.set(key, { value, expiry });
};
