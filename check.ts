import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const fd = new FormData();
// if (fs.existsSync('face.jpg')) {
//   fd.append('photo', fs.createReadStream('face.jpg'));
// } else {
//   console.log("No face.jpg, sending empty request");
// }
fd.append('user_id', 'test_123');

console.log("Fetching /api/hairstyle/analyze...");
fetch("http://localhost:3001/api/hairstyle/analyze", {
  method: "POST",
  body: fd as any
}).then(async r => {
  console.log("Status:", r.status);
  console.log("Body:", await r.text());
}).catch(console.error);
