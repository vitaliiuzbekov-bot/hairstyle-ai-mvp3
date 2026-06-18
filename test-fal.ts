import fetch from "node-fetch";
async function test() {
  const res = await fetch("https://fal.run/fal-ai/flux/dev/inpaint", { method: 'OPTIONS' });
  console.log("dev/inpaint:", res.status);
  
  const res3 = await fetch("https://fal.run/fal-ai/flux/inpaint", { method: 'OPTIONS' });
  console.log("flux/inpaint:", res3.status);
}
test();
