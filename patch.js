const fs = require('fs');
const file = 'src/server/routes/generate.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `} catch (outerErr: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: outerErr.message || "Pipeline error" });
    }
  }`,
  `} catch (outerErr: any) {
    if (!res.headersSent) {
      let finalError = outerErr.message || "Pipeline error";
      if (typeof finalError === "object") finalError = JSON.stringify(finalError);
      res.status(500).json({ error: String(finalError) });
    }
  }`
);
fs.writeFileSync(file, content);
console.log('Patched outerErr');
