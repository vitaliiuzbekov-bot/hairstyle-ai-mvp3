const fs = require('fs');
const code = fs.readFileSync('dist/assets/index-BwrFgGWV.js', 'utf8');
const match = code.match(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/);
if (match) {
  console.log("Found base64 string of length:", match[0].length);
  console.log("Starts with:", match[0].substring(0, 50));
} else {
  console.log("No base64 found in bundle.");
}
