const fs = require('fs');
let content = fs.readFileSync('src/server/routes/auth.ts', 'utf8');

const target = `      try {
        await adminDb.collection("users").doc(userId).update({
          generationsLeft: FieldValue.increment(pkg.count),
          fullAccess: true
        });
        await logToTelegram(\`💰 <b>Успешная оплата Stars!</b>\\nПакет: <code>\${packageId}</code>\\nПользователь ID: <code>\${userId}</code>\\nСумма: \${starsAmount} Stars\\nНачислено: \${pkg.count} генераций\`);
      } catch (e) {`;

const replacement = `      try {
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
        await logToTelegram(\`💰 <b>Успешная оплата Stars!</b>\\nПакет: <code>\${packageId}</code>\\nПользователь ID: <code>\${userId}</code>\\nСумма: \${starsAmount} Stars\\nНачислено: \${pkg.count} генераций\`);
      } catch (e: any) {
        if (e.message === "ALREADY_PROCESSED") {
            console.log("Duplicate webhook received, ignoring.");
            return res.status(200).send("OK");
        }`;

content = content.replace(target, replacement);

fs.writeFileSync('src/server/routes/auth.ts', content);
console.log("Patched auth.ts successfully");
