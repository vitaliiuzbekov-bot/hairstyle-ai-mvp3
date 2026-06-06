
import { Request, Response, Router } from "express";
import { logToTelegram } from "../services/logger";
import { adminApp, adminDb } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";

export const authRouter = Router();

const PACKAGES: Record<string, { title: string; description: string; amount: number; count: number }> = {
  "basic": { title: "Базовый пакет", description: "1 стрижка + базовый цвет", amount: 99, count: 1 },
  "popular": { title: "Популярный пакет", description: "3 стрижки + 3 цвета", amount: 199, count: 3 },
  "premium": { title: "Премиум пакет", description: "3 стрижки + все цвета + PDF", amount: 349, count: 3 },
  "master": { title: "Пакет мастера", description: "10 генераций для клиентов", amount: 500, count: 10 },
};

authRouter.post('/create-invoice', async (req: Request, res: Response) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN not configured" });
    }

    const { userId, tgUserId, packageId } = req.body;
    const pkg = PACKAGES[packageId];
    
    if (!pkg) {
      return res.status(400).json({ error: "Invalid packageId" });
    }

    // Include packageId, userId, tgUserId
    const payload = `${packageId}_${userId}_${tgUserId}`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: pkg.title,
        description: pkg.description,
        payload: payload,
        currency: "XTR",
        prices: [{ label: pkg.title, amount: pkg.amount }]
      })
    });

    const data = await response.json();

    if (data.ok) {
      res.json({ invoiceUrl: data.result });
    } else {
      console.error("Telegram invoice error:", data);
      res.status(500).json({ error: data.description || "Failed to create invoice" });
    }
  } catch (error: any) {
    console.error("Create invoice error:", error);
    res.status(500).json({ error: error.message });
  }
});

authRouter.post('/set-telegram-webhook', async (req: Request, res: Response) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN not configured" });
  }
  const { webAppUrl } = req.body;
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: `${webAppUrl.replace(/\/$/, "")}/api/webhook/telegram`,
        allowed_updates: ["message", "pre_checkout_query"]
      })
    });
    const data = await tgRes.json();
    res.json({ success: data.ok });
  } catch (e) {
    res.status(500).json({ error: "Failed to set webhook" });
  }
});

authRouter.post('/webhook/telegram', async (req: Request, res: Response) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const body = req.body;
  
  if (body.pre_checkout_query) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: body.pre_checkout_query.id,
          ok: true
        })
      });
    } catch (e) {
      console.error("Answer pre_checkout_query error", e);
    }
    return res.status(200).send("OK");
  }
  
  if (body.message && body.message.successful_payment) {
    const payment = body.message.successful_payment;
    const payload = payment.invoice_payload; // "packageId_userId_tgUserId"
    const parts = payload ? payload.split('_') : [];
    const packageId = parts.length > 0 ? parts[0] : "";
    const userId = parts.length > 1 ? parts[1] : null;
    const starsAmount = payment.total_amount;
    
    const pkg = PACKAGES[packageId];
    
    if (userId && pkg && adminApp && adminDb) {
      try {
        await adminDb.collection("users").doc(userId).update({
          generationsLeft: FieldValue.increment(pkg.count),
          fullAccess: true
        });
        await logToTelegram(`💰 <b>Успешная оплата Stars!</b>\nПакет: <code>${packageId}</code>\nПользователь ID: <code>${userId}</code>\nСумма: ${starsAmount} Stars\nНачислено: ${pkg.count} генераций`);
      } catch (e) {
        console.error("Failed to update tokens on webhook:", e);
        await logToTelegram(`❌ Ошибка начисления <b>Stars!</b>\nПользователь ID: <code>${userId}</code>\nСумма: ${starsAmount}`);
      }
    } else {
        await logToTelegram(`💰 Успешная оплата Stars, но <b>ошибка начисления</b>!\nПакет: <code>${payload}</code>\nСумма: ${starsAmount} Stars`);
    }
  }
  
  res.status(200).send("OK");
});
