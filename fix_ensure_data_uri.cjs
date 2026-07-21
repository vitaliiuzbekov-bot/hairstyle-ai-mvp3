const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const regex = /const ensureDataUriToBuffer = async \(data: string\): Promise<Buffer> => \{[\s\S]*?    if \(data\.startsWith\('http'\)\) \{/;

const replacement = `const ensureDataUriToBuffer = async (data: string): Promise<Buffer> => {
    if (data.startsWith('/api/proxy-image?url=')) {
        const url = decodeURIComponent(data.split('url=')[1]);
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    if (data.startsWith('http')) {`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/server/routes/telegramExport.ts', content);
