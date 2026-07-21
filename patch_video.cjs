const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const generateVideoEndpoint = `
router.post("/generate-video", async (req, res) => {
    try {
        const { beforeImage, afterImage } = req.body;
        
        const beforeBuffer = await ensureDataUriToBuffer(beforeImage);
        const afterBuffer = await ensureDataUriToBuffer(afterImage);
        
        const tempId = crypto.randomUUID();
        const tempDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const beforePath = path.join(tempDir, \`before_\${tempId}.jpg\`);
        const afterPath = path.join(tempDir, \`after_\${tempId}.jpg\`);
        const outPath = path.join(tempDir, \`out_\${tempId}.mp4\`);
        
        fs.writeFileSync(beforePath, beforeBuffer);
        fs.writeFileSync(afterPath, afterBuffer);
        
        const ffmpegCmd = \`"\${ffmpegInstaller.path}" -y -loop 1 -t 3.5 -i "\${beforePath}" -loop 1 -t 3.5 -i "\${afterPath}" -filter_complex "[0:v]scale=720:960:force_original_aspect_ratio=increase,crop=720:960,fps=30[v0];[1:v]scale=720:960:force_original_aspect_ratio=increase,crop=720:960,fps=30,format=yuva420p,fade=t=in:st=1:d=1.5:alpha=1[v1];[v0][v1]overlay,format=yuv420p" -c:v libx264 -pix_fmt yuv420p "\${outPath}"\`;
        
        try {
            await new Promise((resolve, reject) => {
                exec(ffmpegCmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
                    if (error) {
                        console.error("FFmpeg Error: ", stderr);
                        reject(new Error("FFmpeg failed: " + stderr));
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (ffmpegErr) {
            return res.status(500).json({ error: "FFmpeg generation failed: " + ffmpegErr.message });
        }
        
        let videoBuffer;
        try {
            videoBuffer = fs.readFileSync(outPath);
        } catch (err) {
            return res.status(500).json({ error: "Video output file not found" });
        }
        
        // Clean up
        try {
            fs.unlinkSync(beforePath);
            fs.unlinkSync(afterPath);
            fs.unlinkSync(outPath);
        } catch(e) {}
        
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', 'attachment; filename="result.mp4"');
        return res.send(videoBuffer);
        
    } catch (error) {
        console.error("Error generating video:", error);
        res.status(500).json({ error: error.message });
    }
});
`;

if (!content.includes('router.post("/generate-video"')) {
    content = content.replace('router.post("/send-to-telegram"', generateVideoEndpoint + '\nrouter.post("/send-to-telegram"');
    fs.writeFileSync('src/server/routes/telegramExport.ts', content);
    console.log("Patched server!");
}
