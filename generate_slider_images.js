import fs from "fs";
import https from "https";

function download(url, dest) {
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
  const seed = 5000;
  const prompt1 = "highly realistic, perfect centered portrait photography of a beautiful young woman with messy frizzy unstyled long hair. studio lighting, facing camera directly, neutral expression. identical face, symmetry, 8k resolution";
  const prompt2 = "highly realistic, perfect centered portrait photography of a beautiful young woman with an elegant smooth professional short bob haircut. studio lighting, facing camera directly, neutral expression. identical face, symmetry, 8k resolution";
  
  const url1 = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt1)}?nologo=true&seed=${seed}&width=800&height=1000`;
  const url2 = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt2)}?nologo=true&seed=${seed}&width=800&height=1000`;
  
  console.log("Downloading left image...");
  const buf1 = await download(url1);
  console.log("Downloading right image...");
  const buf2 = await download(url2);
  
  const b64_1 = buf1.toString('base64');
  const b64_2 = buf2.toString('base64');
  
  const content = `
export const leftImage = "data:image/jpeg;base64,${b64_1}";
export const rightImage = "data:image/jpeg;base64,${b64_2}";
`;
  fs.writeFileSync('src/assets/slider-images.ts', content);
  console.log("Written to src/assets/slider-images.ts");
}
run();
