import fs from 'fs';
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf-8');

if (!content.includes('import fetch from "node-fetch"')) {
    content = content.replace('import { checkAndDeductGeneration, refundGeneration } from "../utils/billing";', 
    'import { checkAndDeductGeneration, refundGeneration } from "../utils/billing";\nimport fetch from "node-fetch";');
    fs.writeFileSync('src/server/routes/generate.ts', content, 'utf-8');
    console.log("Patched fetch");
} else {
    console.log("Already has fetch");
}
