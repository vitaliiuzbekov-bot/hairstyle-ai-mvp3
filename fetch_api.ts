import fs from "fs";

async function go() {
  const falKey = process.env.FAL_KEY;
  const falRes = await fetch("https://fal.run/fal-ai/flux-general/openapi.json", {
    headers: {
      "Authorization": `Key ${falKey}`,
      "Content-Type": "application/json"
    }
  });
  const data = await falRes.text();
  fs.writeFileSync("openapi_general.json", data);
  console.log("Written openapi_general.json", data.length);
}
go();
