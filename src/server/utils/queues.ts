import PQueue from "p-queue";

// Gemini API Queue: Free tier is 15 RPM.
export const geminiQueue = new PQueue({ 
  concurrency: 2, 
  intervalCap: 15, 
  interval: 60 * 1000, 
  carryoverConcurrencyCount: true 
});

// Yandex API Queue (or general default queue)
export const yandexQueue = new PQueue({ 
  concurrency: 4 
});

// Image Generation Queue (Fal AI / Yandex Art are heavy)
export const imageGenQueue = new PQueue({ 
  concurrency: 2 
});
