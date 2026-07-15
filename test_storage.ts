import { adminStorage } from "./src/server/firebase";

async function run() {
  if (!adminStorage) {
    console.log("No adminStorage");
    return;
  }
  const bucket = adminStorage.bucket();
  const file = bucket.file("test.txt");
  try {
    await file.save("hello world", {
      metadata: { contentType: "text/plain" }
    });
    console.log("Success");
  } catch (e: any) {
    console.error("Error:", JSON.stringify(e, null, 2));
    console.error(e.message);
  }
}
run();
