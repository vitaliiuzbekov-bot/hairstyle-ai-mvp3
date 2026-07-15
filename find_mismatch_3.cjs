const fs = require('fs');
const code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

let depth = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;
let inComment = false;
let inMultiComment = false;

const lines = code.split('\n');
for (let lineNum = 0; lineNum < lines.length; lineNum++) {
  const line = lines[lineNum];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    const next = line[i+1];
    
    if (inComment) { break; } 
    if (inMultiComment) {
      if (c === '*' && next === '/') { inMultiComment = false; i++; }
      continue;
    }
    if (inString) {
      if (c === '\\') i++;
      else if (c === stringChar) inString = false;
      continue;
    }
    if (inTemplate) {
      if (c === '\\') { i++; }
      else if (c === '$' && next === '{') { depth++; i++; }
      else if (c === '}') { depth--; }
      else if (c === '`') { inTemplate = false; }
      continue;
    }
    
    if (c === '/' && next === '/') { inComment = true; i++; continue; }
    if (c === '/' && next === '*') { inMultiComment = true; i++; continue; }
    if (c === "'" || c === '"') { inString = true; stringChar = c; continue; }
    if (c === '`') { inTemplate = true; continue; }
    
    if (c === '{') { depth++; if(depth >= 3 && lineNum > 227 && lineNum < 750) console.log(`+ depth=${depth} at line ${lineNum+1}`); }
    if (c === '}') { depth--; if(depth >= 2 && lineNum > 227 && lineNum < 750) console.log(`- depth=${depth} at line ${lineNum+1}`); }
  }
  inComment = false;
}
