const API_KEY = process.env.FAL_KEY;
async function run() {
  console.log("Calling face swap...");
  const swapRes = await fetch("https://fal.run/fal-ai/face-swap", {
    method: "POST",
    headers: {
      "Authorization": `Key ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      base_image_url: "https://v3b.fal.media/files/b/0aa0dd8e/Q680MDfxzDJgtEB8k_CQK.jpg",
      swap_image_url: "https://v3b.fal.media/files/b/0aa0dd8d/yjyxOc1VCdP6zo5eHNMZT.jpg"
    })
  });
  console.log("Status:", swapRes.status);
  const text = await swapRes.text();
  console.log("Body:", text);
}
run();
