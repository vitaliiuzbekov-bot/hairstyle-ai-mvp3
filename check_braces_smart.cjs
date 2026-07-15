const fs = require('fs');
const code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

let depth = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;
let inComment = false;
let inMultiComment = false;

for (let i = 0; i < code.length; i++) {
  const c = code[i];
  const next = code[i+1];
  
  if (inComment) {
    if (c === '\n') inComment = false;
    continue;
  }
  if (inMultiComment) {
    if (c === '*' && next === '/') {
      inMultiComment = false;
      i++;
    }
    continue;
  }
  if (inString) {
    if (c === '\\') i++;
    else if (c === stringChar) inString = false;
    continue;
  }
  if (inTemplate) {
    if (c === '\\') i++;
    else if (c === '`') inTemplate = false;
    // NOTE: ${} inside template is not handled properly but for just counting outer braces it might be okay if they balance, actually ${} adds a '{' and '}' which balances.
    continue;
  }
  
  if (c === '/' && next === '/') { inComment = true; i++; continue; }
  if (c === '/' && next === '*') { inMultiComment = true; i++; continue; }
  if (c === "'" || c === '"') { inString = true; stringChar = c; continue; }
  if (c === '`') { inTemplate = true; continue; }
  
  if (c === '{') depth++;
  if (c === '}') depth--;
}

console.log("True depth:", depth);
