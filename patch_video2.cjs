const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const regex = /let videoBuffer;[\s\S]*?res\.send\(videoBuffer\);/g;

const replacement = `// No need to send buffer, just return the URL
        // We will schedule a cleanup after 10 minutes
        setTimeout(() => {
            try {
                fs.unlinkSync(beforePath);
                fs.unlinkSync(afterPath);
                fs.unlinkSync(outPath);
            } catch (e) {}
        }, 10 * 60 * 1000);
        
        return res.json({ url: \`/tmp/out_\${tempId}.mp4\` });`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/server/routes/telegramExport.ts', content);
    console.log("Patched server video return!");
} else {
    console.log("Regex not matched!");
}
