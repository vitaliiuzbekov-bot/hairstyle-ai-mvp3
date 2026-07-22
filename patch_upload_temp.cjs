const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const route = `
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

if (!content.includes('/upload-temp')) {
    content = content.replace("export const telegramExportRouter = router;", route + "\nexport const telegramExportRouter = router;");
    fs.writeFileSync('src/server/routes/telegramExport.ts', content);
    console.log("Patched telegramExportRouter with upload-temp!");
} else {
    console.log("Already patched");
}
