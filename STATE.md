# Current State

- Implemented Ports & Adapters (Hexagonal Architecture) for image generation: `ImageGenerationProvider` interface, `FalAdapter` implementation, and `ImageGenerationService` injection.
- Replaced direct `fetch` calls to Fal.ai in `generate.ts` with calls to `defaultImageService.generateBaseImage()` and `swapFace()`.
- Implemented idempotency checks in `billing.ts` to prevent duplicate token deductions during retries or race conditions.
- Improved error handling in `generate.ts` (removed silent catch blocks).
- Cleaned up root directory from temporary `patch_*.cjs` and `.py` scripts.
- Unit tests introduced using `vitest` (e.g. `billing.test.ts`).

# Known Issues
- Because generation is synchronous, the HTTP connection could time out if it exceeds the Telegram WebView / Cloud Run timeout (around 60s usually).
