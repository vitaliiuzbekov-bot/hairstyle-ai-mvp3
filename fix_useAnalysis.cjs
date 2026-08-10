const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const target1 = `    preferredStyle: string;`;
const replacement1 = `    preferredStyle: string;
    clientName?: string;`;

const target2 = `    preferredStyle,`;
const replacement2 = `    preferredStyle,
    clientName,`;

const target3 = `            const newItem = {
              url: watermarkedUrl,
              originalUrl: data.imageUrl,
              keyword: styleKeyword || "Стиль",
              timestamp: Date.now(),
            };`;
const replacement3 = `            const newItem = {
              url: watermarkedUrl,
              originalUrl: data.imageUrl,
              keyword: styleKeyword || "Стиль",
              timestamp: Date.now(),
              clientName: clientName || undefined
            };`;

if (code.includes(target1) && code.includes(target2) && code.includes(target3)) {
  code = code.replace(target1, replacement1);
  code = code.replace(target2, replacement2);
  code = code.replace(target3, replacement3);
  fs.writeFileSync('src/hooks/useAnalysis.ts', code);
  console.log('Fixed useAnalysis');
} else {
  console.log('Target not found');
}
