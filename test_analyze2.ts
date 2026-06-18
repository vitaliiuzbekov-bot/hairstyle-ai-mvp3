async function run() {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
        userId: "test"
      })
    });
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body:', text.substring(0, 500));
  } catch (e: any) {
    console.error('Fetch error:', e);
  }
}
run();
