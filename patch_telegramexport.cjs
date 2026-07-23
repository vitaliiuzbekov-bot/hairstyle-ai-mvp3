const fs = require('fs');
let code = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

const newRoute = `
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
        form.append("video", new Blob([buffer], { type: ext === 'mp4' ? 'video/mp4' : 'video/webm' }), \`result.\${ext}\`);
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
`;

code = code.replace('export default router;', newRoute + '\nexport default router;');
fs.writeFileSync('src/server/routes/telegramExport.ts', code);
console.log("Added /send-video-to-chat");
