const fs = require('fs');
const file = 'src/server/routes/analysis.ts';
let code = fs.readFileSync(file, 'utf8');

const duplicateBlock = `    const jobId = req.body.idempotencyKey || require('crypto').randomUUID();
    if (analyzeJobMap.has(jobId) && analyzeJobMap.get(jobId).status === 'processing') {
      res.json({ jobId });
      return;
    }
    
    analyzeJobMap.set(jobId, { status: 'processing' });
    
    // Start background task
    (async () => {
      try {
`;

// Replace the first occurrence of duplicate block + duplicate block with just one block
code = code.replace(duplicateBlock + duplicateBlock, duplicateBlock);

fs.writeFileSync(file, code);
console.log("fixed duplicate");
