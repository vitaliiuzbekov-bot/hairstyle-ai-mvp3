import fs from 'fs';

let state = fs.readFileSync('STATE.md', 'utf8');
state = state.replace('## Запланировано на следующие сессии (проверка, тесты, баги):\n1. **Экспорт**: Пользователю необходимо заново экспортировать проект в GitHub/ZIP, чтобы получить все внесенные изменения и патчи.\nDocumenting the fix\n15.', '## Завершенные обновления безопасности (Pre-Export Validation 2)\n15.');

fs.writeFileSync('STATE.md', state);
