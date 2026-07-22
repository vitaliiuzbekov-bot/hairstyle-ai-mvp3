# Состояние проекта: Hairstyle AI MVP 3

## Выполненные задачи
1. **Безопасность и биллинг**:
   - Устранена SSRF-уязвимость в `/api/proxy-image`.
   - Режим разработчика теперь проверяет Telegram Init Data и `DEV_TELEGRAM_USER_IDS`.
   - Защищен вебхук `/api/set-telegram-webhook`.
   - Реализована строгая транзакционная система биллинга в Firestore (fail-closed).
2. **Адаптеры генерации (FalAdapter)**:
   - Полностью переписан `FalAdapter.ts` на официальный SDK `@fal-ai/serverless-client`.
   - Вместо зависающего метода `fal.subscribe` (и поллинга) внедрен стабильный синхронный метод `fal.run` без `mode: "streaming"`, что устранило проблему вечного ожидания и зависания ("unexpected error") при виртуальной примерке.
   - Из API генерации убрана зависимость от модуля `fs` на стороне клиента (из-за которой возникала ошибка `fs is not defined`).
3. **CORS и отображение ИИ-результатов (BeforeAfterSlider)**:
   - Внедрен прокси `/api/proxy-image` для обхода ограничений CORS Telegram WebView.
   - Слайдер `BeforeAfterSlider.tsx` использует `clip-path: inset(...)` для предотвращения деформации изображений.
4. **Хранилище**:
   - Правила `storage.rules` обновлены, чтобы запретить неавторизованную запись от лица клиента (папка `/generations/` доступна только для записи с сервера через Admin SDK).

## Текущий статус
Приложение стабилизировано. Конвейер генерации прически и подмены лица через Fal.ai работает корректно от начала и до конца. 

## Запуск
Для запуска необходимо задать `.env` файл на основе `.env.example`.
Запуск сервера: `npm start` (запускает `node dist/server.cjs`).

### 2026-07-20: Исправление логики Virtual Try-On
- **Проблема**: Генерация примерки стрижки не совпадала с референсом, а Gemini путался между селфи и референсом. Вдобавок, при отправке пустого референса Flux использовал селфи как базу, но с неверным промптом, или наоборот — мог использовать референс как базу и исказить тело пользователя.
- **Решение**: 
  1. В `src/server/routes/generate.ts` жестко задано `let baseImageForFlux = selfieImageFull;`, чтобы Flux всегда использовал селфи пользователя как базу (сохраняя одежду и фон).
  2. Переписан массив `contentsPayload` для Gemini: теперь изображения четко разделены маркерами `[IMAGE 1: USER'S ORIGINAL PHOTO]` (указано игнорировать волосы) и `[IMAGE 2: TARGET HAIRSTYLE REFERENCE]` (указано сфокусироваться только на прическе).
  3. В `src/components/VTONPreviewSection.tsx` кнопка "Показать на мне" теперь неактивна (`disabled`), пока референсное изображение полностью не загрузится, чтобы избежать отправки пустого `targetImageUrl`.

### 2026-07-20: Сброс серверного кэша генераций
- **Проблема**: Пользователь получал старые "испорченные" результаты при повторных попытках с тем же селфи, так как сервер кэшировал результат VTON на 30 дней.
- **Решение**: Изменен префикс ключа кэширования в `src/server/routes/generate.ts` с `v2_` на `v3_force_update_`, что принудительно аннулирует все старые кэши для генераций.

### 2026-07-20: Оптимизация запуска приложения и генерации промпта
- **Проблема 1**: При входе в приложение автоматически загружалось последнее сгенерированное фото из `localStorage` или бэкенда, вместо открытия экрана камеры/загрузки.
- **Решение 1**: Удален код авто-загрузки последнего фото при открытии без параметров. Приложение теперь всегда стартует с экрана загрузки/селфи. Переход на экран результата происходит только по специальной ссылке из Telegram-бота или через Историю.
- **Проблема 2**: Два визуальных анализа. Пользователь жаловался, что анализ лица зависает на 5 минут и дублируется. 
- **Решение 2**: Из `src/server/routes/generate.ts` убран второй визуальный анализ селфи, который отправлялся в Gemini перед генерацией (так как Gemini иногда перегружен). Оставлен только текстовый анализ из первого шага + FaceSwap, что значительно ускоряет работу.
- **Проблема 3**: Ошибка отображения референса при переключении стилей. 
- **Решение 3**: В `src/components/BarberBlueprintModal.tsx` добавлен сброс `loadedReferenceUrl` при смене стиля, чтобы старая картинка не отображалась.
- **Проблема 4**: Финальное изображение генерировало двух людей (или лицо "склеивалось"), и прическа не соответствовала загруженному кастомному референсу.
- **Причина 4**: 
  1. В промпт для Gemini передавались сразу ДВА изображения (селфи и референс). Gemini путался и генерировал текстовый промпт, описывающий двух разных людей или коллаж, что приводило к генерации двух лиц в Flux.
  2. Значение `fluxStrength` (denoising strength) для Flux было слишком низким (0.18 - 0.40). Flux практически не менял исходное селфи, поэтому прическа не подстраивалась под референс.
- **Решение 4**: 
  1. Из генерации промпта в Gemini удалено `[IMAGE 1: USER'S ORIGINAL PHOTO]`. Gemini теперь видит ТОЛЬКО референс прически (если он есть) и текстовые параметры лица. Это гарантирует, что Gemini описывает именно нужную прическу, не смешивая ее с лицом пользователя.
  2. Скорректирована формула `fluxStrength`. Теперь используется диапазон `0.75 - 0.95`. Это позволяет Flux полностью перерисовать волосы в соответствии с промптом, а сохранение лица обеспечивает последующий шаг `fal-ai/face-swap`.
- **Проблема 5**: При обновлении страницы или повторном заходе автоматически загружалось предыдущее сгенерированное фото (возврат на страницу результата вместо главной).
- **Причина 5**: Хуки `useImageUpload`, `useAnalysis` и компоненты `HomePage`, `ImageSlider` при инициализации считывали данные из `localStorage` (`persistent_imageBase64`, `lastGeneratedImage` и т.д.) и принудительно восстанавливали старое состояние.
- **Решение 5**: Из кода удалено чтение этих ключей `localStorage` при инициализации. Теперь стейты по умолчанию равны `null`. Приложение всегда будет запускаться с чистого листа (стартовой страницы).
- **Проблема 5**: При обновлении страницы или повторном заходе автоматически загружалось предыдущее сгенерированное фото (возврат на страницу результата вместо главной).
- **Причина 5**: Хуки `useImageUpload`, `useAnalysis` и компоненты `HomePage`, `ImageSlider` при инициализации считывали данные из `localStorage` (`persistent_imageBase64`, `lastGeneratedImage` и т.д.) и принудительно восстанавливали старое состояние.
- **Решение 5**: Из кода удалено чтение этих ключей `localStorage` при инициализации. Теперь стейты по умолчанию равны `null`. Приложение всегда будет запускаться с чистого листа (стартовой страницы).
- **Проблема 6**: Сервер разработки перестал отвечать (dev server didn't start).
- **Причина 6**: Процесс dev-сервера (Vite + Express) завис или упал в фоне из-за нехватки памяти либо предыдущих ошибок конфигурации, что приводило к таймауту/ошибке при подключении.
- **Решение 6**: Сервер разработки был принудительно перезапущен. Проверена компиляция (`npm run build`) и отдача статики/API. Сервер успешно запущен на порту 3000 и корректно отвечает на health-check запросы.
- **Проблема 7**: Кнопка "Обратная связь" потерялась из интерфейса, а также необходимо было вынести смену цвета волос в отдельную функцию, за которую списываются кредиты (stars/генерации).
- **Причина 7**: Компонент обратной связи (`FeedbackModal.tsx`) присутствовал в коде, но кнопка вызова в заголовке отсутствовала. Логика смены цвета `ColorChangeOnlyCard.tsx` не была подключена к потоку генерации и была полностью бесплатной (локальной).
- **Решение 7**: 
  1. В `Header.tsx` добавлена кнопка "Отзыв", которая вызывает событие открытия модалки обратной связи (`window.dispatchEvent(new Event('open-feedback-modal'))`).
  2. В `AnalysisResults.tsx` внедрён компонент `ColorChangeOnlyCard`, который появляется после загрузки фотографии.
  3. В `ColorChangeOnlyCard.tsx` добавлена проверка баланса (`checkLimits`) и списание одной генерации (`consumeToken`) перед применением цвета. Также изменены тексты, теперь указана стоимость: 1 генерация.
- **Проблема 8**: При виртуальной примерке прически (VTON) всё ещё присутствовала частично удалённая логика изменения цвета, но без палитры выбора. Пользователь просил полностью убрать эту логику из VTON, так как цвет должен меняться только через AR-Студию.
- **Причина 8**: `customHairColor` и функции его установки передавались в компоненты `VTONPreviewSection`, `BarberBlueprintModal`, а также использовались в контексте и на бэкенде в запросе `generateVirtualTryOn`.
- **Решение 8**: 
  1. Из `VTONPreviewSection.tsx` удалены свойства и код, отвечающий за выбор цвета.
  2. Из `BarberBlueprintModal.tsx`, `HomePage.tsx`, `AnalysisContext.tsx`, `useAnalysis.ts` удалены пропсы, переменные состояния и параметры вызовов, касающиеся `customHairColor`.
  3. На сервере (`generate.ts` и `promptGenerator.ts`) логика обработки кастомного цвета (включая конструирование `colorDesc`) удалена.

### Issue: Telegram Mini App Video Download
- **Problem**: In Telegram Mini App (especially on iOS), `a.download` with `blob:` URLs does not work. This caused "Скачать Видео" to fail because it relied on `URL.createObjectURL(blob)`. Previously we used `send-to-telegram` to send the video to the bot chat, but users explicitly requested it to be downloadable directly to their device just like images ("как скачать референс").
- **Solution**: 
  - Changed the server endpoint to `/api/generate-video`. Instead of sending it to Telegram Bot API, the server saves the `mp4` in `tmp/` and returns its public URL: `res.json({ url: '/tmp/out_...mp4' })`.
  - The Express server now serves `/tmp` statically using `app.use('/tmp', express.static(...))`.
  - The client receives the URL, constructs the absolute URL (`window.location.origin + data.url`), and uses `tg.openLink(videoUrl)` if inside Telegram, or a fallback `a.href = videoUrl; a.target = '_blank'` otherwise. This forces the OS / Telegram to open the video in an external browser where the user can natively save it to Photos/Downloads.
  - Replaced the failing `xfade` FFmpeg filter with `fade` + `overlay` which works universally on Render's `@ffmpeg-installer` build.

### Issue: React Crash and Mobile Telegram Download Failure
- **React Error Boundary Crash**: Fixed a crash occurring right after image generation. Caused by a missing `Grid2x2` icon import from `lucide-react` in `VTONPreviewSection.tsx`. Added the import, restoring UI rendering.
- **Mobile Telegram Mini App Downloads**:
  - `a.download` does not work in Mobile WebViews (iOS Safari inside Telegram).
  - Adopted Telegram's native `tg.downloadFile({ url, file_name })` API for native popup downloads.
  - Implemented `/api/upload-temp`, `/api/download-proxy`, and `/api/download-local` in `server.ts` to convert client-side base64 blobs into public proxy URLs with the correct headers (`Content-Disposition: attachment; filename="..."`) strictly required by Telegram's `downloadFile` method.
  - Updated `downloadImage.ts` and video export in `VTONPreviewSection.tsx` to utilize this architecture for seamless Mobile saving.

### Issue: "Ошибка экспорта: undefined" for Video Generation
- **Root Cause**: The result image generated via client-side edits (AR Effects, Mask Eraser) was stored as a local `blob:http://...` URL. 
  - When sent to the server (`/api/generate-video`), Node.js `fetch` crashed because it cannot access browser-local blob domains, causing a 500 error.
  - The frontend then fell back to local generation (`generateBeforeAfterVideo`), which applied `crossOrigin="anonymous"` to the blob URL. iOS Safari strict security blocks anonymous cross-origin requests to blob URIs, triggering a silent `Event` rejection. 
  - Since the rejection wasn't a standard `Error` object, `(err as Error).message` evaluated to `undefined`.
- **Fix Applied**: 
  - Added a pre-processing step `resolveUrlToDataUri` in `VTONPreviewSection.tsx` that intercepts `blob:` URLs and converts them back to fully-embedded base64 `data:image/...` strings via `FileReader` *before* hitting the API or canvas.
  - Removed `crossOrigin="anonymous"` in `videoExport.ts` for internal `data:` and `blob:` URIs.
  - Enforced a standard `Error` wrap on `img.onerror` so all future failures display a human-readable message.
