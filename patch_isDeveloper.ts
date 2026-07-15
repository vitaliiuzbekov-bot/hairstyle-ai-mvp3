import fs from 'fs';

let generateCode = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

if (!generateCode.includes('import { isAuthorizedDeveloper }')) {
  generateCode = generateCode.replace('import { uploadImageToFal } from "../services/falClient";', 'import { uploadImageToFal } from "../services/falClient";\nimport { isAuthorizedDeveloper } from "../utils/tgAuth";');
}

generateCode = generateCode.replace(
  "const isDeveloper = req.header('x-developer-mode') === 'true' || req.body?.isDeveloper === 'true';",
  "const isDeveloper = isAuthorizedDeveloper(req.header('x-telegram-init-data'));"
);

generateCode = generateCode.replace(
  "const isDeveloper = req.header('x-developer-mode') === 'true' || req.body?.isDeveloper === 'true';",
  "const isDeveloper = isAuthorizedDeveloper(req.header('x-telegram-init-data'));"
);

fs.writeFileSync('src/server/routes/generate.ts', generateCode);

let referenceCode = fs.readFileSync('src/server/routes/reference.ts', 'utf8');

if (!referenceCode.includes('import { isAuthorizedDeveloper }')) {
  // Find a good place to import
  referenceCode = referenceCode.replace('import { logToTelegram }', 'import { isAuthorizedDeveloper } from "../utils/tgAuth";\nimport { logToTelegram }');
}

referenceCode = referenceCode.replace(
  'const isDeveloper = req.header("x-developer-mode") === "true" || req.body.isDeveloper === true;',
  "const isDeveloper = isAuthorizedDeveloper(req.header('x-telegram-init-data'));"
);

fs.writeFileSync('src/server/routes/reference.ts', referenceCode);
console.log("Patched both routes");
