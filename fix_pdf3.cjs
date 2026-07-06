const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');

const oldGridCss = `        .pdf-images-grid { display: table; width: 100%; table-layout: fixed; border-spacing: 24px 0; margin-bottom: 48px; page-break-inside: avoid; }
        .pdf-images-grid.cols-2 { }
        .pdf-images-grid.cols-3 { }
        .pdf-img-col { display: table-cell; vertical-align: top; text-align: center; width: 33.33%; padding: 0 10px; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; }
        .pdf-img-wrap { width: 100%; height: 280px; overflow: hidden; border-radius: 12px; background: transparent; text-align: center; }
        .pdf-img-wrap img { display: inline-block; max-width: 100%; max-height: 280px; width: auto !important; height: auto !important; border-radius: 8px; }`;

const newGridCss = `        .pdf-images-grid { display: block; width: 100%; text-align: center; margin-bottom: 36px; white-space: nowrap; font-size: 0; }
        .pdf-images-grid.cols-2 { }
        .pdf-images-grid.cols-3 { }
        .pdf-img-col { display: inline-block; vertical-align: top; text-align: center; width: 31%; margin: 0 1%; white-space: normal; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }
        .pdf-img-wrap { width: 100%; height: 240px; text-align: center; }
        .pdf-img-wrap img { max-width: 100%; max-height: 240px; height: 100%; object-fit: contain; border-radius: 8px; }`;

content = content.replace(oldGridCss, newGridCss);

fs.writeFileSync('src/utils/pdfExport.ts', content);
console.log("Fixed pdfExport.ts CSS");
