const fs = require('fs');
const code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');
let depth = 0;
let inString = false;
let inComment = false;
let stringChar = '';
let line = 1;
for (let i = 0; i < code.length; i++) {
  if (code[i] === '\n') line++;
  if (inComment) { if (code[i] === '\n') inComment = false; continue; }
  if (inString) {
    if (code[i] === '\\') { i++; continue; }
    if (code[i] === stringChar) inString = false;
    continue;
  }
  if (code[i] === '/' && code[i+1] === '/') { inComment = true; i++; continue; }
  if (code[i] === '/' && code[i+1] === '*') { let end = code.indexOf('*/', i+2); if(end > -1) { i = end + 1; continue; } }
  if (code[i] === '\"' || code[i] === '\'' || code[i] === '\`') { inString = true; stringChar = code[i]; continue; }
  if (code[i] === '{') depth++;
  if (code[i] === '}') depth--;
  if (line >= 235 && line <= 245 && (code[i] === '{' || code[i] === '}')) {
     console.log('line ' + line + ' char ' + code[i] + ' depth ' + depth);
  }
}
