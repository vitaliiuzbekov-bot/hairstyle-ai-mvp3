const fs = require('fs');
const file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<img src="\$\{imgBeforeSrc\}" \/>/g,
  '<img src="${imgBeforeSrc}" crossorigin="anonymous" />'
);

content = content.replace(
  /<img src="\$\{imgRefSrc\}" \/>/g,
  '<img src="${imgRefSrc}" crossorigin="anonymous" />'
);

content = content.replace(
  /<img src="\$\{imgAfterSrc\}" \/>/g,
  '<img src="${imgAfterSrc}" crossorigin="anonymous" />'
);

fs.writeFileSync(file, content);
