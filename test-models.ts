import fetch from 'node-fetch';

async function listModels() {
  const falKey = process.env.FAL_KEY;
  const res = await fetch("https://fal.ai/api/models/fal-ai", {
    headers: { "Authorization": `Bearer ${falKey}` }
  });
  console.log(res.status);
}
listModels();
