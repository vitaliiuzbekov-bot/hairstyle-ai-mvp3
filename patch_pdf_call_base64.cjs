const fs = require('fs');
let file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the fallback assignments to also await urlToBase64
content = content.replace(
  `    if (!imgBeforeSrc) imgBeforeSrc = beforeImageElement ? getBase64Image(beforeImageElement) : null;
    if (!imgRefSrc) imgRefSrc = refImageElement ? getBase64Image(refImageElement) : null;
    if (!imgAfterSrc) imgAfterSrc = (vtonResultEl && vtonResultEl !== beforeImageElement && vtonResultEl !== refImageElement) ? getBase64Image(vtonResultEl) : null;`,
  `    if (!imgBeforeSrc) imgBeforeSrc = beforeImageElement ? getBase64Image(beforeImageElement) : null;
    if (!imgRefSrc) imgRefSrc = refImageElement ? getBase64Image(refImageElement) : null;
    if (!imgAfterSrc) imgAfterSrc = (vtonResultEl && vtonResultEl !== beforeImageElement && vtonResultEl !== refImageElement) ? getBase64Image(vtonResultEl) : null;

    // Convert all URLs to base64 to ensure html2canvas can render them
    imgBeforeSrc = await urlToBase64(imgBeforeSrc);
    imgRefSrc = await urlToBase64(imgRefSrc);
    imgAfterSrc = await urlToBase64(imgAfterSrc);`
);

fs.writeFileSync(file, content);
