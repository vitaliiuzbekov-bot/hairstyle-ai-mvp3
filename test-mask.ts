import "dotenv/config";

async function run() {
    const maskSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="white" />
        <circle cx="256" cy="256" r="100" fill="black" />
    </svg>`;
    const maskBase64 = "data:image/svg+xml;base64," + Buffer.from(maskSvg).toString('base64');
    
    const imgSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="red" />
    </svg>`;
    const imgBase64 = "data:image/svg+xml;base64," + Buffer.from(imgSvg).toString('base64');

    try {
        const endpoints = [
            "https://fal.run/fal-ai/flux/dev/image-to-image",
            "https://fal.run/fal-ai/flux/dev/inpainting",
            "https://fal.run/fal-ai/flux-general/image-to-image",
            "https://fal.run/fal-ai/flux-general/inpainting"
        ];
        
        for (const ep of endpoints) {
            console.log("Testing:", ep);
            const res = await fetch(ep, {
                method: "POST",
                headers: { 
                    "Authorization": `Key ${process.env.FAL_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    image_url: imgBase64,
                    mask_url: maskBase64,
                    prompt: "A beautifully drawn green forest",
                    strength: 0.95
                })
            });
            console.log(ep, res.status);
            if (!res.ok) console.log(await res.text());
        }
    } catch (e) {
        console.error("ERROR:",  e);
    }
}
run();
