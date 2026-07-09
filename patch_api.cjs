const fs = require('fs');
let content = fs.readFileSync('src/services/api.ts', 'utf8');

content = content.replace(
  `const pollRes = await fetchWithRetry(\`/api/analyze-job/\${data.jobId}\`);`,
  `const pollRes = await fetchWithRetry(\`/api/analyze-job/\${data.jobId}\`, {});`
);
content = content.replace(
  `const pollRes = await fetchWithRetry(\`/api/job/\${data.jobId}\`);`,
  `const pollRes = await fetchWithRetry(\`/api/job/\${data.jobId}\`, {});`
);

fs.writeFileSync('src/services/api.ts', content);
console.log("Patched api.ts successfully");
