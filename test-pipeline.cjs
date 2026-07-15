const fs = require('fs');
async function run() {
  const payload = {
    userId: "test-user",
    keyword: "Pixie",
    selfieImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    targetImageUrl: "https://fal.media/files/monkey/abc.jpg"
  };
  const res = await fetch("http://localhost:3000/api/generate-full", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Response:", data);
  if (data.jobId) {
    while(true) {
      await new Promise(r => setTimeout(r, 2000));
      const p = await fetch("http://localhost:3000/api/job/" + data.jobId);
      const d = await p.json();
      console.log("Poll:", d);
      if (d.status === 'completed' || d.status === 'error') break;
    }
  }
}
run();
