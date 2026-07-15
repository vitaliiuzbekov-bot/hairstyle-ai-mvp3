import PQueuePkg from "p-queue";

const PQueue = (PQueuePkg as any).default || PQueuePkg;

// Helper function for automatic retry on 429/503 errors from external APIs
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      let msg = error.message || String(error);
      if (typeof msg === "object") {
          try { msg = JSON.stringify(msg); } catch(e){}
      }
      
      const isRetryable = msg.includes("503") || msg.includes("429") || msg.includes("DEADLINE_EXCEEDED") || msg.includes("unavailable") || msg.toLowerCase().includes("high demand") || msg.includes("socket hang up");
      
      if (attempt >= maxRetries || !isRetryable) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1); 
      console.warn(`[Retry] API failed with "${msg}". Retrying attempt ${attempt}/${maxRetries} in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("unreachable");
}

// Gemini API Queue: Free tier is 15 RPM.
export const geminiQueue = new PQueue({ 
  concurrency: 5 
});

// Yandex API Queue (or general default queue)
export const yandexQueue = new PQueue({ 
  concurrency: 4 
});

// Image Generation Queue (Fal AI / Yandex Art are heavy)
export const imageGenQueue = new PQueue({ 
  concurrency: 2 
});
