const fs = require('fs');

let content = fs.readFileSync('src/data/haircutLibrary.ts', 'utf-8');

// Replace customImageUrl with imageKeyword completely
content = content.replace(/customImageUrl:\s*".*?",\n/g, "");

fs.writeFileSync('src/data/haircutLibrary.ts', content);
