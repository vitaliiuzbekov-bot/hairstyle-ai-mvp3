const fs = require('fs');
let code = fs.readFileSync('src/hooks/useImageUpload.ts', 'utf8');

code = code.replace(/useState<string>\(\(\) => \{[\s\S]*?return localStorage\.getItem\("persistent_mimeType"\) \|\| "image\/webp";[\s\S]*?\}\)/, 'useState<string>("image/webp")');

fs.writeFileSync('src/hooks/useImageUpload.ts', code);
console.log('Fixed useImageUpload mimeType');
