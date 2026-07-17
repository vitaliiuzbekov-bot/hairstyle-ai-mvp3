const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

const targetStr = `    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      consecutiveErrors++;
      if (consecutiveErrors > 15 && !err.message.includes("Aborted") && !err.message.includes("таймаут")) {
         throw new Error(err.message || "Многократная ошибка сети при проверке статуса.");
      }
      console.warn("Polling error:", err);
    }
  }
  
  throw new Error("Превышено время ожидания генерации (таймаут 10 мин).");`;

const replacementStr = `    } catch (err: any) {
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

code = code.replace(targetStr, replacementStr);

const targetStr2 = `      } else if (statusData.status === "error") {
        throw new Error(statusData.error || "Ошибка генерации на сервере.");
      }`;

const replacementStr2 = `      } else if (statusData.status === "error") {
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
      }`;

code = code.replace(targetStr2, replacementStr2);

fs.writeFileSync('src/services/api.ts', code);
console.log("Updated api.ts");
