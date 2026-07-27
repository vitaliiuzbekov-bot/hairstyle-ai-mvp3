const fs = require('fs');
const file = 'src/server/routes/generate.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `} catch (outerErr: any) {\n    if (!res.headersSent) {\n      res.status(500).json({ error: outerErr.message || "Pipeline error" });\n    }\n  }`,
  `} catch (outerErr: any) {\n    if (!res.headersSent) {\n      let finalError = outerErr.message || "Pipeline error";\n      if (typeof finalError === "object") finalError = JSON.stringify(finalError);\n      res.status(500).json({ error: String(finalError) });\n    }\n  }`
);
fs.writeFileSync(file, content);
console.log('Patched outerErr');
