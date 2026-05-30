import "dotenv/config";

async function listEndpoints() {
    try {
        const res = await fetch("https://fal.run/fal-ai/flux-general/openapi.json", {
            headers: { 
                "Authorization": `Key ${process.env.FAL_KEY}`,
            }
        });
        const json = await res.json();
        const sc = json?.components?.schemas;
        const schemaName = Object.keys(sc || {}).find(k => k.toLowerCase().includes("inpaint"));
        if (schemaName) {
            console.log(schemaName, ":", Object.keys(sc[schemaName].properties || {}));
        } else {
            console.log("Schemas:", Object.keys(sc || {}));
        }
    } catch (e) {
        console.error("ERROR:",  e);
    }
}
listEndpoints();
