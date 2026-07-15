const fs = require('fs');
const content = fs.readFileSync('src/server/routes/generate.ts', 'utf8');
const lines = content.split('\n');
let depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // This is naive and doesn't handle strings/comments properly, 
    // but might give a hint.
    const open = (line.match(/\{/g) || []).length;
    const close = (line.match(/\}/g) || []).length;
    depth += open - close;
    if (i > 740 && i < 775) {
        console.log(`${i+1}: depth=${depth} | ${line}`);
    }
}
console.log(`Final depth: ${depth}`);
