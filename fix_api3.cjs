const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const targetStr = `  // Poll for status
  console.log('[pollJob] Начинаю опрос, jobId:', jobId);
  let attempts = 0;
  let consecutiveErrors = 0;
  while (attempts < 120) {
    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(r => setTimeout(r, 5000)); // 5 seconds interval
    attempts++;
        
    try {
      const urlWithCacheBust = \`/api/generate-full/status?t=\$\{Date.now()\}\`;
      console.log('[pollJob] Sending POST to:', urlWithCacheBust);
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
      console.log('[pollJob] Response data:', statusData);
            
      if (statusData.status === "done") {
        return { imageUrl: statusData.imageUrl, referenceImage: statusData.referenceImage };
      } else if (statusData.status === "error") {
        const errorMsg = statusData.error || "Ошибка генерации на сервере.";
        await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              level: 'error',
              message: \`[pollJob] Ошибка: \$\{errorMsg\}\`,
              userId: localStorage.getItem('userId') || 'unknown'
            })
        }).catch(() => {});
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      consecutiveErrors++;
      if (consecutiveErrors > 15 && !err.message.includes("Aborted") && !err.message.includes("таймаут")) {
         const errorMessage = err.message || "Многократная ошибка сети при проверке статуса.";
         await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              level: 'error',
              message: \`[pollJob] Ошибка: \$\{errorMessage\}\`,
              userId: localStorage.getItem('userId') || 'unknown'
            })
         }).catch(() => {});
         throw new Error(errorMessage);
      }
      console.warn("Polling error:", err);
    }
  }
  
  const timeoutMsg = "Превышено время ожидания генерации (таймаут 10 мин).";
  await fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level: 'error',
      message: \`[pollJob] Ошибка: \$\{timeoutMsg\}\`,
      userId: localStorage.getItem('userId') || 'unknown'
    })
  }).catch(() => {});
  throw new Error(timeoutMsg);`;

const replacementStr = `  return { isAsync: true, jobId };`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/services/api.ts', code);
console.log("Updated api.ts to remove polling (correctly)");
