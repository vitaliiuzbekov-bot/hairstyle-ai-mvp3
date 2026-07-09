import fs from "fs";
import https from "https";

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
  const seed = 999;
  const prompt = "High quality photorealistic split screen portrait. Left side: beautiful 25 year old woman with messy long hair. Right side: EXACT same woman with sleek short bob haircut. Identical face, symmetrical, 100% centered.";
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${seed}&width=1600&height=800`;
  
  console.log("Downloading split image...");
  const buf = await download(url);
  fs.writeFileSync('split_test2.jpg', buf);
  console.log("Done.");
}
run();
