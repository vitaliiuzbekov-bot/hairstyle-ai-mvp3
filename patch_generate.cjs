const fs = require('fs');
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

content = content.replace(
  `const billingCheck = await checkAndDeductGeneration(userId, idempotencyKey);`,
  `const billingCheck = await checkAndDeductGeneration(userId, idempotencyKey, req.body.tgUserId);`
);

fs.writeFileSync('src/server/routes/generate.ts', content);
console.log("Patched generate.ts successfully");
