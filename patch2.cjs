const fs = require('fs');
const file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '.pdf-images-grid { display: block; width: 100%; text-align: center; margin-bottom: 36px; white-space: nowrap; font-size: 0; }\n        .pdf-images-grid.cols-2 { }\n        .pdf-images-grid.cols-3 { }\n        \n        .pdf-img-col { display: inline-block; vertical-align: top; text-align: center; width: 31%; margin: 0 1%; white-space: normal; }\n        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }\n        .pdf-img-wrap { width: 100%; height: 240px; text-align: center; }\n        .pdf-img-wrap img { display: inline-block; max-width: 100%; max-height: 240px; width: auto !important; height: auto !important; border-radius: 8px; margin: 0 auto; }',
  '.pdf-images-grid { display: table; width: 100%; margin-bottom: 36px; table-layout: fixed; }\n        .pdf-img-col { display: table-cell; vertical-align: top; text-align: center; padding: 0 5px; }\n        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }\n        .pdf-img-wrap { width: 100%; height: 240px; text-align: center; overflow: hidden; display: block; position: relative; }\n        .pdf-img-wrap img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }'
);

fs.writeFileSync(file, content);
