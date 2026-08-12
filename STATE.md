# Current State

## Stack
React 18+ with TypeScript, Vite, Express.js backend (server.ts), Firebase Admin (Firestore + Storage), Telegram Bot API.

## Recent Actions
- Investigated why the final photo was not arriving on the frontend despite Fal.ai succeeding.
- Found that the Google AI Studio testing environment's Application Default Credentials lack permissions to write to Firestore (`PERMISSION_DENIED`), causing the background job update to fail silently.
- Restored `jobMap` as a fallback memory cache in `generate.ts`. This ensures that even if Firestore `adminDb` throws a permission error in the sandbox, the frontend polling still retrieves the successful result.
- Fixed `firebase.ts` to properly parse `FIREBASE_SERVICE_ACCOUNT_BASE64` from environment variables, ensuring that when deployed to Render, the Firestore integration will work correctly.
- Increased the frontend polling timeout in `api.ts` from 120 seconds to 300 seconds to prevent premature timeouts during long generations.
- Ensured `originalUrl` is properly saved to Firestore and returned to the frontend so `localStorage` history updates correctly.

## Current Pending Architectural Improvements
- Ensure Render deployment includes `FIREBASE_SERVICE_ACCOUNT_BASE64`.
- **CRITICAL BUG FIX**: The `jobMap.set` was accidentally empty inside the `finally` block in `generate.ts`. This caused the job state to stay in "processing" indefinitely in the fallback cache. The client kept polling until timeout. Fixed this so `jobMap` correctly receives the `done` status. Testing in AI Studio will now work smoothly again.
- **BUG FIX**: The generated PDF for the "Barber Blueprint" (Техническая карта) was slightly cut off on the right side on mobile devices or narrow windows.
  - The root cause was that `html2canvas` limits its capture area based on `document.body.style.width = '100%'`, which on mobile restricts the width to a value smaller than the required `794px` (A4 format).
  - Fixed it in `pdfExport.ts` by explicitly setting `width: 794px` on `clonedDoc.body` and `clonedDoc.documentElement` instead of `100%`, and setting `width` and `windowWidth` to `794` in `html2canvas` options.
  - Also enforced `width: 794px !important; overflow: hidden;` on `.pdf-page` to guarantee layout containment.
## Final Pre-Deployment Checks
- Removed debug routes (debug-jobs, debug-users, debug-adc).
- Verified `html2pdf.js` fixes for generating PDFs without cutoff.
- `npm run lint` and `npm run build` passed successfully.
- Checked environment variables usage.
- **BUG FIX**: The "Связь с разработчиком" link in PRO mode didn't work in Telegram because `target="_blank"` is intercepted by the Telegram Web App browser in a way that sometimes blocks it. Replaced the `<a>` tag with a `<span>` and an `onClick` handler that calls `Telegram.WebApp.openTelegramLink` (or fallback to `openLink` / `window.open`). This ensures external links open natively in Telegram.

## Recent Actions (Analytics & UI Tweaks)
- Added `/stats` command handling to the Telegram webhook (`src/server/routes/auth.ts`). When the user sends `/stats` directly to the bot, it returns a breakdown of unique users, generations, shares, and purchases per acquisition source. This allows the admin to view analytics directly in Telegram without needing a web dashboard.
- Redesigned `WelcomeModal.tsx` to provide clear, step-by-step onboarding instructions (1. Take photo, 2. Get AI Analysis, 3. Choose & Try On) instead of the previous vague marketing slides.
- Fixed the "Связь с разработчиком" link on `HomePage.tsx`. Updated `src/utils/telegram.ts` (`openUrlInTelegram`) to explicitly try `tg.openTelegramLink`, fallback to `tg.openLink(..., { try_instant_view: false })`, and finally fallback to `window.location.href`. This resolves issues where Telegram would ignore links targeting the same bot or intercept them incorrectly.

## UI Fixes (Mobile Header)
- Fixed horizontal layout overflow on narrow mobile screens (e.g. 360px/375px) in `Header.tsx`.
- The right-side action buttons (Bot, Feedback, Tutorial, and Catalog) took up too much horizontal space and pushed the Profile button off-screen.
- Moved these secondary actions to the `ProfileModal.tsx` settings menu for mobile users. They are now hidden on mobile (`hidden sm:flex`) in the main header but remain visible on desktop.
- This ensures critical items (Tokens, Buy, PRO mode, Profile) have enough room to render correctly without squishing.

## UI Fixes (Mobile Header)
- Fixed horizontal layout overflow on narrow mobile screens (e.g. 360px/375px) in `Header.tsx`.
- The right-side action buttons (Bot, Feedback, Tutorial, and Catalog) took up too much horizontal space and pushed the Profile button off-screen.
- Moved these secondary actions to the `ProfileModal.tsx` settings menu for mobile users. They are now hidden on mobile (`hidden sm:flex`) in the main header but remain visible on desktop.
- This ensures critical items (Tokens, Buy, PRO mode, Profile) have enough room to render correctly without squishing.

## Final Pre-Launch Security & Build Audit
- Verifed `npm run lint` and `npm run build` - 0 errors.
- Discovered and patched a critical vulnerability in `src/server/utils/billing.ts` where any user with `userId="local-user"` could bypass billing. Added `process.env.NODE_ENV !== 'production'` check so local-users are completely blocked from free generations in production.
- Added missing `FIREBASE_SERVICE_ACCOUNT_BASE64` to `.env.example`.
- Verified `tgAuth.ts` correctly validates Telegram WebApp `initData` using HMAC-SHA256 signature.
- Verified Webhook endpoint correctly validates `x-telegram-bot-api-secret-token`.
- Verified `vite.config.ts` has `vite-plugin-pwa` fully removed to prevent Render.com build errors.
