async function run() {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/hairstyle/analyze');
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body HTML?:', text.includes('<html') ? 'YES' : 'NO');
    console.log('Body:', text.substring(0, 500));
  } catch (e: any) {
    console.error('Fetch error:', e);
  }
}
run();
