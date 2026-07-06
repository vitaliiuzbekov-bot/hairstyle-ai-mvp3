const fs = require('fs');
const file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '.pdf-img-wrap { width: 100%; height: 240px; text-align: center; overflow: hidden; display: block; position: relative; }\n        .pdf-img-wrap img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }',
  '.pdf-img-wrap { width: 100%; height: 240px; line-height: 240px; text-align: center; overflow: hidden; white-space: nowrap; }\n        .pdf-img-wrap img { display: inline-block; vertical-align: middle; max-width: 100%; max-height: 240px; width: auto !important; height: auto !important; border-radius: 8px; }'
);

fs.writeFileSync(file, content);
