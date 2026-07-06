const fs = require('fs');
const file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<img src="\$\{imgBeforeSrc\}" crossorigin="anonymous" \/>/g,
  '<img src="${imgBeforeSrc}" ${imgBeforeSrc.startsWith(\'http\') ? \'crossorigin="anonymous"\' : \'\'} />'
);

content = content.replace(
  /<img src="\$\{imgRefSrc\}" crossorigin="anonymous" \/>/g,
  '<img src="${imgRefSrc}" ${imgRefSrc && imgRefSrc.startsWith(\'http\') ? \'crossorigin="anonymous"\' : \'\'} />'
);

content = content.replace(
  /<img src="\$\{imgAfterSrc\}" crossorigin="anonymous" \/>/g,
  '<img src="${imgAfterSrc}" ${imgAfterSrc && imgAfterSrc.startsWith(\'http\') ? \'crossorigin="anonymous"\' : \'\'} />'
);

fs.writeFileSync(file, content);
