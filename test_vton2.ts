import fetch from "node-fetch";

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/generate-full", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "test",
        keyword: "Test Style",
        selfieImage: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        vtonStrength: 50
      })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch(e) {
    console.error(e);
  }
}
test();
