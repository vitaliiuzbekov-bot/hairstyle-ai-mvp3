import fs from "fs";

async function test() {
  const resImage = await fetch("https://thispersondoesnotexist.com");
  const blob = await resImage.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const base64 = "data:image/jpeg;base64," + buffer.toString("base64");

  console.log("Starting full generation...");
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout

    const res = await fetch("http://localhost:3000/api/generate-full", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "test",
        keyword: "Test Style",
        selfieImage: base64,
        vtonStrength: 50
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log("Status:", res.status);
    console.log("Took ms:", Date.now() - start);
    
    // Check if result contains an image URL
    const text = await res.text();
    console.log("Success:", text.includes("http"));
  } catch(e) {
    console.log("Took ms before error:", Date.now() - start);
    console.error(e);
  }
}
test();
