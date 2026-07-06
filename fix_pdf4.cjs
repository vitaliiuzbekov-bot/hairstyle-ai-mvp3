const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');

content = content.replace(
    /\.pdf-images-grid \{.*?\}/,
    '.pdf-images-grid { display: block; width: 100%; text-align: center; margin-bottom: 36px; white-space: nowrap; font-size: 0; }'
);
content = content.replace(
    /\.pdf-img-col \{.*?\}/,
    '.pdf-img-col { display: inline-block; vertical-align: top; text-align: center; width: 31%; margin: 0 1%; white-space: normal; }'
);
content = content.replace(
    /\.pdf-img-col span \{.*?\}/,
    '.pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }'
);
content = content.replace(
    /\.pdf-img-wrap \{.*?\}/,
    '.pdf-img-wrap { width: 100%; height: 240px; text-align: center; }'
);
content = content.replace(
    /\.pdf-img-wrap img \{.*?\}/,
    '.pdf-img-wrap img { max-width: 100%; max-height: 240px; height: 100%; object-fit: contain; border-radius: 8px; }'
);

fs.writeFileSync('src/utils/pdfExport.ts', content);
console.log("Fixed pdfExport.ts using regex");
