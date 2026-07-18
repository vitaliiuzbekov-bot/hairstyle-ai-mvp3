# Current State
- Bypassed polling and async Telegram logic completely for generation results.
- `generate-full/start` is now completely synchronous: it waits for the generation to finish and then returns `{ status: 'completed', result: { imageUrl, originalUrl, referenceImage } }`.
- In `src/hooks/useAnalysis.ts`, we write the response directly to `localStorage.setItem('lastGeneratedImage', data.imageUrl)` and `lastOriginalImage`.
- In `src/components/HomePage.tsx`, `useEffect` reads `lastGeneratedImage` on mount and restores the UI state (sets `vtonResultUrl` and `imageUrl`).
- In `src/App.tsx` and `src/components/ImageSlider.tsx`, we unconditionally try to read from `localStorage` to fallback or override `resultImage` so the slider always has the latest images when opening the app.
- Added `showGenerationResult` CustomEvent that `useAnalysis` listens to, ensuring that if the app is opened with `lastGenerationResult`, the slider updates automatically.
- Telegram URL in `generate.ts` now sends `?imageUrl=...&originalUrl=...` to ensure context is passed when opening from chat.

# Known Issues
- Because generation is now synchronous, the HTTP connection could time out if it exceeds the Telegram WebView / Cloud Run timeout (around 60s usually, but sometimes less). The user must keep the WebApp open.

# Latest Fixes
- Fixed `useEffect is not defined` error in `src/hooks/useAnalysis.ts` (added missing import).
- Restored missing `loadLastGeneration` destructuring in `src/App.tsx`.
