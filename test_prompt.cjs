const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const regex = /let contentsPayload: any = \[.*?catch \(e\) \{\}/s;
console.log(code.substring(code.indexOf('let contentsPayload: any ='), code.indexOf('const promptRes = await geminiQueue.add(async () => {')));
