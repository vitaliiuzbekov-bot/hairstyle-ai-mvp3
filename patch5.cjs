const fs = require('fs');
const file = 'src/hooks/useAnalysis.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/addToast\(msg, "error"\);/g, `addToast(typeof msg === 'object' ? JSON.stringify(msg) : String(msg), "error");`);

fs.writeFileSync(file, content);
console.log('Patched useAnalysis.ts');
