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
18. **Ошибка 401 UNAUTHENTICATED на Render (GEMINI_API_KEY)** - Выявлена причина падения Gemini (Vision / LLM / Imagen 3) в логах Render: недействительный, пустой или отсутствующий `GEMINI_API_KEY` в переменных окружения Render (`Environment`). Добавлена явная проверка `geminiApiKey?.trim()`.
19. **Система оплаты СБП (Озон банк / ОТП банк) + Telegram Stars** - Внедрена система пополнения баланса по номеру телефона `+79059804683` (Озон банк, ОТП банк) с автоматическим уведомлением администратора в бот, инлайн-кнопками для начисления в один клик, реалтайм-зачислением в Firestore, уведомлением клиента в Telegram и окном подтверждения получения генераций в приложении.
20. **Исправление ошибки Invalid Hook Call в BuyModal** - Устранен сбой `Cannot read properties of null (reading 'useState')` при открытии модального окна покупки, очищены дубликаты разметки в `BuyModal.tsx`, синхронизированы экспорты и перезапущен dev server.
21. **Экономика себестоимости, реферальная программа и улучшение читаемости BuyModal** - Проведен полный расчет себестоимости генераций (Fal.ai FaceSwap ~$0.013/генерация ≈ 1.25 ₽, Flux Image-to-Image ~$0.035 ≈ 3.4 ₽). Рассчитана экономика пакетов (маржинальность 85-93%). Проверена работа реферальной системы (+1 генерация пригласившему и +1 приглашенному при переходе по ссылке `?startapp=ref_ID` через Firestore и `/api/add-tokens`). В `BuyModal.tsx` значительно повышен контраст и четкость текста как в темной, так и в светлой темах, добавлен удобный реферальный блок с кнопками шаринга и копирования ссылки.
22. **Исправление обработки кнопок начисления в Telegram (Callback Query & Webhook)** - Устранена блокировка вебхука Telegram из-за жесткой проверки `x-telegram-bot-api-secret-token`, когда вебхук был установлен без заголовка. Добавлен гарантированный вызов `answerCallbackQuery` для всех веток выполнения (устранено бесконечное зависание спиннера на кнопке "Начислить"). Добавлен автоматический регистратор вебхука при старте сервера, эндпоинт `/api/telegram-webhook-status` и команды `/setwebhook`, `/ping`, `/status` для администратора в Telegram.

## Текущая задача
- Исправление работы кнопок начисления в Telegram боте завершено и проверено.
