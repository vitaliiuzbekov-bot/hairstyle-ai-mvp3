import fetch from 'node-fetch';

async function test(endpoint) {
  const endpointObj = `https://fal.run/${endpoint}`;
  try {
  const res = await fetch(endpointObj, {
     method: 'POST',
     headers: { "Content-Type": "application/json", "Authorization": "Key REPLACE" },
     body: JSON.stringify({prompt: "test", image_url: "https://fal.github.io/fal-serverless/assets/demo_images/penguin.jpg"})
  });
  console.log(endpoint, res.status, res.statusText);
  const data = await res.text();
  console.log(data);
  } catch(e) { console.log(e.message); }
}

async function run() {
  await test("fal-ai/flux/dev/image-to-image");
  await test("fal-ai/flux-dev/image-to-image");
  await test("fal-ai/flux-general/image-to-image");
}
run();
