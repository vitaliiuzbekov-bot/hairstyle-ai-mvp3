import fs from "fs";
const falKey = process.env.FAL_KEY;
async function test() {
    const base = "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=60";
    const swap = "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=60";
    
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
