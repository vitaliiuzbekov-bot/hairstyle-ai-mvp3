import crypto from "crypto";
import { adminDb } from "../firebase";

const memoryCache = new Map<string, { value: any; expiry: number }>();

export const getCacheKey = (payload: any): string => {
  const str = JSON.stringify(payload);
  return crypto.createHash("sha256").update(str).digest("hex");
};

let persistentCacheDisabled = false;

export const getCachedValue = async <T>(key: string): Promise<T | null> => {
  // First check memory cache
  const cached = memoryCache.get(key);
  if (cached) {
    if (Date.now() > cached.expiry) {
      memoryCache.delete(key);
    } else {
      return cached.value as T;
    }
  }

  // Check persistent Firestore cache if adminDb is available
  if (adminDb && !persistentCacheDisabled) {
    try {
      const doc = await adminDb.collection("generation_cache").doc(key).get();
      if (doc.exists) {
        const data = doc.data();
        if (data && data.expiry && Date.now() < data.expiry) {
          // Restore to memory cache
          memoryCache.set(key, { value: data.value, expiry: data.expiry });
          return data.value as T;
        } else {
          // Expired in persistent DB
          adminDb.collection("generation_cache").doc(key).delete().catch(e => {
            if (e.code === 7) persistentCacheDisabled = true;
          });
        }
      }
    } catch (e: any) {
      if (e.code === 7) {
        persistentCacheDisabled = true;
      } else {
        console.warn("Failed to read from persistent cache", e);
      }
    }
  }
  
  return null;
};

export const setCachedValue = async (key: string, value: any, ttlSeconds: number): Promise<void> => {
  const expiry = Date.now() + ttlSeconds * 1000;
  
  // Set memory cache
  memoryCache.set(key, { value, expiry });

  // Set persistent Firestore cache if adminDb is available
  if (adminDb && !persistentCacheDisabled) {
    try {
      // Don't wait for write to finish to avoid blocking
      adminDb.collection("generation_cache").doc(key).set({
        value,
        expiry
      }).catch((e: any) => {
        if (e.code === 7) {
          persistentCacheDisabled = true;
        } else {
          console.warn("Failed to write to persistent cache", e);
        }
      });
    } catch (e: any) {
      if (e.code === 7) {
        persistentCacheDisabled = true;
      } else {
        console.warn("Failed to write to persistent cache", e);
      }
    }
  }
};
