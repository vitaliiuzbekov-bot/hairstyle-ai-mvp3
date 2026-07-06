const fs = require('fs');
let file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace font family
content = content.replace(
  `pdfContainer.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";`,
  `pdfContainer.style.fontFamily = "Arial, Helvetica, sans-serif";`
);

// Replace grid css
const oldCss = `.pdf-images-grid { display: table; width: 100%; table-layout: fixed; margin-bottom: 36px; page-break-inside: avoid; }
        .pdf-img-col { display: table-cell; width: 33.33%; vertical-align: top; text-align: center; padding: 0 8px; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }
        .pdf-img-wrap { width: 100%; height: 260px; line-height: 260px; text-align: center; overflow: hidden; white-space: nowrap; }
        .pdf-img-wrap img { display: inline-block; vertical-align: middle; max-width: 100%; max-height: 260px; width: auto !important; height: auto !important; border-radius: 8px; object-fit: contain; }`;

const newCss = `.pdf-images-grid { display: flex; flex-direction: row; justify-content: center; align-items: stretch; gap: 16px; width: 100%; margin-bottom: 36px; page-break-inside: avoid; }
        .pdf-img-col { flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 0; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }
        .pdf-img-wrap { width: 100%; height: 260px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .pdf-img-wrap img { max-width: 100%; max-height: 260px; object-fit: contain; border-radius: 8px; }`;

content = content.replace(oldCss, newCss);

// Replace content css to fix text glued
const oldContentCss = `.pdf-content { text-align: left; font-size: 14px; line-height: 1.7; color: #1f2937; }`;
const newContentCss = `.pdf-content { text-align: left; font-size: 14px; line-height: 1.6; color: #1f2937; letter-spacing: normal; word-spacing: normal; }`;
content = content.replace(oldContentCss, newContentCss);

// Also remove `white-space: pre-wrap` as it might cause html2canvas space gluing issues
content = content.replace(`white-space: pre-wrap; word-wrap: break-word;`, `word-wrap: break-word;`);

fs.writeFileSync(file, content);
