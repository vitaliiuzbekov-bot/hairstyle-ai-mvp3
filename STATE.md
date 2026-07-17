# Current State
- Bypassed polling and async Telegram logic completely for generation results.
- `generate-full/start` is now completely synchronous: it waits for the generation to finish and then returns `{ status: 'completed', result: { imageUrl, originalUrl, referenceImage } }`.
- In `src/hooks/useAnalysis.ts`, we now write the response directly to `localStorage.setItem('lastResult', ...)`.
- In `src/App.tsx` and `src/components/ImageSlider.tsx`, we unconditionally try to read from `localStorage.getItem('lastResult')` to fallback or override `resultImage`.
- No polling, no URL-dependent logic inside Telegram WebView.

# Known Issues
- Because generation is now synchronous, the HTTP connection could time out if it exceeds the Telegram WebView / Cloud Run timeout (around 60s usually, but sometimes less). The user must keep the WebApp open.
