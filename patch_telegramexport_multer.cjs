const fs = require('fs');
let code = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const newCode = `
import { Router } from "express";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/send-video-to-chat', upload.single('video'), async (req, res) => {
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

        const videoFile = req.file;
        const ext = req.body.ext || 'mp4';
        
        if (!videoFile) return res.status(400).send("No video file uploaded");
        
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) throw new Error("No TELEGRAM_BOT_TOKEN");

        const form = new FormData();
        form.append("chat_id", chatId.toString());
        form.append("video", new Blob([videoFile.buffer], { type: ext === 'mp4' ? 'video/mp4' : 'video/webm' }), \`result.\${ext}\`);
        form.append("caption", "🎬 Ваше видео готово! Сохраните его в галерею.");

        const tgRes = await fetch(\`https://api.telegram.org/bot\${botToken}/sendVideo\`, {
            method: 'POST',
            body: form
        });

        if (!tgRes.ok) {
            const errText = await tgRes.text();
            throw new Error(\`Telegram API Error: \${errText}\`);
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error("Send video error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
`;

fs.writeFileSync('src/server/routes/telegramExport.ts', newCode);
console.log("Patched telegramExport.ts with multer");
