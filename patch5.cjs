const fs = require('fs');
const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'generateRouter.post("/generate-full", async (req, res) => {\n    try {',
  'generateRouter.post("/generate-full", async (req, res) => {\n    const controller = new AbortController();\n    try {'
);

fs.writeFileSync(file, code);
