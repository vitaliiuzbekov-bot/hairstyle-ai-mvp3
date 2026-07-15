const fs = require('fs');
let code = fs.readFileSync('src/server/routes/analysis.ts', 'utf8');

// Remove polling get route
code = code.replace(/generateRouter\.get\("\/job\/:jobId"[\s\S]*?\n\}\);\n/, '');

// Remove job map check and background wrapper
code = code.replace(/const jobId = req\.body\.idempotencyKey[\s\S]*?analyzeJobMap\.set.*?;\s*\n\s*\/\/\s*Start background task\s*\n\s*\(async \(\) => \{\s*\n\s*try \{/, '');

// Replace final analyzeJobMap.set with res.json
code = code.replace(/analyzeJobMap\.set\(jobId, \{ status: 'completed', result: parsedResults \}\);/, 'res.json(parsedResults);');

// Replace error block
code = code.replace(/analyzeJobMap\.set\(jobId, \{ status: 'error', error: errorMsg \}\);/, 'if (!res.headersSent) res.status(500).json({ error: errorMsg });');

// Find the end of the async wrapper and remove it
const lines = code.split('\n');
let newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('analyzeJobMap.set(jobId, { status: \'error\', error: errorMsg });')) {
        newLines.push('    if (!res.headersSent) res.status(500).json({ error: errorMsg });');
        continue;
    }
    if (lines[i].includes('} catch (err: any) {') && lines[i+1] && lines[i+1].includes('let errorMsg = err.message || err.toString();')) {
        // This is the catch block of the background task
        // We will keep it but it should catch the error of the main route handler
    }
    // Remove the `  })();` at the end of the route handler
    if (lines[i].trim() === '})();' && lines[i+1] && lines[i+1].trim() === '});') {
        continue; // skip `})();`
    }
    newLines.push(lines[i]);
}

fs.writeFileSync('src/server/routes/analysis.ts', newLines.join('\n'));
