const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target = `    const userParam = parsedData.get('user');
    if (userParam && req.body?.tgUserId) {
      const userObj = JSON.parse(userParam);
      if (userObj.id.toString() !== req.body.tgUserId.toString()) { 
         res.status(403).json({ error: "Telegram User ID mismatch in request and Init Data" });
         return;
      }
    }`;

const replacement = `    const userParam = parsedData.get('user');
    if (userParam) {
      const userObj = JSON.parse(userParam);
      if (req.body) {
        req.body.tgUserId = userObj.id.toString();
      }
    } else {
      res.status(403).json({ error: "Invalid Telegram Init Data: Missing user" });
      return;
    }`;

content = content.replace(/const userParam = parsedData\.get\('user'\);[\s\S]*?    }/, replacement);
fs.writeFileSync('server.ts', content);
console.log("Patched server.ts successfully");
