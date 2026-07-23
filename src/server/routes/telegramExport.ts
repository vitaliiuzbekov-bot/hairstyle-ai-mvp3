import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// Proxy for downloading files with correct headers for Telegram Web App
router.get('/download-proxy', async (req, res) => {
    try {
        const { url, filename } = req.query;
        if (!url || typeof url !== 'string') {
            return res.status(400).send("Missing url");
        }
        
        const fetchRes = await fetch(url);
        if (!fetchRes.ok) {
            throw new Error(`Failed to fetch ${url}: ${fetchRes.statusText}`);
        }
        
        const finalFilename = filename || 'downloaded_file';
        
        res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
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
        
        res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
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
        const filename = `temp_${Date.now()}_${Math.floor(Math.random()*1000)}.${ext}`;
        
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        const filePath = path.join(tmpDir, filename);
        
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


router.post('/send-video-to-chat', async (req, res) => {
    try {
        const initDataRaw = req.headers['x-telegram-init-data'] as string;
        if (!initDataRaw) {
            return res.status(401).json({ error: "No telegram init data" });
        }
        
        const urlParams = new URLSearchParams(initDataRaw);
        const userStr = urlParams.get('user');
        if (!userStr) return res.status(401).json({ error: "No user data" });
        const user = JSON.parse(decodeURIComponent(userStr));
        const chatId = user.id;

        const { base64, ext } = req.body;
        if (!base64 || !ext) return res.status(400).send("Missing data");
        
        let data = base64;
        if (data.includes(',')) {
            data = data.split(',')[1];
        }
        const buffer = Buffer.from(data, 'base64');

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) throw new Error("No TELEGRAM_BOT_TOKEN");

        const form = new FormData();
        form.append("chat_id", chatId.toString());
        form.append("video", new Blob([buffer], { type: ext === 'mp4' ? 'video/mp4' : 'video/webm' }), `result.${ext}`);
        form.append("caption", "🎬 Ваше видео готово! Сохраните его в галерею.");

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
            method: 'POST',
            body: form
        });

        if (!tgRes.ok) {
            const errText = await tgRes.text();
            throw new Error(`Telegram API Error: ${errText}`);
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error("Send video error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
