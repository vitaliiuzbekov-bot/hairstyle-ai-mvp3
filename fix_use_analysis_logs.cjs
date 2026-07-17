const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const targetStr = `          console.log('[useAnalysis] Starting generateFullApi (which polls internally)');
          const data = await generateFullApi(formData, telegramInitData, signal);`;

const replacementStr = `          console.log('[useAnalysis] Начало генерации');
          console.log('[useAnalysis] Starting generateFullApi (which polls internally)');
          const data = await generateFullApi(formData, telegramInitData, signal);
          console.log('[useAnalysis] Результат получен:', data);`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/hooks/useAnalysis.ts', code);
console.log("Updated useAnalysis.ts");
