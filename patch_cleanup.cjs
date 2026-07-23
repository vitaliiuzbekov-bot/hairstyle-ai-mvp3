const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const cleanupCode = `
const jobMap = new Map<string, any>();

// Memory leak prevention: Clean up old jobs from in-memory map every 30 minutes
setInterval(() => {
    const now = Date.now();
    let deletedCount = 0;
    for (const [jobId, jobData] of jobMap.entries()) {
        // Remove jobs older than 1 hour
        if (jobData.createdAt && (now - jobData.createdAt > 60 * 60 * 1000)) {
            jobMap.delete(jobId);
            deletedCount++;
        }
    }
    if (deletedCount > 0) {
        console.log(\`[Cleanup] Removed \${deletedCount} stale jobs from memory.\`);
    }
}, 30 * 60 * 1000);
`;

code = code.replace('const jobMap = new Map<string, any>();', cleanupCode);
fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Added jobMap cleanup");
