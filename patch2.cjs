const fs = require('fs');
let code = fs.readFileSync('src/components/ImageSlider.tsx', 'utf8');

const target = `  const leftImage = matchingHistory?.originalUrl || matchingHistory?.blobDataUrl || localResult?.originalUrl || defaultLeft;
  const rightImage = resultImage || localResult?.imageUrl || defaultRight;`;

const replacement = `  let leftImage = defaultLeft;
  let rightImage = defaultRight;

  if (resultImage) {
    if (matchingHistory?.originalUrl || matchingHistory?.blobDataUrl) {
      leftImage = matchingHistory.originalUrl || matchingHistory.blobDataUrl;
      rightImage = resultImage;
    } else if (localResult?.imageUrl === resultImage && localResult?.originalUrl) {
      leftImage = localResult.originalUrl;
      rightImage = resultImage;
    } else {
      leftImage = defaultLeft;
      rightImage = defaultRight;
    }
  } else if (localResult?.imageUrl && localResult?.originalUrl) {
      leftImage = localResult.originalUrl;
      rightImage = localResult.imageUrl;
  }`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/ImageSlider.tsx', code.replace(target, replacement));
  console.log('Patched ImageSlider successfully');
} else {
  console.log('Target not found in ImageSlider');
}
