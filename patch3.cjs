const fs = require('fs');
const file = 'src/server/adapters/FalAdapter.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `let fullMsg = error.message;`,
  `let fullMsg = typeof error.message === "object" ? JSON.stringify(error.message) : error.message;`
);
fs.writeFileSync(file, content);
console.log('Patched FalAdapter.ts');
