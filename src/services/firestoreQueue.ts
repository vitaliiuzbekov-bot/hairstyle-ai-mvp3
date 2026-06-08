import { doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

let currentBatch = writeBatch(db);
let batchTimeout: NodeJS.Timeout | null = null;
let operationCount = 0;
const MAX_OPERATIONS = 10;
const BATCH_DELAY = 2000;

export const scheduleBatchUpdate = (userId: string, data: any) => {
  if (!userId || userId === "local-user") return;

  const userRef = doc(db, "users", userId);
  currentBatch.update(userRef, data);
  operationCount++;

  if (operationCount >= MAX_OPERATIONS) {
    commitBatch();
  } else {
    if (batchTimeout) {
      clearTimeout(batchTimeout);
    }
    batchTimeout = setTimeout(() => {
      commitBatch();
    }, BATCH_DELAY);
  }
};

export const commitBatch = async () => {
  if (operationCount === 0) return;
  
  const batchToCommit = currentBatch;
  currentBatch = writeBatch(db);
  const count = operationCount;
  operationCount = 0;
  
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }

  try {
    await batchToCommit.commit();
    console.log(`Committed ${count} queued Firestore operations in batch.`);
  } catch (error) {
    console.error("Error committing batch:", error);
  }
};

// Ensure pending writes are committed when the user leaves the page
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (operationCount > 0) {
      commitBatch();
    }
  });

  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.onEvent("viewportChanged", () => {
      // Just a hook for generic events if needed, but the main close event usually triggers beforeunload 
      // where supported. Although Telegram webviews might have their own behavior.
    });
  }
}
