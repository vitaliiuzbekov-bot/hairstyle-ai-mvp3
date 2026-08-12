import sys

with open("src/server/routes/auth.ts", "r") as f:
    content = f.read()

stats_logic = """
  // Check for text commands
  if (body.message && body.message.text) {
    const text = body.message.text;
    const chatId = body.message.chat.id;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    
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

        let msg = "📊 <b>Статистика по источникам:</b>\\n\\n";
        Object.entries(stats).forEach(([source, data]) => {
          msg += `<b>Источник:</b> ${source}\\n`;
          msg += `👥 Уникальных пользователей: ${data.users.size}\\n`;
          msg += `🎨 Сделано генераций: ${data.generations}\\n`;
          msg += `🔗 Поделились результатами: ${data.shares}\\n`;
          msg += `💰 Покупок: ${data.purchases}\\n\\n`;
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
"""

# Insert right after `const body = req.body;`
content = content.replace("const body = req.body;", f"const body = req.body;{stats_logic}")

with open("src/server/routes/auth.ts", "w") as f:
    f.write(content)
