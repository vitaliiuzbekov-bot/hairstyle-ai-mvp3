import fs from "fs";
import https from "https";
import { Jimp } from "jimp";

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function run() {
  const seed = 123456;
  const basePrompt = "Passport photo of a 25 year old woman facing camera perfectly centered. Beautiful, plain background, photorealistic. ";
  
  const url1 = `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt + "Messy curly hair.")}?nologo=true&seed=${seed}&width=800&height=800`;
  const url2 = `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt + "Short sleek bob hair.")}?nologo=true&seed=${seed}&width=800&height=800`;
  
  console.log("Downloading image 1...");
  const buf1 = await download(url1);
  fs.writeFileSync('img1.jpg', buf1);
  
  console.log("Downloading image 2...");
  const buf2 = await download(url2);
  fs.writeFileSync('img2.jpg', buf2);
  
  const img1 = await Jimp.read('img1.jpg');
  const img2 = await Jimp.read('img2.jpg');
  
  let diff = 0;
  // Compare a central patch (the face)
  for (let y = 300; y < 500; y+=2) {
    for (let x = 300; x < 500; x+=2) {
      const p1 = img1.getPixelColor(x, y);
      const p2 = img2.getPixelColor(x, y);
      const r1 = (p1 >> 24) & 255; const g1 = (p1 >> 16) & 255; const b1 = (p1 >> 8) & 255;
      const r2 = (p2 >> 24) & 255; const g2 = (p2 >> 16) & 255; const b2 = (p2 >> 8) & 255;
      diff += Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    }
  }
  console.log("Face difference:", diff);
}
run();
