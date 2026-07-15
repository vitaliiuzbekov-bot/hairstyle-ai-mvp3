import { adminApp } from "./src/server/firebase";
import { getStorage } from "firebase-admin/storage";

async function run() {
  const defaultBucket = adminApp.options.storageBucket;
  console.log("Default bucket from options:", defaultBucket);
  
  // Try appspot bucket
  const appspotBucketName = defaultBucket.replace('.firebasestorage.app', '.appspot.com');
  console.log("Trying:", appspotBucketName);
  const storage = getStorage(adminApp);
  const bucket = storage.bucket(appspotBucketName);
  try {
    await bucket.file("test.txt").save("hello world");
    console.log("Success with", appspotBucketName);
  } catch (e: any) {
    console.error("Failed", e.message);
  }
}
run();
