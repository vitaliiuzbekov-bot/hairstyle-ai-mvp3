import { adminStorage } from "./src/server/firebase";
import crypto from "crypto";

async function run() {
  if (!adminStorage) {
    console.log("No adminStorage");
    return;
  }
  
  const bucket = adminStorage.bucket();
  console.log("Bucket name:", bucket.name);
  
  try {
    const fileName = `test_${Date.now()}.txt`;
    const file = bucket.file(fileName);
    const uuid = crypto.randomUUID();
    await file.save("hello world", {
      metadata: {
        contentType: 'text/plain',
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      }
    });
    console.log(`URL: https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`);
  } catch (err: any) {
    console.error("Upload error:", err.message);
  }
}
run();
