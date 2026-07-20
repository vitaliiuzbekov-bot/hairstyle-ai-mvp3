import * as fal from '@fal-ai/serverless-client';
import 'dotenv/config';

fal.config({ credentials: process.env.FAL_KEY });

async function run() {
    try {
        console.log("Subscribing...");
        const res = await fal.subscribe("fal-ai/face-swap", {
            input: {
                base_image_url: "https://v3b.fal.media/files/b/0aa2f89b/-v_pRhqaANnRe5gQzBH2r_1784526215982.jpeg",
                swap_image_url: "https://v3b.fal.media/files/b/0aa2f89a/PVJppJXj8Ja9PewgsfXYb_1784526210355.jpeg"
            },
            mode: "streaming"
        });
        console.log("Success:", res);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
