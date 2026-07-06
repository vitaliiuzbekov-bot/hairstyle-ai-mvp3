const fs = require('fs');
let file = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

file = file.replace(
  "consumeToken(); // Optimistic deduction on successful UI render",
  'consumeToken(); // Optimistic deduction on successful UI render\\n            addToast("Примерка завершена! Посмотрите результат в Истории.", "success");'
);

fs.writeFileSync('src/hooks/useAnalysis.ts', file);
