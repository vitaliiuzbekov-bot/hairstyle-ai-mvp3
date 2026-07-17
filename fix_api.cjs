const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const targetStr = `  if (!response.ok) {
    throw new Error(data.error || "Ошибка от сервера при инициализации генерации.");
  }`;

const replacementStr = `  if (!response.ok) {
    throw new Error(data.error || "Ошибка от сервера при инициализации генерации.");
  }
  
  console.log('[api] Generation response:', data);
  console.log('[api] JobId from response:', data.jobId);`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/services/api.ts', code);
console.log("Updated api.ts");
