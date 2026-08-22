# Текущее состояние проекта (Обновлено 22.08.2026)

## Known Issues (Resolved)
1. SSRF — `/api/proxy-image` fetches any URL (fix: allowlist)
2. Dev-mode bypass — `x-developer-mode` header gives unlimited free generations (fix: server-side allowlist `DEV_TELEGRAM_USER_IDS`)
3. Webhook unprotected — `/api/set-telegram-webhook` is public (fix: `ADMIN_SETUP_SECRET`)
4. Billing fail-open — Firebase errors give free generations (fix: fail-closed)
5. Storage open — `storage.rules` allows anyone to write (fix: require auth + limit)
6. Fal.ai result bug — in-memory `jobMap` + infinite polling (fix: Firestore persistence + bounded polling)
7. vite-plugin-pwa — missing dependency breaks Render build (fix: remove from config)
8. Firebase Storage Image Bug - 1-3MB Base64 in JSON crashes dev proxy (fix: fallback to local `/tmp/` и express static serving)
9. Fal.ai 422 Unprocessable Entity - `Buffer` inside Node.js caused `.octet` uploads without extensions. (fix: switched to `File` class in `fal.storage.upload`, explicitly setting `image/jpeg` MIME type).
10. Fal.ai Image-to-Image model patch - Switched endpoint from `fal-ai/flux/dev` to true `fal-ai/flux/dev/image-to-image`.
11. Gemini Rate Limits & YandexGPT fallback blind issue - Removed blind YandexGPT fallback.
12. Fal.ai 2 Faces Prompt Fix - Added `CRITICAL: en face portrait facing camera directly`.
13. **100% Stable FaceSwap Architecture** - Implemented "Face-in-hole" direct swap when a reference image is selected.
14. **Улучшение качества генерации референсов** - Заменен системный промпт в `reference.ts`.
15. **Баг кэширования "Свой вариант"** - (fix: добавлено поле `description` в формирование ключа).
16. **Подготовка к Production** - Успешно пройдены линтинг (TypeScript) и сборка (`npm run build`).
17. **Очистка от мусора перед деплоем** - Удалено более 50+ временных файлов (patch, test, sh, py скрипты), очищен кэш `.vite` и усилен `.gitignore`.

## Текущая задача
- Приложение очищено от мусора и готово к выгрузке на GitHub. Ожидание завершения экспорта пользователем.
