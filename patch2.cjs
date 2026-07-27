const fs = require('fs');
const file = 'src/server/utils/billing.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `return { ok: false, error: \`Внутренняя ошибка биллинга: \${err.message}\` };`,
  `return { ok: false, error: \`Внутренняя ошибка биллинга: \${typeof err.message === 'object' ? JSON.stringify(err.message) : err.message}\` };`
);
fs.writeFileSync(file, content);
console.log('Patched billing.ts');
