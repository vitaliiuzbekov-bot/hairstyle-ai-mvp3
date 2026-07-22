const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const replacement = `
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        const filePath = path.join(tmpDir, filename);
`;

content = content.replace("const filePath = path.join(process.cwd(), 'tmp', filename);", replacement);
fs.writeFileSync('src/server/routes/telegramExport.ts', content);
console.log("Patched telegramExportRouter tmp dir creation!");
