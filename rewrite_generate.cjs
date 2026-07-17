const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const regex = /              const resultUrl = \`\$\{process\.env\.VITE_FRONTEND_URL\}\/#\/\?image=\$\{encodeURIComponent\(swappedImageUrl\)\}\`;/;
const replacement = `              const originalImageUrl = req.body.imageUrl;
              const resultUrl = \`\${process.env.VITE_FRONTEND_URL}/#/?imageUrl=\${encodeURIComponent(swappedImageUrl)}&originalUrl=\${encodeURIComponent(originalImageUrl || '')}\`;`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Rewrote generate.ts");
