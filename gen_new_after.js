import * as fal from '@fal-ai/serverless-client';
import fs from 'fs';
fal.config({ credentials: process.env.FAL_KEY });

async function run() {
    console.log("Reading before image...");
    const beforeUri = "data:image/jpeg;base64," + fs.readFileSync('public/slider-before.jpg', 'base64');
    
    console.log("Generating target hairstyle image...");
    const targetResult = await fal.subscribe('fal-ai/flux/dev', {
        input: {
            prompt: "A realistic portrait photo of a young woman with a short blonde bob haircut with bangs, looking directly at the camera, neutral expression, white background, studio lighting, centered face",
            image_size: "portrait_4_3"
        }
    });
    const targetUrl = targetResult.images[0].url;
    console.log("Target URL:", targetUrl);

    console.log("Face swapping...");
    // Let's use face swap. Actually fal-ai/face-swap accepts base_image_url and swap_image_url
    try {
        const swapResult = await fal.subscribe('fal-ai/face-swap', {
            input: {
                base_image_url: targetUrl,
                swap_image_url: beforeUri
            }
        });
        const afterUrl = swapResult.image.url;
        console.log("After URL:", afterUrl);
        
        // download and save
        const fetchRes = await fetch(afterUrl);
        const buffer = await fetchRes.arrayBuffer();
        fs.writeFileSync('public/slider-after.jpg', Buffer.from(buffer));
        console.log("Saved to public/slider-after.jpg");
    } catch(e) {
        console.error("Face swap failed, trying image-to-image with higher strength...");
        const i2iResult = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
            input: {
                image_url: beforeUri,
                prompt: "A realistic portrait photo of a young woman with a short blonde pixie cut hairstyle, looking directly at the camera, neutral expression, white background, studio lighting, centered face",
                strength: 0.95
            }
        });
        const afterUrl = i2iResult.images[0].url;
        console.log("After URL (i2i):", afterUrl);
        const fetchRes = await fetch(afterUrl);
        const buffer = await fetchRes.arrayBuffer();
        fs.writeFileSync('public/slider-after.jpg', Buffer.from(buffer));
        console.log("Saved to public/slider-after.jpg");
    }
}
run().catch(console.error);
