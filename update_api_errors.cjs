const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const oldLoop = `  while (attempts < maxAttempts) {
    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(r => setTimeout(r, pollIntervalMs));
    attempts++;
        
    try {
      const statusRes = await fetch(\`/api/generate-full/status\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }), signal, cache: "no-store" });
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
  }`;

const newLoop = `  let consecutiveErrors = 0;
  while (attempts < maxAttempts) {
    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(r => setTimeout(r, pollIntervalMs));
    attempts++;
        
    try {
      const statusRes = await fetch(\`/api/generate-full/status\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }), signal, cache: "no-store" });
      if (!statusRes.ok) {
        consecutiveErrors++;
        if (consecutiveErrors > 15) {
            throw new Error(\`Сервер не отвечает на запросы статуса (Код \${statusRes.status}). Попробуйте позже.\`);
        }
        continue;
      }
      consecutiveErrors = 0; // reset on success
      
      const statusData = await statusRes.json();
            
      if (statusData.status === "done") {
        return { imageUrl: statusData.imageUrl, referenceImage: statusData.referenceImage };
      } else if (statusData.status === "error") {
        throw new Error(statusData.error || "Ошибка генерации на сервере.");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      consecutiveErrors++;
      if (consecutiveErrors > 15 && !err.message.includes("Aborted") && !err.message.includes("таймаут")) {
         throw new Error(err.message || "Многократная ошибка сети при проверке статуса.");
      }
      console.warn("Polling error:", err);
    }
  }`;

code = code.replace(oldLoop, newLoop);
fs.writeFileSync('src/services/api.ts', code);
console.log("Updated API error handling");
