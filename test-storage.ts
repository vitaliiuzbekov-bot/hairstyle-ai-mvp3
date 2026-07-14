import { adminStorage } from "./src/server/firebase";
import crypto from "crypto";

async function run() {
  if (!adminStorage) {
    console.log("No adminStorage");
    return;
  }
  try {
    const bucket = adminStorage.bucket();
    const fileName = `test_${Date.now()}.txt`;
    const file = bucket.file(fileName);
    const uuid = crypto.randomUUID();
    await file.save("hello world", {
      metadata: {
        contentType: "text/plain",
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      }
    });
    console.log("Saved.");
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
    console.log("URL:", url);
  } catch (e) {
    console.error("Error", e);
  }
}
run();
