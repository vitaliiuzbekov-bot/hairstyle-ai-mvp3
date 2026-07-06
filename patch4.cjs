const fs = require('fs');
const file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '.pdf-img-col { display: table-cell; vertical-align: top; text-align: center; padding: 0 5px; }',
  '.pdf-img-col { display: table-cell; width: 33.33%; vertical-align: top; text-align: center; padding: 0 5px; }'
);

fs.writeFileSync(file, content);
