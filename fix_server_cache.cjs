const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

code = code.replace(
    /if \(jobMap\.has\(jobId\)\) \{ return res\.json\(jobMap\.get\(jobId\)\); \}/,
    'if (jobMap.has(jobId)) { res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); return res.json(jobMap.get(jobId)); }'
);

code = code.replace(
    /res\.json\(doc\.data\(\)\);/,
    'res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); res.json(doc.data());'
);

fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Fixed server cache");
