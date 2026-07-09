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
  const seed = 555;
  const prompt = "Split screen photograph. Left half: 25 year old woman with messy frizzy long hair. Right half: exact same woman with sleek short bob haircut. Identical mirror clone faces. Symmetrical, centered. Photorealistic.";
  
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${seed}&width=1600&height=800`;
  
  console.log("Downloading split image...");
  const buf = await download(url);
  fs.writeFileSync('split_test.jpg', buf);
  console.log("Done.");
}
run();
