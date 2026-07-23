const fs = require('fs');
let code = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const importFfmpeg = 'import { exec } from "child_process";\n';
code = code.replace(importFfmpeg, '');

// Removing ensureDataUriToBuffer
const bufStart = code.indexOf('const ensureDataUriToBuffer = async (data: string) => {');
const bufEnd = code.indexOf('};', bufStart) + 2;
code = code.substring(0, bufStart) + code.substring(bufEnd);

// Removing router.post("/send-to-telegram" ...
const sendStart = code.indexOf('router.post("/send-to-telegram"');
const sendEnd = code.indexOf('// Proxy for downloading files', sendStart);
code = code.substring(0, sendStart) + code.substring(sendEnd);

fs.writeFileSync('src/server/routes/telegramExport.ts', code);
console.log("Cleaned up telegramExport.ts");
