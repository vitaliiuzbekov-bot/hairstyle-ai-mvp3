const fs = require('fs');
let code = fs.readFileSync('tests/adapters/FalAdapter.test.ts', 'utf-8');

const target = `      return {
        data: {
          image: {
            url: "https://cdn.fal.media/output.jpg"
          }
        },
        requestId: "req_123"
      };`;

const replacement = `      return {
        image: {
          url: "https://cdn.fal.media/output.jpg"
        },
        requestId: "req_123"
      };`;

code = code.replace(target, replacement);
fs.writeFileSync('tests/adapters/FalAdapter.test.ts', code);
console.log("Patched test");
