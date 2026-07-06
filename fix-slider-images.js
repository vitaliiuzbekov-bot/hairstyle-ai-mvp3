import fetch from "node-fetch";
import fs from "fs";

async function download(url, dest) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

async function run() {
  const falKey = process.env.FAL_KEY;
  if (!falKey) { console.log("No key"); return; }
  
  console.log("Generating base image...");
  const baseRes = await fetch("https://fal.run/fal-ai/flux/dev", {
    method: "POST",
    headers: {
      "Authorization": "Key " + falKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: "A beautiful centered headshot portrait of a woman with long dark wavy hair. She is looking directly at the camera. Professional studio lighting, plain background. Perfect alignment.",
      image_size: "portrait_4_3",
      num_inference_steps: 28,
      seed: 42
    })
  });
  const baseData = await baseRes.json();
  const baseImageUrl = baseData.images[0].url;
  
  console.log("Generating target image...");
  const targetRes = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      "Authorization": "Key " + falKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: "A beautiful centered headshot portrait of a woman with a sleek short blonde bob haircut. She is looking directly at the camera. Professional studio lighting, plain background. Perfect alignment. Face is exactly the same as the original.",
      image_url: baseImageUrl,
      strength: 0.95,
      num_inference_steps: 4,
      seed: 42
    })
  });
  const targetData = await targetRes.json();
  const targetImageUrl = targetData.images[0].url;

  console.log("Face swapping...");
  const swapRes = await fetch("https://fal.run/fal-ai/face-swap", {
    method: "POST",
    headers: {
      "Authorization": "Key " + falKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      base_image_url: targetImageUrl,
      swap_image_url: baseImageUrl
    })
  });
  const swapData = await swapRes.json();
  const finalImageUrl = swapData.image.url;
  
  console.log("Downloading images...");
  await download(baseImageUrl, "public/slider-before.jpg");
  await download(finalImageUrl, "public/slider-after.jpg");
  console.log("Done!");
}
run().catch(console.error);
