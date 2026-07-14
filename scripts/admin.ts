import { adminDb } from "../src/server/firebase";
import { FieldValue } from "firebase-admin/firestore";

const command = process.argv[2];

async function addTokens(userId: string, amount: number) {
  if (!adminDb) {
    console.error("Firebase admin is not configured.");
    return;
  }
  try {
    const userRef = adminDb.collection("users").doc(userId);
    await userRef.update({ generationsLeft: FieldValue.increment(amount) });
    console.log(`Successfully added ${amount} tokens to user ${userId}.`);
  } catch (error: any) {
    if (error.code === 5) { // NOT_FOUND
       console.log(`User document not found. Creating it...`);
       await adminDb.collection("users").doc(userId).set({
           generationsLeft: amount,
           createdAt: FieldValue.serverTimestamp()
       });
       console.log(`Created user ${userId} with ${amount} tokens.`);
    } else {
       console.error("Error adding tokens:", error);
    }
  }
}

async function sendMessage(userId: string, message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN is not set in environment variables.");
    return;
  }
  
  // We need to fetch the user's tgId if it exists, or assume userId is tgId
  let tgId = userId;
  if (adminDb && userId.length > 15) { // Likely a firebase UID, not a telegram ID
     const doc = await adminDb.collection("users").doc(userId).get();
     if (doc.exists && doc.data()?.tgId) {
         tgId = doc.data()!.tgId.toString();
     }
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tgId,
        text: message,
        parse_mode: "HTML",
      })
    });
    const data = await res.json();
    if (data.ok) {
        console.log(`Message sent successfully to ${tgId}.`);
    } else {
        console.error("Telegram API error:", data);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function main() {
  if (command === "add-tokens") {
    const userId = process.argv[3];
    const amount = parseInt(process.argv[4]);
    if (!userId || isNaN(amount)) {
      console.log("Usage: npx tsx scripts/admin.ts add-tokens <userId> <amount>");
      process.exit(1);
    }
    await addTokens(userId, amount);
    process.exit(0);
  } else if (command === "send-message") {
    const userId = process.argv[3];
    const message = process.argv[4];
    if (!userId || !message) {
      console.log('Usage: npx tsx scripts/admin.ts send-message <userId> "<message>"');
      process.exit(1);
    }
    await sendMessage(userId, message);
    process.exit(0);
  } else {
    console.log("Available commands:");
    console.log("  npx tsx scripts/admin.ts add-tokens <userId> <amount>");
    console.log('  npx tsx scripts/admin.ts send-message <userId> "<message>"');
    process.exit(0);
  }
}

main();
