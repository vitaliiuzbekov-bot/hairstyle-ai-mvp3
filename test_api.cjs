const http = require('http');

const data = JSON.stringify({
  keyword: 'buzz cut',
  gender: 'man',
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/reference',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', (e) => console.error('Error:', e));
req.write(data);
req.end();
