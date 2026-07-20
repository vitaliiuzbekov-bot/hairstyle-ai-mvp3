import { adminDb } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";

export const checkAndDeductGeneration = async (userId: string | undefined, idempotencyKey?: string, tgUserId?: string, cacheKey?: string, isDeveloper?: boolean): Promise<{ ok: boolean; error?: string }> => {
  if (!userId) {
    return { ok: false, error: "Missing userId" };
  }

  if (isDeveloper) {
    return { ok: true }; 
  }

  if (userId === "local-user") {
    return { ok: true }; 
  }

  if (!adminDb) {
    return { ok: false, error: "Сервис временно недоступен. Попробуйте позже." };
  }

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
          throw new Error("ALREADY_DEDUCTED"); 
        }
      }
      const doc = await t.get(userRef);
      if (!doc.exists) {
        t.set(userRef, {
          tgId: tgUserId || null,
          generationsLeft: 2,
          createdAt: FieldValue.serverTimestamp()
        });
        if (deductionRef) {
          t.set(deductionRef, { timestamp: FieldValue.serverTimestamp(), cacheKey: cacheKey || null });
        }
        return true;
      }
      
      const data = doc.data();
      if (tgUserId && tgUserId !== "local-user") {
        if (data?.tgId) {
          if (data.tgId.toString() !== tgUserId.toString()) {
            throw new Error("AUTHORIZATION_ERROR"); 
          }
        } else {
          t.update(userRef, { tgId: tgUserId });
        }
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
      console.warn("Firebase permission denied. Blocking request.");
      return { ok: false, error: "Сервис временно недоступен. Попробуйте позже." };
    }
    console.error("Failed to check billing:", err);
    if (err.message === "AUTHORIZATION_ERROR") {
       return { ok: false, error: "Ошибка авторизации: ID пользователя не совпадает с Telegram ID." };
    }
    if (err.message === "REPLAY_ATTACK") {
       return { ok: false, error: "Попытка повторного использования ключа (Replay Attack)." };
    }
    if (err.message === "ALREADY_DEDUCTED") {
       return { ok: false, error: "Уже в обработке (Idempotency)." };
    }
    return { ok: false, error: `Внутренняя ошибка биллинга: ${err.message}` };
  }
};

export const refundGeneration = async (userId: string | undefined): Promise<void> => {
  if (!userId || !adminDb || userId.length > 40) {
    return;
  }
  if (userId === "local-user") {
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
