import { Router } from "express";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import FormData from "form-data";

const router = Router();

const ensureDataUriToBuffer = async (data: string): Promise<Buffer> => {
    if (data.startsWith('/api/proxy-image?url=')) {
        const url = decodeURIComponent(data.split('url=')[1]);
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    if (data.startsWith('http')) {
        const res = await fetch(data);
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    const matches = data.match(/^data:.*base64,(.+)$/);
    if (!matches || matches.length < 2) {
        throw new Error('Invalid input string');
    }
    return Buffer.from(matches[1], 'base64');
};

router.post("/send-to-telegram", async (req, res) => {
    try {
        const { tgUserId, type, singleImage, beforeImage, afterImage } = req.body;
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken || !tgUserId) {
            return res.status(400).json({ error: "Telegram Bot Token or tgUserId missing." });
        }

        if (type === 'image') {
            const imageBuffer = await ensureDataUriToBuffer(singleImage);
            
            const form = new FormData();
            form.append("chat_id", tgUserId);
            form.append("photo", imageBuffer, { filename: "image.jpg", contentType: "image/jpeg" });
            form.append("caption", "Вот ваш результат из НейроСтилиста! ✨");

            const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: form, headers: form.getHeaders()
            });

            if (!tgRes.ok) {
                const tgErr = await tgRes.text();
                throw new Error("Telegram API Error: " + tgErr);
            }

            return res.json({ success: true });
        } else if (type === 'video') {
            // Generate video via ffmpeg
            const beforeBuffer = await ensureDataUriToBuffer(beforeImage);
            const afterBuffer = await ensureDataUriToBuffer(afterImage);
            
            const tempId = crypto.randomUUID();
            const tempDir = path.join(process.cwd(), 'tmp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const beforePath = path.join(tempDir, `before_${tempId}.jpg`);
            const afterPath = path.join(tempDir, `after_${tempId}.jpg`);
            const outPath = path.join(tempDir, `out_${tempId}.mp4`);
            
            fs.writeFileSync(beforePath, beforeBuffer);
            fs.writeFileSync(afterPath, afterBuffer);
            
            // Wipe right transition for 3 seconds: 0.5s pause, 1s wipe, 1.5s pause
            const ffmpegCmd = `ffmpeg -y -loop 1 -t 3.5 -i "${beforePath}" -loop 1 -t 3.5 -i "${afterPath}" -filter_complex "[0:v]scale=720:960:force_original_aspect_ratio=increase,crop=720:960,fps=30[v0];[1:v]scale=720:960:force_original_aspect_ratio=increase,crop=720:960,fps=30[v1];[v0][v1]xfade=transition=wiperight:duration=1.5:offset=1.0,format=yuv420p" -c:v libx264 -pix_fmt yuv420p "${outPath}"`;
            
            await new Promise((resolve, reject) => {
                exec(ffmpegCmd, (error, stdout, stderr) => {
                    if (error) {
                        console.error("FFmpeg Error: ", stderr);
                        reject(error);
                    } else {
                        resolve(true);
                    }
                });
            });
            
            const videoBuffer = fs.readFileSync(outPath);
            
            const form = new FormData();
            form.append("chat_id", tgUserId);
            form.append("video", videoBuffer, { filename: "result.mp4", contentType: "video/mp4" });
            form.append("caption", "Вот ваша видео-трансформация из НейроСтилиста! 🎬");

            const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
                method: 'POST',
                body: form, headers: form.getHeaders()
            });
            
            // Clean up
            try {
                fs.unlinkSync(beforePath);
                fs.unlinkSync(afterPath);
                fs.unlinkSync(outPath);
            } catch(e) {}

            if (!tgRes.ok) {
                const tgErr = await tgRes.text();
                throw new Error("Telegram API Error: " + tgErr);
            }

            return res.json({ success: true });
        }
        
        return res.status(400).json({ error: "Invalid type" });
    } catch (error: any) {
        console.error("Error sending to telegram:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
