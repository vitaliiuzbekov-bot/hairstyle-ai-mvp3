const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');

content = content.replace(
    /\.pdf-img-col \{.*?\}/,
    '.pdf-img-col { display: table-cell; vertical-align: top; text-align: center; width: 33.33%; padding: 0 10px; }'
);

fs.writeFileSync('src/utils/pdfExport.ts', content);
console.log("Fixed pdfExport.ts column width");
