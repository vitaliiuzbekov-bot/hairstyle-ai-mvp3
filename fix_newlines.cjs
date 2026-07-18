const fs = require('fs');
let code = fs.readFileSync('./src/server/adapters/FalAdapter.ts', 'utf-8');
code = code.replace(/\\n\\nprivate extractUrl/, '\n\n  private extractUrl');
fs.writeFileSync('./src/server/adapters/FalAdapter.ts', code);
