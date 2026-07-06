const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');

// Replace the buggy flex grid with a table layout for pdf-images-grid
content = content.replace(
    /\.pdf-images-grid \{.*?\}/,
    '.pdf-images-grid { display: table; width: 100%; table-layout: fixed; border-spacing: 24px 0; margin-bottom: 48px; page-break-inside: avoid; }'
);
content = content.replace(
    /\.pdf-img-col \{.*?\}/,
    '.pdf-img-col { display: table-cell; vertical-align: top; text-align: center; }'
);
content = content.replace(
    /\.pdf-img-col span \{.*?\}/,
    '.pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; }'
);
content = content.replace(
    /\.pdf-img-wrap \{.*?\}/,
    '.pdf-img-wrap { width: 100%; height: 280px; overflow: hidden; border-radius: 12px; background: transparent; text-align: center; }'
);
content = content.replace(
    /\.pdf-img-wrap img \{.*?\}/,
    '.pdf-img-wrap img { display: inline-block; max-width: 100%; max-height: 280px; width: auto !important; height: auto !important; border-radius: 8px; }'
);

fs.writeFileSync('src/utils/pdfExport.ts', content);
console.log("Fixed pdfExport.ts");
