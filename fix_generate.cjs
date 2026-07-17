const fs = require('fs');
let code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const targetStr = `generateRouter.post("/generate-full/status", async (req, res) => {
  try {
    const { jobId } = req.body;`;

const replacementStr = `generateRouter.post("/generate-full/status", async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    const { jobId } = req.body;`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/server/routes/generate.ts', code);
console.log("Updated generate.ts");
