import fetch from "node-fetch";

async function test() {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    console.log("No FAL_KEY");
    return;
  }
  
  const res = await fetch("https://fal.run/fal-ai/flux/dev/image-to-image", {
    method: "POST",
    headers: {
      "Authorization": `Key ${falKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image_url: "https://picsum.photos/512/512",
      prompt: "a cat",
      mask_image_url: "https://picsum.photos/512/512", // just testing if it rejects it
      strength: 0.9
    })
  });
  const data = await res.json();
  console.log(data);
}
test();
