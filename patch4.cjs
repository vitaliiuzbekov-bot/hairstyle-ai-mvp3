const fs = require('fs');
const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "      })();\n  });",
  "      })();\n    } catch (e: any) {\n      res.status(500).json({ error: e.message });\n    }\n  });"
);

fs.writeFileSync(file, code);
