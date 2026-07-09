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
  const seed = 5021;
  // A generic prompt for a split-screen photo of a haircut before-and-after
  const prompt = "Split screen before-and-after portrait photograph. Left half: young woman with messy frizzy unstyled hair. Right half: exact same woman with elegant sleek straight short bob haircut. Perfect mirror clone, identical makeup, centered, symmetrical. High quality.";
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${seed}`;
  
  console.log("Downloading split image...");
  const buf = await download(url);
  fs.writeFileSync('raw_split2.jpg', buf);
  
  const image = await Jimp.read('raw_split2.jpg');
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  console.log(`Image dimensions: ${w}x${h}`);
  
  const templateW = Math.floor(w * 0.1);
  const templateH = Math.floor(h * 0.2);
  const templateX = Math.floor(w * 0.25) - Math.floor(templateW / 2);
  const templateY = Math.floor(h * 0.4);
  
  let bestOffset = 0;
  let minDiff = Infinity;
  
  const searchBaseX = Math.floor(w * 0.75) - Math.floor(templateW / 2);
  
  console.log("Scanning for optimal alignment...");
  for (let offsetX = -30; offsetX <= 30; offsetX++) {
    let diff = 0;
    const searchX = searchBaseX + offsetX;
    
    for (let y = 0; y < templateH; y++) {
      for (let x = 0; x < templateW; x++) {
        const p1 = image.getPixelColor(templateX + x, templateY + y);
        const p2 = image.getPixelColor(searchX + x, templateY + y);
        
        const r1 = (p1 >> 24) & 255; const g1 = (p1 >> 16) & 255; const b1 = (p1 >> 8) & 255;
        const r2 = (p2 >> 24) & 255; const g2 = (p2 >> 16) & 255; const b2 = (p2 >> 8) & 255;
        
        diff += Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
      }
    }
    
    if (diff < minDiff) {
      minDiff = diff;
      bestOffset = offsetX;
    }
  }
  
  const rightCenter = searchBaseX + bestOffset + Math.floor(templateW / 2);
  const leftCenter = templateX + Math.floor(templateW / 2);
  console.log(`Left face center: ${leftCenter}`);
  console.log(`Right face center: ${rightCenter}`);
  
  const cropW = Math.floor(w * 0.4);
  const cropH = h;
  
  const leftCropX = Math.floor(leftCenter - cropW / 2);
  const rightCropX = Math.floor(rightCenter - cropW / 2);
  
  console.log(`Cropping Left: X=${leftCropX}, W=${cropW}`);
  console.log(`Cropping Right: X=${rightCropX}, W=${cropW}`);

  const leftImg = await Jimp.read('raw_split2.jpg');
  leftImg.crop({ x: leftCropX, y: 0, w: cropW, h: cropH });
  const bufLeft = await leftImg.getBuffer('image/jpeg');

  const rightImg = await Jimp.read('raw_split2.jpg');
  rightImg.crop({ x: rightCropX, y: 0, w: cropW, h: cropH });
  const bufRight = await rightImg.getBuffer('image/jpeg');
  
  const content = `
export const leftImage = "data:image/jpeg;base64,${bufLeft.toString('base64')}";
export const rightImage = "data:image/jpeg;base64,${bufRight.toString('base64')}";
`;
  fs.writeFileSync('src/assets/slider-images.ts', content);
  console.log("Written aligned images to src/assets/slider-images.ts");
}
run();
