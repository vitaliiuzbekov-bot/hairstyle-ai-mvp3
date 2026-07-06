import * as fal from "@fal-ai/serverless-client";
fal.config({ credentials: process.env.FAL_KEY || "dummy" });

async function test() {
    const base = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60";
    const swap = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60";
    try {
        const res = await fal.subscribe("fal-ai/face-swap", {
            input: {
                base_image_url: base,
                swap_image_url: swap
            }
        });
        console.log("Success:", res);
    } catch(e: any) {
        console.error("Error:", e.message);
        console.error(e.body);
    }
}
test().catch(console.error);
