const http = require('http');
const FormData = require('form-data');

const form = new FormData();
form.append('selfieImage', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAGBAQEAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8A0s8g/9k=');
form.append('keyword', 'test style');
form.append('userId', '12345');
form.append('isDeveloper', 'true');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/generate-full/start',
  method: 'POST',
  headers: form.getHeaders(),
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log('BODY:', data); });
});

form.pipe(req);
