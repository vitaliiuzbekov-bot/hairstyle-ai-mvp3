const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');
if (!code.includes('const jobMap = new Map<string, any>();')) {
  code = code.replace('export const generateRouter = Router();', 'export const generateRouter = Router();\n\nconst jobMap = new Map<string, any>();\n');
  fs.writeFileSync('src/server/routes/generate.ts', code);
}
