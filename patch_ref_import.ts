import fs from 'fs';

let referenceCode = fs.readFileSync('src/server/routes/reference.ts', 'utf8');
if (!referenceCode.includes('import { isAuthorizedDeveloper }')) {
  referenceCode = 'import { isAuthorizedDeveloper } from "../utils/tgAuth";\n' + referenceCode;
}
fs.writeFileSync('src/server/routes/reference.ts', referenceCode);
