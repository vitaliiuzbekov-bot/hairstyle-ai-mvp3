const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

code = code.replace(
  /\`\$\{process\.env\.VITE_FRONTEND_URL\}\?image=\$\{encodeURIComponent\(swappedImageUrl\)\}\`/,
  `\`\${process.env.VITE_FRONTEND_URL}/#/?image=\${encodeURIComponent(swappedImageUrl)}\``
);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Updated generate.ts");
