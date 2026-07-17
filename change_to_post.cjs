const fs = require('fs');

// Update generate.ts
let generateCode = fs.readFileSync('src/server/routes/generate.ts', 'utf8');
generateCode = generateCode.replace(
    /generateRouter\.get\("\/generate-full\/status", async \(req, res\) => {/,
    'generateRouter.post("/generate-full/status", async (req, res) => {'
);
generateCode = generateCode.replace(
    /const { jobId } = req\.query;/,
    'const { jobId } = req.body;'
);
fs.writeFileSync('src/server/routes/generate.ts', generateCode);

// Update api.ts
let apiCode = fs.readFileSync('src/services/api.ts', 'utf8');
apiCode = apiCode.replace(
    /const statusRes = await fetch\(`\/api\/generate-full\/status\?jobId=\$\{jobId\}&t=\$\{Date\.now\(\)\}`, \{ signal, cache: "no-store" \}\);/,
    'const statusRes = await fetch(`/api/generate-full/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }), signal, cache: "no-store" });'
);
fs.writeFileSync('src/services/api.ts', apiCode);

console.log("Changed to POST");
