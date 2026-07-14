async function run() {
  try {
    const res = await fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    console.log("Status:", res.status);
    console.log("Text:", await res.text());
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
run();
