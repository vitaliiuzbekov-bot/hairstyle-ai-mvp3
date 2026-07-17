const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const targetStr = `          formData.append("idempotencyKey", idempotencyKey);

          const data = await generateFullApi(formData, telegramInitData, signal);`;

const replacementStr = `          formData.append("idempotencyKey", idempotencyKey);

          console.log('[useAnalysis] Starting generateFullApi (which polls internally)');
          const data = await generateFullApi(formData, telegramInitData, signal);`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/hooks/useAnalysis.ts', code);
console.log("Updated useAnalysis.ts");
