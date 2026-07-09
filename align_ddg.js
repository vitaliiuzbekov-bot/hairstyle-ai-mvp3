import fs from "fs";
import { Jimp } from "jimp";

async function run(filename) {
  console.log("Processing", filename);
  const image = await Jimp.read(filename);
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  const templateW = 80;
  const templateH = 120;
  const templateX = Math.floor(w * 0.25) - Math.floor(templateW / 2);
  const templateY = Math.floor(h * 0.3);
  
  let bestOffsetX = 0;
  let bestOffsetY = 0;
  let minDiff = Infinity;
  
  const searchBaseX = Math.floor(w * 0.75) - Math.floor(templateW / 2);
  
  for (let offsetY = -100; offsetY <= 100; offsetY+=2) {
    for (let offsetX = -100; offsetX <= 100; offsetX+=2) {
      let diff = 0;
      const searchX = searchBaseX + offsetX;
      const searchY = templateY + offsetY;
      for (let y = 0; y < templateH; y+=4) {
        for (let x = 0; x < templateW; x+=4) {
          const p1 = image.getPixelColor(templateX + x, templateY + y);
          const p2 = image.getPixelColor(searchX + x, searchY + y);
          const r1 = (p1 >> 24) & 255; const g1 = (p1 >> 16) & 255; const b1 = (p1 >> 8) & 255;
          const r2 = (p2 >> 24) & 255; const g2 = (p2 >> 16) & 255; const b2 = (p2 >> 8) & 255;
          diff += Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
        }
      }
      if (diff < minDiff) {
        minDiff = diff; bestOffsetX = offsetX; bestOffsetY = offsetY;
      }
    }
  }
  
  console.log(`MinDiff: ${minDiff}, Offset X: ${bestOffsetX}, Y: ${bestOffsetY}`);
  const rightCenter = searchBaseX + bestOffsetX + Math.floor(templateW / 2);
  const leftCenter = templateX + Math.floor(templateW / 2);
  
  const maxRadiusX = Math.min(leftCenter, w/2 - leftCenter, rightCenter - w/2, w - rightCenter);
  const safeCropW = Math.floor(maxRadiusX * 2);
  const finalCropW = Math.min(500, safeCropW);
  
  const leftCropX = Math.floor(leftCenter - finalCropW / 2);
  const rightCropX = Math.floor(rightCenter - finalCropW / 2);
  
  let leftCropY = bestOffsetY > 0 ? 0 : -bestOffsetY;
  let rightCropY = bestOffsetY > 0 ? bestOffsetY : 0;
  const finalCropH = h - Math.abs(bestOffsetY);
  
  const leftImg = await Jimp.read(filename);
  leftImg.crop({ x: leftCropX, y: leftCropY, w: finalCropW, h: finalCropH });
  const bufLeft = await leftImg.getBuffer('image/jpeg');
  
  const rightImg = await Jimp.read(filename);
  rightImg.crop({ x: rightCropX, y: rightCropY, w: finalCropW, h: finalCropH });
  const bufRight = await rightImg.getBuffer('image/jpeg');
  
  const content = `
export const leftImage = "data:image/jpeg;base64,${bufLeft.toString('base64')}";
export const rightImage = "data:image/jpeg;base64,${bufRight.toString('base64')}";
`;
  fs.writeFileSync('src/assets/slider-images.ts', content);
  console.log("Written aligned images to src/assets/slider-images.ts for", filename);
}
run("ddg_3.jpg").catch(e => console.error(e));
