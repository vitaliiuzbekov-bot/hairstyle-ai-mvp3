import fs from 'fs';

const file = 'src/server/utils/billing.ts';
let code = fs.readFileSync(file, 'utf8');

const target1 = 'if (!adminDb) {\n    return { ok: true }; // Firebase admin not configured, allow\n  }';
const replacement1 = 'if (!adminDb) {\n    return { ok: false, error: "Сервис временно недоступен. Попробуйте позже." }; // Firebase admin not configured, reject\n  }';
code = code.replace(target1, replacement1);

const target2 = 'console.warn("Firebase permission denied. Bypassing billing check.");\n      return { ok: true };';
const replacement2 = 'console.warn("Firebase permission denied. Blocking request.");\n      return { ok: false, error: "Сервис временно недоступен. Попробуйте позже." };';
code = code.replace(target2, replacement2);

fs.writeFileSync(file, code);
console.log("Successfully patched billing.ts");
