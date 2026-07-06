const fs = require('fs');
const file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

const targetCss = `.pdf-images-grid { display: table; width: 100%; margin-bottom: 36px; table-layout: fixed; }
        .pdf-img-col { display: table-cell; width: 33.33%; vertical-align: top; text-align: center; padding: 0 5px; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }
        .pdf-img-wrap { width: 100%; height: 240px; line-height: 240px; text-align: center; overflow: hidden; white-space: nowrap; }
        .pdf-img-wrap img { display: inline-block; vertical-align: middle; max-width: 100%; max-height: 240px; width: auto !important; height: auto !important; border-radius: 8px; }`;

const newCss = `.pdf-images-grid { display: block; width: 100%; margin-bottom: 36px; text-align: center; page-break-inside: avoid; white-space: nowrap; }
        .pdf-img-col { display: inline-block; width: 31%; margin: 0 1%; vertical-align: top; text-align: center; white-space: normal; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }
        .pdf-img-wrap { width: 100%; height: 240px; line-height: 240px; text-align: center; overflow: hidden; }
        .pdf-img-wrap img { display: inline-block; vertical-align: middle; max-width: 100%; max-height: 240px; width: auto !important; height: auto !important; border-radius: 8px; object-fit: contain; }`;

content = content.replace(targetCss, newCss);
fs.writeFileSync(file, content);
