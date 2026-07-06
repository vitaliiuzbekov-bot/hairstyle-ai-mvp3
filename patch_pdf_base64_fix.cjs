const fs = require('fs');
let file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

const helperCode = `
async function urlToBase64(url) {
  if (!url || url.startsWith('data:')) return url;
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Failed to fetch image to base64:", url, e);
    return url;
  }
}
`;

// Insert helper before exportToPDF
content = content.replace('export const exportToPDF = async', helperCode + '\nexport const exportToPDF = async');

// Replace the image assignments
content = content.replace(
  'let imgBeforeSrc = images?.before;\n    if (!imgBeforeSrc) imgBeforeSrc = beforeImageElement ? getBase64Image(beforeImageElement) : null;',
  `let imgBeforeSrc = images?.before;
    if (imgBeforeSrc) { imgBeforeSrc = await urlToBase64(imgBeforeSrc); }
    if (!imgBeforeSrc) imgBeforeSrc = beforeImageElement ? getBase64Image(beforeImageElement) : null;
    
    let imgRefSrc = images?.reference;
    if (imgRefSrc) imgRefSrc = await urlToBase64(imgRefSrc);
    
    let imgAfterSrc = images?.after;
    if (imgAfterSrc) imgAfterSrc = await urlToBase64(imgAfterSrc);`
);

fs.writeFileSync(file, content);
