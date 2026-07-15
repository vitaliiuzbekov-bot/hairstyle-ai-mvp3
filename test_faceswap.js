import * as fal from '@fal-ai/serverless-client';
import dotenv from 'dotenv';
dotenv.config();

fal.config({ credentials: process.env.FAL_API_KEY || process.env.FAL_KEY });

async function run() {
    try {
        const result = await fal.subscribe('fal-ai/face-swap', {
            input: {
                base_image_url: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600",
                // Passing a valid URL that is NOT an image, or a broken image
                swap_image_url: "https://example.com"
            },
            logs: false,
        });
        console.log(result);
    } catch(e) {
        console.error("Error from FAL:", e.message || e);
    }
}
run();
