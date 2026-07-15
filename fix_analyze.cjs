const fs = require('fs');
let code = fs.readFileSync('src/server/routes/analysis.ts', 'utf8');

// We need to completely replace lines 80 through 90 with nothing,
// replace the closing of the background task with nothing, 
// and replace analyzeJobMap.set with res.json.

// Find the job map polling route and remove it
code = code.replace(/analysisRouter\.get\("\/job\/:jobId"[\s\S]*?\n\}\);\n+/, '');

// Find the code to replace:
// const jobId = req.body.idempotencyKey || crypto.randomUUID();
// if (analyzeJobMap.has(jobId) && analyzeJobMap.get(jobId).status === 'processing') {
//   res.json({ jobId });
//   return;
// }
// 
// analyzeJobMap.set(jobId, { status: 'processing' });
// 
// // Start background task
// (async () => {
//   try {

code = code.replace(/const jobId = req\.body\.idempotencyKey \|\| crypto\.randomUUID\(\);\s*if \(analyzeJobMap\.has\(jobId\) && analyzeJobMap\.get\(jobId\)\.status === 'processing'\) \{\s*res\.json\(\{ jobId \}\);\s*return;\s*\}\s*analyzeJobMap\.set\(jobId, \{ status: 'processing' \}\);\s*\/\/\s*Start background task\s*\(async \(\) => \{\s*try \{/, '');

code = code.replace(/analyzeJobMap\.set\(jobId, \{ status: 'completed', result: parsedResults \}\);/, 'res.json(parsedResults);');

code = code.replace(/analyzeJobMap\.set\(jobId, \{ status: 'error', error: errorMsg \}\);/, 'if (!res.headersSent) res.status(500).json({ error: errorMsg });');

const lines = code.split('\n');
let finalLines = [];
let skipNext = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '} catch (err: any) {' && lines[i+1].includes('let errorMsg = err.message || err.toString();')) {
        // This is the catch block of the background task.
        finalLines.push(lines[i]);
    } else if (lines[i].trim() === '})();' && lines[i+1].trim() === '});') {
        // Skip this one!
    } else {
        finalLines.push(lines[i]);
    }
}
fs.writeFileSync('src/server/routes/analysis.ts', finalLines.join('\n'));
