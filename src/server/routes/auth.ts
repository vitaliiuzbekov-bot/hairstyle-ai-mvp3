import crypto from "crypto";

import { Request, Response, Router } from "express";
import { logToTelegram } from "../services/logger";
import { adminApp, adminDb } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";
import multer from "multer";

export const authRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

authRouter.post('/send-pdf', upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken || botToken === "MY_TELEGRAM_BOT_TOKEN" || botToken === "") {
      return res.status(500).json({ error: "Токен бота не настроен" });
    }

    const tgUserId = req.body.tgUserId;
    if (!tgUserId || !req.file) {
      return res.status(400).json({ error: "Missing tgUserId or pdf file" });
    }

    // Node 18+ FormData
    const formData = new FormData();
    formData.append("chat_id", tgUserId);
    formData.append("document", new Blob([req.file.buffer], { type: 'application/pdf' }), "Neurostylist-Guide.pdf");

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.ok) {
      res.json({ success: true });
    } else {
      console.error(data);
      res.status(500).json({ error: data.description });
    }
  } catch (error: any) {
    console.error("PDF Send error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PACKAGES: Record<string, { title: string; description: string; amount: number; count: number }> = {
  "basic": { title: "Базовый пакет", description: "1 стрижка + базовый цвет", amount: 99, count: 1 },
  "popular": { title: "Популярный пакет", description: "3 стрижки + 3 цвета", amount: 199, count: 3 },
  "premium": { title: "Премиум пакет", description: "3 стрижки + все цвета + PDF", amount: 349, count: 3 },
  "master": { title: "Пакет мастера", description: "10 генераций для клиентов", amount: 500, count: 10 },
};

authRouter.post('/create-invoice', async (req: Request, res: Response) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken || botToken === "MY_TELEGRAM_BOT_TOKEN" || botToken === "") {
      return res.status(500).json({ 
        error: "Токен TELEGRAM_BOT_TOKEN не настроен. Пожалуйста, добавьте рабочий токен бота в меню Settings -> Environment Variables в AI Studio." 
      });
    }

    const { userId, tgUserId, packageId } = req.body;
    const pkg = PACKAGES[packageId];
    
    if (!pkg) {
      return res.status(400).json({ error: "Неверный ID пакета" });
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
      res.status(500).json({ 
        error: `Ошибка Telegram API: ${data.description || "Не удалось создать счет"}. Убедитесь, что бот подключен к платежам Stars (через @BotFather -> Bot Settings -> Payments).` 
      });
    }
  } catch (error: any) {
    console.error("Create invoice error:", error);
    res.status(500).json({ error: error.message });
  }
});

authRouter.post('/set-telegram-webhook', async (req: Request, res: Response) => {
  const adminSecret = req.headers["x-admin-secret"];
  if (!process.env.ADMIN_SETUP_SECRET || adminSecret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(403).json({ error: "Forbidden: Invalid or missing x-admin-secret" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN not configured" });
  }
  const { webAppUrl } = req.body;
  
  const secretToken = crypto.createHash('sha256').update(botToken).digest('hex');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: `${webAppUrl.replace(/\/$/, "")}/api/webhook/telegram`,
        secret_token: secretToken,
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
  if (!botToken) {
    return res.status(500).send("No token configured.");
  }
  
  const expectedToken = crypto.createHash('sha256').update(botToken).digest('hex');
  const providedToken = req.headers['x-telegram-bot-api-secret-token'];
  
  if (providedToken !== expectedToken) {
    console.error("Unauthorized webhook request!");
    return res.status(400).send("Unauthorized");
  }

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
        const paymentId = payment.telegram_payment_charge_id;
        if (paymentId) {
           await adminDb.runTransaction(async (t) => {
              const paymentRef = adminDb.collection("users").doc(userId).collection("payments").doc(paymentId);
              const paymentDoc = await t.get(paymentRef);
              if (paymentDoc.exists) {
                  throw new Error("ALREADY_PROCESSED");
              }
              const userRef = adminDb.collection("users").doc(userId);
              t.update(userRef, {
                generationsLeft: FieldValue.increment(pkg.count),
                fullAccess: true
              });
              t.set(paymentRef, {
                packageId, amount: starsAmount, timestamp: FieldValue.serverTimestamp()
              });
           });
        } else {
           await adminDb.collection("users").doc(userId).update({
             generationsLeft: FieldValue.increment(pkg.count),
             fullAccess: true
           });
        }
        await logToTelegram(`💰 <b>Успешная оплата Stars!</b>\nПакет: <code>${packageId}</code>\nПользователь ID: <code>${userId}</code>\nСумма: ${starsAmount} Stars\nНачислено: ${pkg.count} генераций`);
      } catch (e: any) {
        if (e.message === "ALREADY_PROCESSED") {
            console.log("Duplicate webhook received, ignoring.");
            return res.status(200).send("OK");
        }
        console.error("Failed to update tokens on webhook:", e);
        await logToTelegram(`❌ Ошибка начисления <b>Stars!</b>\nПользователь ID: <code>${userId}</code>\nСумма: ${starsAmount}`);
      }
    } else {
        await logToTelegram(`💰 Успешная оплата Stars, но <b>ошибка начисления</b>!\nПакет: <code>${payload}</code>\nСумма: ${starsAmount} Stars`);
    }
  }
  
  if (body.message && body.message.text) {
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId && body.message.chat && body.message.chat.id.toString() === adminChatId.toString()) {
      const text = body.message.text;
      if (text.startsWith('/give ')) {
        const parts = text.split(' ');
        if (parts.length >= 3) {
          const uId = parts[1];
          const amount = parseInt(parts[2], 10);
          if (!isNaN(amount) && adminDb) {
            try {
              await adminDb.collection("users").doc(uId).update({
                generationsLeft: FieldValue.increment(amount)
              });
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: adminChatId,
                  text: `✅ Успешно начислено ${amount} генераций пользователю ${uId}`
                })
              });
            } catch (e: any) {
               await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: adminChatId,
                  text: `❌ Ошибка начисления: ${e.message}`
                })
              });
            }
          }
        }
      } else if (text.startsWith('/reply ')) {
        const parts = text.split(' ');
        if (parts.length >= 3) {
          const tgUId = parts[1];
          const replyText = parts.slice(2).join(' ');
          try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: tgUId,
                text: `📩 Сообщение от разработчика:\n\n${replyText}`
              })
            });
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: adminChatId,
                text: `✅ Сообщение отправлено пользователю ${tgUId}`
              })
            });
          } catch(e: any) {
             await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: adminChatId,
                text: `❌ Ошибка отправки: ${e.message}`
              })
            });
          }
        }
      }
    }
  }

  res.status(200).send("OK");
});
authRouter.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { userId, tgUserId, name, text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const message = `📝 <b>Отзыв / Обратная связь</b>\nПользователь ID: <code>${userId}</code>\nTg ID: <code>${tgUserId || 'неизвестно'}</code>\nИмя: ${name || 'Без имени'}\nТекст: ${text}`;
    await logToTelegram(message);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: error.message });
  }
});
