const http = require('http');

const data = JSON.stringify({
  keyword: "Французский боб",
  gender: "Женщина",
  ageRange: "25",
  faceShape: "Овальная"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/reference',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.write(data);
req.end();
