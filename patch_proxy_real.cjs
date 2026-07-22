const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const route = `
// Proxy for downloading files with correct headers for Telegram Web App
router.get('/download-proxy', async (req, res) => {
    try {
        const { url, filename } = req.query;
        if (!url || typeof url !== 'string') {
            return res.status(400).send("Missing url");
        }
        
        const fetchRes = await fetch(url);
        if (!fetchRes.ok) {
            throw new Error(\`Failed to fetch \${url}: \${fetchRes.statusText}\`);
        }
        
        const finalFilename = filename || 'downloaded_file';
        
        res.setHeader('Content-Disposition', \`attachment; filename="\${finalFilename}"\`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', fetchRes.headers.get('content-type') || 'application/octet-stream');
        
        const buffer = await fetchRes.arrayBuffer();
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error("Download proxy error:", error);
        res.status(500).send("Proxy error");
    }
});

// Proxy for downloading local /tmp files
router.get('/download-local', async (req, res) => {
    try {
        const { file, filename } = req.query;
        if (!file || typeof file !== 'string') {
            return res.status(400).send("Missing file");
        }
        
        // Ensure it's a safe path
        if (file.includes('..') || file.includes('/')) {
            return res.status(400).send("Invalid file name");
        }
        
        const filePath = path.join(process.cwd(), 'tmp', file);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send("File not found");
        }
        
        const finalFilename = filename || file;
        
        res.setHeader('Content-Disposition', \`attachment; filename="\${finalFilename}"\`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.mp4') res.setHeader('Content-Type', 'video/mp4');
        else if (ext === '.webm') res.setHeader('Content-Type', 'video/webm');
        else res.setHeader('Content-Type', 'application/octet-stream');
        
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    } catch (error) {
        console.error("Local download error:", error);
        res.status(500).send("Download error");
    }
});

router.post('/upload-temp', async (req, res) => {
    try {
        const { base64, ext } = req.body;
        if (!base64 || !ext) return res.status(400).send("Missing data");
        
        let data = base64;
        if (data.includes(',')) {
            data = data.split(',')[1];
        }
        
        const buffer = Buffer.from(data, 'base64');
        const filename = \`temp_\${Date.now()}_\${Math.floor(Math.random()*1000)}.\${ext}\`;
        const filePath = path.join(process.cwd(), 'tmp', filename);
        
        fs.writeFileSync(filePath, buffer);
        
        // Cleanup after 10 min
        setTimeout(() => {
            try {
                fs.unlinkSync(filePath);
            } catch (e) {}
        }, 10 * 60 * 1000);
        
        res.json({ file: filename });
    } catch (error) {
        console.error("Temp upload error:", error);
        res.status(500).send("Upload error");
    }
});
`;

if (!content.includes('/download-proxy')) {
    content = content.replace("export default router;", route + "\nexport default router;");
    fs.writeFileSync('src/server/routes/telegramExport.ts', content);
    console.log("Patched telegramExportRouter properly!");
} else {
    console.log("Already patched");
}
