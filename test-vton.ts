import "dotenv/config";

async function run() {
    const imageUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=512&q=80"; // random face
    
    // 1. I2I
    let endpoint = "https://fal.run/fal-ai/flux/dev/image-to-image";
    let bodyPayload = {
      image_url: imageUrl,
      prompt: "Studio portrait closeup of the SAME person, face centered, looking straight, ABSOLUTELY NEUTRAL EXPRESSION NO SMILE, beautiful young woman. CRITICAL: Give this person a NEW HAIRCUT: \"Short blue bob hair\".",
      strength: 0.95,
      num_inference_steps: 30
    };
    
    const fluxRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyPayload)
    });
    const fluxData = await fluxRes.json();
    console.log("Flux I2I:", fluxData.images?.[0]?.url);
    const generatedUrl = fluxData.images?.[0]?.url;

    // 2. FaceSwap
    const falRes = await fetch("https://fal.run/fal-ai/face-swap", {
      method: "POST",
      headers: {
        "Authorization": `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        base_image_url: generatedUrl,
        swap_image_url: imageUrl
      })
    });
    const swapData = await falRes.json();
    console.log("FaceSwap:", swapData.image?.url || swapData.image_url || swapData.url);
}
run();
