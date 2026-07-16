const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const oldPoll = `  // Poll for status
  let attempts = 0;
  while (attempts < 120) {
    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(r => setTimeout(r, 5000)); // 5 seconds interval
    attempts++;
        
    try {
      const statusRes = await fetch(\`/api/generate-full/status?jobId=\${jobId}\`, { signal });
      if (!statusRes.ok) continue;
      const statusData = await statusRes.json();
            
      if (statusData.status === "done") {
        return { imageUrl: statusData.imageUrl, referenceImage: statusData.referenceImage };
      } else if (statusData.status === "error") {
        throw new Error(statusData.error || "Ошибка генерации на сервере.");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      console.warn("Polling error:", err);
    }
  }
    
  throw new Error("Превышено время ожидания генерации (таймаут 10 мин).");`;

const newPoll = `  // Poll for status
  const maxWaitMs = 10 * 60 * 1000; // 10 minutes
  const pollIntervalMs = 5000;
  const maxAttempts = Math.floor(maxWaitMs / pollIntervalMs);
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(r => setTimeout(r, pollIntervalMs));
    attempts++;
        
    try {
      const statusRes = await fetch(\`/api/generate-full/status?jobId=\${jobId}\`, { signal });
      if (!statusRes.ok) continue;
      const statusData = await statusRes.json();
            
      if (statusData.status === "done") {
        return { imageUrl: statusData.imageUrl, referenceImage: statusData.referenceImage };
      } else if (statusData.status === "error") {
        throw new Error(statusData.error || "Ошибка генерации на сервере.");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      console.warn("Polling error:", err);
    }
  }
    
  throw new Error("Превышено время ожидания генерации (таймаут 10 мин).");`;

code = code.replace(oldPoll, newPoll);
fs.writeFileSync('src/services/api.ts', code);
console.log('updated polling');
