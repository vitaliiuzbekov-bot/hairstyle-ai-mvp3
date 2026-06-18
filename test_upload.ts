import FormData from 'form-data';
import fetch from 'node-fetch';

async function run() {
  const form = new FormData();
  form.append("keyword", "test");
  form.append("userId", "local-user");
  // 20MB of a string
  const base64Data = "A".repeat(20 * 1024 * 1024);
  form.append("selfieImage", base64Data);
  // Try sending
  const res = await fetch("http://localhost:3000/api/generate-full", {
    method: "POST",
    body: form,
  });
  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));
  const text = await res.text();
  console.log("Response:", text.substring(0, 500));
}
run();
