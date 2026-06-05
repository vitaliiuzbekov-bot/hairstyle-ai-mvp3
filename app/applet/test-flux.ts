import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const falKey = process.env.FAL_KEY;
  console.log("Starting fal request...", falKey ? "key present" : "no key");
  const res = await fetch("https://fal.run/fal-ai/flux-general/image-to-image", {
    method: "POST",
    headers: {
      "Authorization": `Key ${falKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image_url: "https://raw.githubusercontent.com/CompVis/latent-diffusion/main/data/inpainting_examples/overture-creations-5sI6fQgYIuo.png", // Just a demo image
      prompt: "A photorealistic portrait of a young man, strictly bright blonde hair. keep face exactly identical.",
      strength: 0.95,
      guidance_scale: 5.5,
      controlnets: [
        {
          path: "Shakker-Labs/FLUX.1-dev-ControlNet-Union-Pro",
          variant: "depth",
          conditioning_scale: 0.8
        }
      ]
    })
  });
  if (!res.ok) {
    console.error("Error", res.status, await res.text());
  } else {
    const data: any = await res.json();
    console.log("Success!", data.images[0].url);
  }
}
run().catch(console.error);
