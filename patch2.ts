import fs from 'fs';

const file = 'src/server/routes/generate.ts';
let code = fs.readFileSync(file, 'utf8');

// The block to replace:
const startStr = "let finalTargetImageUrl = targetImageUrl;";
const endStr = "if (!finalTargetImageUrl.startsWith('data:') && !finalTargetImageUrl.startsWith('http')) {\n            console.log(`[generate-full] CRITICAL WARNING: targetImageUrl could not be resolved to base64. Using original path: ${normalizePath}`);\n        }\n      }";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replaceStr = "let finalTargetImageUrl = await resolveImageToBase64(targetImageUrl);";
  code = code.substring(0, startIdx) + replaceStr + code.substring(endIdx + endStr.length);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced finalTargetImageUrl logic");
} else {
  console.log("Could not find start/end indices for finalTargetImageUrl", startIdx, endIdx);
}
