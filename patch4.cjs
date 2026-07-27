const fs = require('fs');
const file = 'src/services/api.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace all occurrences of `throw new Error(data.error`
content = content.replace(/throw new Error\(data\.error \|\| (.*?)\);/g, (match, fallback) => {
  return `throw new Error(typeof data.error === "object" ? JSON.stringify(data.error) : data.error || ${fallback});`;
});

fs.writeFileSync(file, content);
console.log('Patched api.ts');
