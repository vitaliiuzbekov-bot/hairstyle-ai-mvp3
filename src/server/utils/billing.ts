import { adminDb } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";

export const checkAndDeductGeneration = async (userId: string | undefined, idempotencyKey?: string, tgUserId?: string, cacheKey?: string): Promise<{ ok: boolean; error?: string }> => {
  if (!userId) {
    return { ok: false, error: "Missing userId" };
  }
  if (!adminDb) {
    return { ok: true }; // Firebase admin not configured, allow
  }
  
  // Local dev mode, allow ONLY if dev
  if (process.env.NODE_ENV !== "production" && userId === "local-user") {
    return { ok: true }; 
  }

  // Prevent spam creating arbitrary documents
  if (userId.length > 40) {
      return { ok: false, error: "Invalid userId" };
  }

  try {
    const userRef = adminDb.collection("users").doc(userId);
    const success = await adminDb.runTransaction(async (t) => {
      let deductionRef: any;
      if (idempotencyKey && idempotencyKey.length <= 64) {
        deductionRef = userRef.collection("deductions").doc(idempotencyKey);
        const deductionDoc = await t.get(deductionRef as any) as any;
        if (deductionDoc.exists) {
          if (cacheKey && deductionDoc.data().cacheKey && deductionDoc.data().cacheKey !== cacheKey) {
             throw new Error("REPLAY_ATTACK");
          }
          return true;
        }
      }

      const doc = await t.get(userRef);
      if (!doc.exists) return false;
      
      const data = doc.data();

      // IMPORTANT: Validate that the userId actually belongs to the authenticated Telegram user
      // If tgUserId is provided, the document MUST have a matching tgId
      if (tgUserId && tgUserId !== "local-user" && data?.tgId?.toString() !== tgUserId.toString()) {
         throw new Error("AUTHORIZATION_ERROR"); // Mismatch
      }

      const gens = data?.generationsLeft || 0;
      if (gens <= 0) return false;
      
      t.update(userRef, { generationsLeft: FieldValue.increment(-1) });
      
      if (deductionRef) {
        t.set(deductionRef, { timestamp: FieldValue.serverTimestamp(), cacheKey: cacheKey || null });
      }
      return true;
    });

    if (!success) {
      return { ok: false, error: "Закончились генерации. Пополните баланс." };
    }
    return { ok: true };
  } catch (err: any) {
    if (err.code === 7 || (err.message && (err.message.includes('PERMISSION_DENIED') || err.message.includes('Missing or insufficient permissions')))) {
      console.warn("Firebase permission denied. Bypassing billing check.");
      return { ok: true };
    }
    console.error("Failed to check billing:", err);
    if (err.message === "AUTHORIZATION_ERROR") {
       return { ok: false, error: "Ошибка авторизации: ID пользователя не совпадает с Telegram ID." };
    }
    if (err.message === "REPLAY_ATTACK") {
       return { ok: false, error: "Попытка повторного использования ключа (Replay Attack)." };
    }
    return { ok: false, error: "Внутренняя ошибка биллинга." };
  }
};

export const refundGeneration = async (userId: string | undefined): Promise<void> => {
  if (!userId || !adminDb || userId.length > 40) {
    return;
  }
  if (process.env.NODE_ENV !== "production" && userId === "local-user") {
    return;
  }

  try {
    const userRef = adminDb.collection("users").doc(userId);
    await userRef.update({ generationsLeft: FieldValue.increment(1) });
  } catch (err: any) {
    if (err.code === 7 || (err.message && (err.message.includes('PERMISSION_DENIED') || err.message.includes('Missing or insufficient permissions')))) {
      return;
    }
    console.error("Failed to refund token:", err);
  }
};
