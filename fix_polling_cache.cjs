const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

code = code.replace(
    /const statusRes = await fetch\(`\/api\/generate-full\/status\?jobId=\\?\$\{jobId\}`,\s*\{\s*signal\s*\}\);/,
    'const statusRes = await fetch(`/api/generate-full/status?jobId=${jobId}&t=${Date.now()}`, { signal, cache: "no-store" });'
);

fs.writeFileSync('src/services/api.ts', code);
console.log("Fixed polling cache");
