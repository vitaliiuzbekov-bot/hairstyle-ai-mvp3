#!/bin/bash
cat << 'STATE_CONTENT' >> STATE.md

### Исправление iframe (08.08.2026)
- **Проблема**: Превью в AI Studio перестало работать (ошибка разорванного соединения/заблокировано браузером).
- **Решение**: Отключены заголовки `xFrameOptions`, `crossOriginOpenerPolicy` и `crossOriginResourcePolicy` в `helmet` (`server.ts`), которые блокировали загрузку внутри iframe.
STATE_CONTENT
