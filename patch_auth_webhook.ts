import fs from 'fs';

const file = 'src/server/routes/auth.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `authRouter.post('/set-telegram-webhook', async (req: Request, res: Response) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;`;

const replacement = `authRouter.post('/set-telegram-webhook', async (req: Request, res: Response) => {
  const adminSecret = req.headers["x-admin-secret"];
  if (!process.env.ADMIN_SETUP_SECRET || adminSecret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(403).json({ error: "Forbidden: Invalid or missing x-admin-secret" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;`;

code = code.replace(target, replacement);

fs.writeFileSync(file, code);
console.log("Successfully patched webhook auth");
