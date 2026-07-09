import fs from "fs";
import { Jimp } from "jimp";

async function run() {
  const image = await Jimp.read('split_test2.jpg');
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  const templateW = 100;
  const templateH = 150;
  const templateX = Math.floor(w * 0.25) - Math.floor(templateW / 2);
  const templateY = Math.floor(h * 0.3);
  
  let bestOffsetX = 0;
  let bestOffsetY = 0;
  let minDiff = Infinity;
  
  const searchBaseX = Math.floor(w * 0.75) - Math.floor(templateW / 2);
  
  for (let offsetY = -30; offsetY <= 30; offsetY+=2) {
    for (let offsetX = -40; offsetX <= 40; offsetX+=2) {
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
  
  const rightCenter = searchBaseX + bestOffsetX + Math.floor(templateW / 2);
  const leftCenter = templateX + Math.floor(templateW / 2);
  
  const cropW = 500;
  const marginY = Math.abs(bestOffsetY);
  const finalCropH = h - marginY;
  
  let leftCropX = Math.floor(leftCenter - cropW / 2);
  let rightCropX = Math.floor(rightCenter - cropW / 2);
  
  // Constrain X so we don't go out of bounds
  // We want to KEEP THE FACE CENTERED. So we shouldn't just shift X. We must reduce cropW if needed.
  if (leftCropX < 0) {
    const diff = 0 - leftCropX;
    leftCropX = 0;
    // but now the face is not at center!
    // to keep it centered, we must crop equally from both sides
  }
  
  // Better approach: calculate safe radius
  const maxRadiusX = Math.min(leftCenter, w/2 - leftCenter, rightCenter - w/2, w - rightCenter);
  const safeCropW = Math.floor(maxRadiusX * 2);
  console.log(`Max Safe Crop Width: ${safeCropW}`);
  
  const finalCropW = Math.min(500, safeCropW);
  
  leftCropX = Math.floor(leftCenter - finalCropW / 2);
  rightCropX = Math.floor(rightCenter - finalCropW / 2);
  
  let leftCropY = bestOffsetY > 0 ? 0 : -bestOffsetY;
  let rightCropY = bestOffsetY > 0 ? bestOffsetY : 0;
  
  console.log(`Left Crop: X=${leftCropX}, Y=${leftCropY}, W=${finalCropW}, H=${finalCropH}`);
  console.log(`Right Crop: X=${rightCropX}, Y=${rightCropY}, W=${finalCropW}, H=${finalCropH}`);
  
  const leftImg = await Jimp.read('split_test2.jpg');
  leftImg.crop({ x: leftCropX, y: leftCropY, w: finalCropW, h: finalCropH });
  const bufLeft = await leftImg.getBuffer('image/jpeg');
  
  const rightImg = await Jimp.read('split_test2.jpg');
  rightImg.crop({ x: rightCropX, y: rightCropY, w: finalCropW, h: finalCropH });
  const bufRight = await rightImg.getBuffer('image/jpeg');
  
  const content = `
export const leftImage = "data:image/jpeg;base64,${bufLeft.toString('base64')}";
export const rightImage = "data:image/jpeg;base64,${bufRight.toString('base64')}";
`;
  fs.writeFileSync('src/assets/slider-images.ts', content);
  console.log("Written aligned images to src/assets/slider-images.ts");
}
run();
