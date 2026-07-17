const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const regex = /let attempts = 0;[\s\S]*?throw new Error\("Превышено время ожидания генерации \(таймаут 10 мин\)\."\);/m;

const newLoop = `let attempts = 0;
  let consecutiveErrors = 0;
  while (attempts < 120) {
    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(r => setTimeout(r, 5000)); // 5 seconds interval
    attempts++;
        
    try {
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
  }
  
  throw new Error("Превышено время ожидания генерации (таймаут 10 мин).");`;

code = code.replace(regex, newLoop);
fs.writeFileSync('src/services/api.ts', code);
console.log("Updated polling loop in api.ts");
