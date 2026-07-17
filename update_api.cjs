const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const targetStr = "// Poll for status\n  let attempts = 0;";
const replacementStr = "// Poll for status\n  console.log('[pollJob] Начинаю опрос, jobId:', jobId);\n  let attempts = 0;";

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/services/api.ts', code);
console.log("Updated api.ts");
