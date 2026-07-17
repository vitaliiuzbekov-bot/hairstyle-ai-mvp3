const fs = require('fs');
let code = fs.readFileSync('src/components/ImageSlider.tsx', 'utf8');

const regex = /  const matchingHistory = history\?\.find\(\(h\) => h\.url === resultImage\);\n  const leftImage = matchingHistory\?\.originalUrl \|\| matchingHistory\?\.blobDataUrl \|\| defaultLeft;\n  const rightImage = resultImage \|\| defaultRight;/;

const replacement = `  const matchingHistory = history?.find((h) => h.url === resultImage);
  
  let localResult = null;
  if (!resultImage) {
    try {
      const lastResultStr = localStorage.getItem('lastResult');
      if (lastResultStr) {
        localResult = JSON.parse(lastResultStr);
      }
    } catch(e) {}
  }

  const leftImage = matchingHistory?.originalUrl || matchingHistory?.blobDataUrl || localResult?.originalUrl || defaultLeft;
  const rightImage = resultImage || localResult?.imageUrl || defaultRight;`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/ImageSlider.tsx', code);
console.log("Rewrote ImageSlider.tsx");
