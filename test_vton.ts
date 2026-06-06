import fetch from "node-fetch";

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/generate-full", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "test",
        keyword: "Test Style",
        selfieImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP",
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
