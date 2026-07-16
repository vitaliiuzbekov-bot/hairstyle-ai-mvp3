const fs = require('fs');
let code = fs.readFileSync('src/server/utils/billing.ts', 'utf8');

// Change `if (process.env.NODE_ENV !== "production" && userId === "local-user")` 
// to `if (userId === "local-user")`
code = code.replace(
  'if (process.env.NODE_ENV !== "production" && userId === "local-user") {',
  'if (userId === "local-user") {'
);

fs.writeFileSync('src/server/utils/billing.ts', code);
console.log('done');
