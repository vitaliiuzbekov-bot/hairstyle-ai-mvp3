const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const targetStr = `    if (retries > 0) {
      console.warn(\`Network error. Retrying in \$\{backoff\}ms...\`);
      await new Promise(r => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;`;

const replacementStr = `    if (retries > 0) {
      console.warn(\`Network error. Retrying in \$\{backoff\}ms...\`);
      await new Promise(r => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: \`[fetchWithRetry] Network error (\$\{url\}): \$\{err.message\}\`,
          userId: localStorage.getItem('userId') || 'unknown'
        })
    }).catch(() => {});
    throw err;`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/services/api.ts', code);
console.log("Updated api.ts fetchWithRetry");
