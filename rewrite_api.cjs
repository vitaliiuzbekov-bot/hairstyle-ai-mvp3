const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

code = code.replace(
  `  if (data.imageUrl) {
    return data;
  }

  const jobId = data.jobId;
  if (!jobId) {
    throw new Error("Не удалось получить ID задачи от сервера.");
  }

  return { isAsync: true, jobId };`,
  `  if (data.imageUrl) {
    return data;
  }
  
  if (data.status === 'completed' && data.result) {
    return data.result;
  }

  const jobId = data.jobId;
  if (!jobId) {
    throw new Error("Не удалось получить результат генерации от сервера.");
  }

  return { isAsync: true, jobId };`
);

fs.writeFileSync('src/services/api.ts', code);
console.log("Rewrote api.ts");
