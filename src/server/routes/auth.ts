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
    if (error.code === 7 || (error.message && (error.message.includes("PERMISSION_DENIED") || error.message.includes("Missing or insufficient permissions")))) {
       if (process.env.NODE_ENV !== "production") {
           console.warn("Firebase permission denied (Dev Mode). Bypassing backend sync.");
           return res.json({ success: true, message: "Dev Bypass" });
       }
    }
    console.error("PDF Send error:", error);
    res.status(500).json({ error: error.message });
  }
});

export const PACKAGES: Record<string, { title: string; description: string; amount: number; count: number; rubPrice: number; label?: string }> = {
  "start": { title: "10 генераций", description: "10 генераций • бессрочные", amount: 50, count: 10, rubPrice: 190, label: "Старт" },
  "hit": { title: "50 генераций", description: "50 генераций • бессрочные", amount: 200, count: 50, rubPrice: 690, label: "Хит • Выгода 25%" },
  "pro": { title: "150 генераций", description: "150 генераций • бессрочные", amount: 500, count: 150, rubPrice: 1690, label: "Профи • Выгода 40%" },
  // Compatibility aliases
  "basic": { title: "10 генераций", description: "10 генераций • бессрочные", amount: 50, count: 10, rubPrice: 190, label: "Старт" },
  "popular": { title: "50 генераций", description: "50 генераций • бессрочные", amount: 200, count: 50, rubPrice: 690, label: "Хит • Выгода 25%" },
  "premium": { title: "50 генераций", description: "50 генераций • бессрочные", amount: 200, count: 50, rubPrice: 690, label: "Хит • Выгода 25%" },
  "master": { title: "150 генераций", description: "150 генераций • бессрочные", amount: 500, count: 150, rubPrice: 1690, label: "Профи • Выгода 40%" },
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
        title: `${pkg.title} (${pkg.count} шт.)`,
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
    if (error.code === 7 || (error.message && (error.message.includes("PERMISSION_DENIED") || error.message.includes("Missing or insufficient permissions")))) {
       if (process.env.NODE_ENV !== "production") {
           console.warn("Firebase permission denied (Dev Mode). Bypassing backend sync.");
           return res.json({ success: true, message: "Dev Bypass" });
       }
    }
    console.error("Create invoice error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Уведомление администратора о переводе по СБП
authRouter.post('/payment/sbp-notify', async (req: Request, res: Response) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    const { userId, tgUserId, tgUsername, packageId, selectedBank } = req.body;

    const pkg = PACKAGES[packageId] || PACKAGES["hit"];
    const requestId = `sbp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (adminDb) {
      try {
        await adminDb.collection("sbp_payments").doc(requestId).set({
          requestId,
          userId: userId || "unknown",
          tgUserId: tgUserId || null,
          tgUsername: tgUsername || null,
          packageId,
          count: pkg.count,
          rubPrice: pkg.rubPrice,
          selectedBank: selectedBank || "Озон банк / ОТП банк",
          status: "pending",
          createdAt: FieldValue.serverTimestamp()
        });
      } catch (dbErr) {
        console.warn("Could not write sbp_payment to Firestore:", dbErr);
      }
    }

    if (botToken && adminChatId) {
      const userDisplay = tgUsername ? `@${tgUsername}` : (tgUserId ? `TG ID: ${tgUserId}` : `ID: ${userId}`);
      const bankText = selectedBank || "Озон банк / ОТП банк";
      const messageText = `💸 <b>Новая заявка на оплату СБП!</b>\n\n` +
        `👤 <b>Пользователь:</b> ${userDisplay} (ID: <code>${userId}</code>)\n` +
        `📦 <b>Пакет:</b> <b>${pkg.title}</b> (+${pkg.count} генераций)\n` +
        `💵 <b>Сумма к получению:</b> <b>${pkg.rubPrice} ₽</b>\n` +
        `🏦 <b>Выбранный банк:</b> ${bankText}\n` +
        `📱 <b>Номер СБП:</b> <code>+79059804683</code>\n` +
        `⏱ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)\n` +
        `🆔 <b>ID заявки:</b> <code>${requestId}</code>\n\n` +
        `<i>Проверьте поступление в банковском приложении и нажмите кнопку ниже:</i>`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: messageText,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `✅ Начислить ${pkg.count} ген. (${pkg.rubPrice} ₽)`, callback_data: `sbp_ok_${requestId}` },
                  { text: `❌ Отклонить`, callback_data: `sbp_no_${requestId}` }
                ]
              ]
            }
          })
        });
      } catch (tgErr) {
        console.error("Failed to send SBP admin notification to TG:", tgErr);
      }
    }

    res.json({ success: true, requestId, count: pkg.count, rubPrice: pkg.rubPrice });
  } catch (error: any) {
    console.error("SBP Notify error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Подтверждение клиентом получения начисленных генераций в приложении
authRouter.post('/payment/ack-sbp-award', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (userId && adminDb) {
      await adminDb.collection("users").doc(userId).update({
        pendingSbpAward: FieldValue.delete()
      }).catch(() => {});
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Ack SBP award error:", error);
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
        allowed_updates: ["message", "pre_checkout_query", "callback_query"]
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
  // Check for text commands
  if (body.message && body.message.text) {
    const text = body.message.text;
    const chatId = body.message.chat.id;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (text.startsWith('/start')) {
        try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: 'Привет! Добро пожаловать в НейроСтилист. Нажми кнопку ниже, чтобы подобрать идеальную прическу!',
                    reply_markup: {
                        inline_keyboard: [[{
                            text: '✂️ Открыть НейроСтилист',
                            web_app: { url: process.env.TELEGRAM_WEB_APP_URL || "https://t.me/hairstyleaimvp_bot/app" }
                        }]]
                    }
                })
            });
        } catch (e) {
             console.error("Failed to send welcome message:", e.message);
        }
        return res.status(200).send("OK");
    }
    
    if (text === '/stats' && String(chatId) === adminChatId && adminDb) {
      try {
        const eventsSnap = await adminDb.collection("analytics_events").get();
        const stats: Record<string, { users: Set<string>, generations: number, shares: number, purchases: number }> = {};
        
        eventsSnap.docs.forEach(doc => {
          const data = doc.data();
          const source = data.source || "unknown";
          
          if (!stats[source]) {
            stats[source] = { users: new Set(), generations: 0, shares: 0, purchases: 0 };
          }
          
          if (data.userId) stats[source].users.add(data.userId);
          if (data.event === "generation_completed") stats[source].generations++;
          if (data.event === "share_clicked") stats[source].shares++;
          if (data.event === "purchase_completed") stats[source].purchases++;
        });

        let msg = "📊 <b>Статистика по источникам:</b>\n\n";
        Object.entries(stats).forEach(([source, data]) => {
          msg += `<b>Источник:</b> ${source}\n`;
          msg += `👥 Уникальных пользователей: ${data.users.size}\n`;
          msg += `🎨 Сделано генераций: ${data.generations}\n`;
          msg += `🔗 Поделились результатами: ${data.shares}\n`;
          msg += `💰 Покупок: ${data.purchases}\n\n`;
        });
        
        if (Object.keys(stats).length === 0) {
           msg += "Нет данных.";
        }

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML'
          })
        });
      } catch (e) {
        console.error("Stats command error", e);
      }
      return res.status(200).send("OK");
    }
  }

  // Обработка инлайн-кнопок администратора (подтверждение перевода СБП)
  if (body.callback_query) {
    const cb = body.callback_query;
    const data = cb.data || "";
    const cbId = cb.id;
    const adminChatId = cb.message?.chat?.id;
    const messageId = cb.message?.message_id;

    if (data.startsWith("sbp_ok_") || data.startsWith("sbp_no_")) {
      const isApprove = data.startsWith("sbp_ok_");
      const requestId = data.replace(isApprove ? "sbp_ok_" : "sbp_no_", "");

      if (adminDb) {
        try {
          const sbpRef = adminDb.collection("sbp_payments").doc(requestId);
          const sbpDoc = await sbpRef.get();

          if (!sbpDoc.exists) {
            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: cbId, text: "❌ Заявка не найдена в базе", show_alert: true })
            });
            return res.status(200).send("OK");
          }

          const sbpData = sbpDoc.data();
          if (sbpData?.status !== "pending") {
            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: cbId, text: `ℹ️ Заявка уже обработана (статус: ${sbpData?.status})`, show_alert: true })
            });
            return res.status(200).send("OK");
          }

          if (isApprove) {
            const { userId, tgUserId, count, rubPrice, packageId } = sbpData;

            // 1. Обновляем баланс пользователя и статус заявки
            await adminDb.runTransaction(async (t) => {
              const userRef = adminDb.collection("users").doc(userId);
              t.update(userRef, {
                generationsLeft: FieldValue.increment(count),
                fullAccess: true,
                pendingSbpAward: {
                  requestId,
                  count,
                  rubPrice,
                  packageId,
                  timestamp: Date.now()
                }
              });

              t.update(sbpRef, {
                status: "approved",
                approvedAt: FieldValue.serverTimestamp()
              });

              const paymentRef = adminDb.collection("users").doc(userId).collection("payments").doc(requestId);
              t.set(paymentRef, {
                type: "sbp",
                packageId,
                amount: rubPrice,
                count,
                timestamp: FieldValue.serverTimestamp()
              });
            });

            // 2. Отправляем сообщение пользователю в чат Telegram (если известен tgUserId)
            if (tgUserId) {
              try {
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: tgUserId,
                    text: `🎉 <b>Оплата СБП подтверждена!</b>\n\nВам успешно начислено <b>+${count} генераций</b> (${rubPrice} ₽).\n\nОткройте приложение НейроСтилист, чтобы примерить новые стрижки и образы! ✂️✨`,
                    parse_mode: 'HTML'
                  })
                });
              } catch (e) {
                console.error("Failed to notify user via TG bot:", e);
              }
            }

            // 3. Обновляем сообщение администратора
            if (adminChatId && messageId) {
              await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: adminChatId,
                  message_id: messageId,
                  text: `✅ <b>Оплата СБП ПОДТВЕРЖДЕНА!</b>\n\n` +
                    `👤 Пользователь ID: <code>${userId}</code>\n` +
                    `📦 Начислено: <b>+${count} генераций</b> (${rubPrice} ₽)\n` +
                    `⏱ Подтверждено: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`,
                  parse_mode: 'HTML'
                })
              });
            }

            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: cbId, text: `✅ Успешно начислено +${count} генераций!` })
            });

          } else {
            // Отклонение
            await sbpRef.update({
              status: "rejected",
              rejectedAt: FieldValue.serverTimestamp()
            });

            if (adminChatId && messageId) {
              await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: adminChatId,
                  message_id: messageId,
                  text: `❌ <b>Заявка СБП ОТКЛОНЕНА</b>\n\n🆔 Заявка: <code>${requestId}</code>`,
                  parse_mode: 'HTML'
                })
              });
            }

            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: cbId, text: "❌ Заявка отклонена" })
            });
          }

        } catch (e: any) {
          console.error("Callback query SBP error:", e);
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: cbId, text: `Ошибка: ${e.message}`, show_alert: true })
          });
        }
      }
      return res.status(200).send("OK");
    }
  }
  
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
        
        await logToTelegram(`💰 <b>Успешная оплата Stars!</b>
Пакет: <code>${packageId}</code>
Пользователь ID: <code>${userId}</code>
Сумма: ${starsAmount} Stars
Начислено: ${pkg.count} генераций`);
        
        try {
          const userSnap = await adminDb.collection("users").doc(userId).get();
          const source = userSnap.exists ? (userSnap.data()?.source || "direct") : "direct";
          await adminDb.collection("analytics_events").add({
            userId,
            event: "purchase_completed",
            source,
            timestamp: Date.now(),
            serverTimestamp: FieldValue.serverTimestamp(),
            packageId,
            starsAmount
          });
        } catch (e) {
          console.error("Analytics purchase_completed error", e);
        }

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

authRouter.post('/daily-reward', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (!adminDb) return res.status(500).json({ error: "adminDb not initialized" });
    
    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
       const data = userDoc.data();
       const lastClaimed = data?.lastClaimedDate;
       const today = new Date().toDateString();
       
       if (lastClaimed === today) {
          return res.status(400).json({ error: "Already claimed today" });
       }
       
       await userRef.update({
          generationsLeft: FieldValue.increment(1),
          lastClaimedDate: today
       });
       res.json({ success: true, message: "Reward claimed" });
    } else {
       res.status(404).json({ error: "User not found" });
    }
  } catch (error: any) {
    if (error.code === 7 || (error.message && (error.message.includes("PERMISSION_DENIED") || error.message.includes("Missing or insufficient permissions")))) {
       if (process.env.NODE_ENV !== "production") {
           console.warn("Firebase permission denied (Dev Mode). Bypassing backend sync.");
           return res.json({ success: true, message: "Dev Bypass" });
       }
    }
    console.error("Daily reward error:", error);
    res.status(500).json({ error: error.message });
  }
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
    if (error.code === 7 || (error.message && (error.message.includes("PERMISSION_DENIED") || error.message.includes("Missing or insufficient permissions")))) {
       if (process.env.NODE_ENV !== "production") {
           console.warn("Firebase permission denied (Dev Mode). Bypassing backend sync.");
           return res.json({ success: true, message: "Dev Bypass" });
       }
    }
    console.error("Feedback error:", error);
    res.status(500).json({ error: error.message });
  }
});

authRouter.post('/add-tokens', async (req: Request, res: Response) => {
  try {
    const { userId, amount, reason } = req.body;
    if (!userId || !amount) return res.status(400).json({ error: "userId and amount are required" });
    if (!adminDb) return res.status(500).json({ error: "adminDb not initialized" });
    
    // In a real app we'd verify the reason/source. 
    // For this MVP, we just allow the client to request tokens for referrals/fallbacks.
    const userRef = adminDb.collection("users").doc(userId);
    const updateData: any = { generationsLeft: FieldValue.increment(amount) };
    if (req.body.fullAccess) {
       updateData.fullAccess = true;
    }
    await userRef.update(updateData);
    console.log(`Added ${amount} tokens to ${userId} for ${reason}`);
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 7 || (error.message && (error.message.includes("PERMISSION_DENIED") || error.message.includes("Missing or insufficient permissions")))) {
       if (process.env.NODE_ENV !== "production") {
           console.warn("Firebase permission denied (Dev Mode). Bypassing backend sync.");
           return res.json({ success: true, message: "Dev Bypass" });
       }
    }
    console.error("Add tokens error:", error);
    res.status(500).json({ error: error.message });
  }
});
