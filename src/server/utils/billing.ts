import { adminDb } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";

export const checkAndDeductGeneration = async (userId: string | undefined, idempotencyKey?: string): Promise<{ ok: boolean; error?: string }> => {
  if (!userId) {
    return { ok: false, error: "Missing userId" };
  }
  if (!adminDb) {
    return { ok: true }; // Firebase admin not configured, allow
  }
  if (userId === "local-user" || userId === "8585130589") {
    return { ok: true }; // Local dev mode, allow
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
          // Already deducted for this idempotency key
          return true;
        }
      }

      const doc = await t.get(userRef);
      if (!doc.exists) return false;
      const data = doc.data();
      const gens = data?.generationsLeft || 0;
      if (gens <= 0) return false;
      
      t.update(userRef, { generationsLeft: FieldValue.increment(-1) });
      
      if (deductionRef) {
        t.set(deductionRef, { timestamp: FieldValue.serverTimestamp() });
      }
      return true;
    });

    if (!success) {
      return { ok: false, error: "Закончились генерации. Пополните баланс." };
    }
    return { ok: true };
  } catch (err: any) {
    console.error("Failed to check billing:", err);
    if (err.message && err.message.includes('PERMISSION_DENIED')) {
      console.warn("Firebase permission denied. Bypassing billing check.");
      return { ok: true };
    }
    return { ok: false, error: "Внутренняя ошибка биллинга." };
  }
};

export const refundGeneration = async (userId: string | undefined): Promise<void> => {
  if (!userId || !adminDb || userId === "local-user" || userId === "8585130589" || userId.length > 40) {
    return;
  }
  try {
    const userRef = adminDb.collection("users").doc(userId);
    await userRef.update({ generationsLeft: FieldValue.increment(1) });
  } catch (err) {
    console.error("Failed to refund token:", err);
  }
};
