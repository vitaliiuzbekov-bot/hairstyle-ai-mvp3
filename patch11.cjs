const fs = require('fs');
const file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace CSS
content = content.replace(
  /\.pdf-images-grid \{ display: block; width: 100%; margin-bottom: 36px; text-align: center; page-break-inside: avoid; white-space: nowrap; \}[\s\S]*?\.pdf-img-wrap img \{ display: inline-block; vertical-align: middle; max-width: 100%; max-height: 240px; width: auto !important; height: auto !important; border-radius: 8px; object-fit: contain; \}/,
  `.pdf-images-grid { display: table; width: 100%; table-layout: fixed; margin-bottom: 36px; page-break-inside: avoid; }
        .pdf-img-col { display: table-cell; width: 33.33%; vertical-align: top; text-align: center; padding: 0 8px; }
        .pdf-img-col span { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; color: #111; width: 100%; text-align: center; }
        .pdf-img-wrap { width: 100%; height: 260px; background-size: contain; background-position: center top; background-repeat: no-repeat; border-radius: 8px; }`
);

// Replace HTML
content = content.replace(
  '<div class="pdf-img-wrap"><img src="${imgBeforeSrc}" /></div>',
  `<div class="pdf-img-wrap" style="background-image: url('\${imgBeforeSrc}')"></div>`
);
content = content.replace(
  '<div class="pdf-img-wrap"><img src="${imgRefSrc}" /></div>',
  `<div class="pdf-img-wrap" style="background-image: url('\${imgRefSrc}')"></div>`
);
content = content.replace(
  '<div class="pdf-img-wrap"><img src="${imgAfterSrc}" /></div>',
  `<div class="pdf-img-wrap" style="background-image: url('\${imgAfterSrc}')"></div>`
);

fs.writeFileSync(file, content);
