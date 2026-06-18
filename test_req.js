import http from "http";
import fs from "fs";

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', data.substring(0, 500)));
});
req.on('error', e => console.error(e));
req.write(JSON.stringify({ imageUrl: 'http://example.com/img.jpg' }));
req.end();
