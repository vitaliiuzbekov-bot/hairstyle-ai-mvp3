import fs from "fs";
const falKey = process.env.FAL_KEY;
async function test() {
    const base = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const swap = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    
    const falRes = await fetch("https://fal.run/fal-ai/face-swap", {
        method: "POST",
        headers: {
            "Authorization": `Key ${falKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            base_image_url: base,
            swap_image_url: swap
        })
    });
    console.log(falRes.status, await falRes.text());
}
test().catch(console.error);
