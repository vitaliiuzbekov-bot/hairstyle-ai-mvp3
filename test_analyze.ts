import fs from 'fs';
import path from 'path';

async function run() {
  const boundary = '----WebKitFormBoundaryDummY';
  
  const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
  const imageBuffer = Buffer.from(base64Image, 'base64');
  
  let body = `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="photo"; filename="test.png"\r\n`;
  body += `Content-Type: image/png\r\n\r\n`;
  
  const payload = Buffer.concat([
    Buffer.from(body),
    imageBuffer,
    Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="user_id"\r\n\r\n12345\r\n--${boundary}--\r\n`)
  ]);

  try {
    const response = await fetch('http://127.0.0.1:3000/api/hairstyle/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: payload
    });
    
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body HTML?:', text.includes('<html') ? 'YES' : 'NO');
    console.log('Body:', text.substring(0, 500));
  } catch (e: any) {
    console.error('Fetch error:', e);
  }
}

run();
