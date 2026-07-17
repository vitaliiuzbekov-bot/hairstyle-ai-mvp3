const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const targetStr = `    try {
      const urlWithCacheBust = \`/api/generate-full/status?t=\$\{Date.now()\}\`;
      const statusRes = await fetch(urlWithCacheBust, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ jobId }), 
        signal, 
        cache: "no-store" 
      });
      
      if (!statusRes.ok) {
        consecutiveErrors++;
        if (consecutiveErrors > 15) {
            throw new Error(\`Сервер не отвечает на запросы статуса (Код \$\{statusRes.status\}). Попробуйте позже.\`);
        }
        continue;
      }
      consecutiveErrors = 0; // reset on success
      
      const statusData = await statusRes.json();`;

const replacementStr = `    try {
      const urlWithCacheBust = \`/api/generate-full/status?t=\$\{Date.now()\}\`;
      console.log('[pollJob] Request URL:', urlWithCacheBust);
      const statusRes = await fetch(urlWithCacheBust, { 
        method: "POST", 
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }, 
        body: JSON.stringify({ jobId }), 
        signal, 
        cache: "no-store" 
      });
      console.log('[pollJob] Response status:', statusRes.status);
      
      if (!statusRes.ok) {
        consecutiveErrors++;
        if (consecutiveErrors > 15) {
            throw new Error(\`Сервер не отвечает на запросы статуса (Код \$\{statusRes.status\}). Попробуйте позже.\`);
        }
        continue;
      }
      consecutiveErrors = 0; // reset on success
      
      const statusData = await statusRes.json();
      console.log('[pollJob] Response data:', statusData);`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/services/api.ts', code);
console.log("Updated api.ts");
