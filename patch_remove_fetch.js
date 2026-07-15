import fs from 'fs';
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf-8');
content = content.replace('import fetch from "node-fetch";', '');
fs.writeFileSync('src/server/routes/generate.ts', content, 'utf-8');
console.log("Removed node-fetch import");
