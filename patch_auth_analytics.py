import sys

with open("src/server/routes/auth.ts", "r") as f:
    content = f.read()

replacement = """
        await logToTelegram(`💰 <b>Успешная оплата Stars!</b>\nПакет: <code>${packageId}</code>\nПользователь ID: <code>${userId}</code>\nСумма: ${starsAmount} Stars\nНачислено: ${pkg.count} генераций`);
        
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
"""

content = content.replace(
    'await logToTelegram(`💰 <b>Успешная оплата Stars!</b>\\nПакет: <code>${packageId}</code>\\nПользователь ID: <code>${userId}</code>\\nСумма: ${starsAmount} Stars\\nНачислено: ${pkg.count} генераций`);',
    replacement
)

with open("src/server/routes/auth.ts", "w") as f:
    f.write(content)
