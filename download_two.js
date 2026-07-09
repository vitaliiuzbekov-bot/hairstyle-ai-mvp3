import fs from "fs";
import https from "https";
import { Jimp } from "jimp";

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
    }).on('error', reject);
  });
}

async function run() {
  const seed = 8888;
  const prompt1 = "close-up portrait of a 25 year old woman with long frizzy messy unstyled hair. facing camera directly, neutral expression, studio lighting, plain background. centered, symmetrical.";
  const prompt2 = "close-up portrait of a 25 year old woman with short sleek straight bob haircut. facing camera directly, neutral expression, studio lighting, plain background. centered, symmetrical.";
  
  const url1 = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt1)}?nologo=true&seed=${seed}`;
  const url2 = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt2)}?nologo=true&seed=${seed}`;
  
  console.log("Downloading image 1...");
  const buf1 = await download(url1);
  fs.writeFileSync('img1.jpg', buf1);
  
  console.log("Downloading image 2...");
  const buf2 = await download(url2);
  fs.writeFileSync('img2.jpg', buf2);
  
  const img1 = await Jimp.read('img1.jpg');
  const img2 = await Jimp.read('img2.jpg');
  
  const w = img1.bitmap.width;
  const h = img1.bitmap.height;
  console.log(`Image dimensions: ${w}x${h}`);
  
  // Take template from img1 face center
  const templateW = Math.floor(w * 0.2);
  const templateH = Math.floor(h * 0.2);
  const templateX = Math.floor(w / 2) - Math.floor(templateW / 2);
  const templateY = Math.floor(h * 0.4);
  
  let bestOffsetX = 0;
  let bestOffsetY = 0;
  let minDiff = Infinity;
  
  console.log("Scanning for optimal alignment...");
  for (let offsetY = -50; offsetY <= 50; offsetY++) {
    for (let offsetX = -50; offsetX <= 50; offsetX++) {
      let diff = 0;
      const searchX = templateX + offsetX;
      const searchY = templateY + offsetY;
      
      for (let y = 0; y < templateH; y+=2) {
        for (let x = 0; x < templateW; x+=2) {
          const p1 = img1.getPixelColor(templateX + x, templateY + y);
          const p2 = img2.getPixelColor(searchX + x, searchY + y);
          
          const r1 = (p1 >> 24) & 255; const g1 = (p1 >> 16) & 255; const b1 = (p1 >> 8) & 255;
          const r2 = (p2 >> 24) & 255; const g2 = (p2 >> 16) & 255; const b2 = (p2 >> 8) & 255;
          
          diff += Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
        }
      }
      
      if (diff < minDiff) {
        minDiff = diff;
        bestOffsetX = offsetX;
        bestOffsetY = offsetY;
      }
    }
  }
  
  console.log(`Alignment offset: X=${bestOffsetX}, Y=${bestOffsetY}`);
  
  // Determine common crop area
  // Base image is img1, cropped to some box.
  // We want to maximize the crop area, avoiding edges.
  const marginX = Math.abs(bestOffsetX);
  const marginY = Math.abs(bestOffsetY);
  
  const cropX = marginX;
  const cropY = marginY;
  const cropW = w - 2 * marginX;
  const cropH = h - 2 * marginY;
  
  console.log(`Cropping base: X=${cropX}, Y=${cropY}, W=${cropW}, H=${cropH}`);
  
  // Crop img1
  const img1_crop = await Jimp.read('img1.jpg');
  // img1 crop needs to center the face, wait. 
  // If we just crop the intersection:
  // For img1 (template is at 0 offset)
  const leftCropX = Math.max(0, -bestOffsetX);
  const leftCropY = Math.max(0, -bestOffsetY);
  img1_crop.crop({ x: leftCropX, y: leftCropY, w: cropW, h: cropH });
  const bufLeft = await img1_crop.getBuffer('image/jpeg');

  // For img2 (template is at bestOffset)
  const rightCropX = Math.max(0, bestOffsetX);
  const rightCropY = Math.max(0, bestOffsetY);
  const img2_crop = await Jimp.read('img2.jpg');
  img2_crop.crop({ x: rightCropX, y: rightCropY, w: cropW, h: cropH });
  const bufRight = await img2_crop.getBuffer('image/jpeg');
  
  const content = `
export const leftImage = "data:image/jpeg;base64,${bufLeft.toString('base64')}";
export const rightImage = "data:image/jpeg;base64,${bufRight.toString('base64')}";
`;
  fs.writeFileSync('src/assets/slider-images.ts', content);
  console.log("Written perfectly aligned dual images to src/assets/slider-images.ts");
}
run();
