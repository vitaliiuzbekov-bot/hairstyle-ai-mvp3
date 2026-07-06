const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');

content = content.replace(
    /\.pdf-img-wrap img \{.*?\}/,
    '.pdf-img-wrap img { display: inline-block; max-width: 100%; max-height: 240px; width: auto !important; height: auto !important; border-radius: 8px; margin: 0 auto; }'
);

fs.writeFileSync('src/utils/pdfExport.ts', content);
console.log("Made pdf img styling foolproof");
