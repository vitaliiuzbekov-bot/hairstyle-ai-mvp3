const fetch = require('node-fetch');
async function test() {
  const url = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/ssd_mobilenetv1_model-weights_manifest.json";
  const res = await fetch(url);
  console.log(res.status);
  console.log(await res.text());
}
test();
