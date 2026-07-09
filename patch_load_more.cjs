const fs = require('fs');
let content = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const target = `generateRouter.post("/load-more", freeModelsLimiter, async (req, res) => {
  try {
    const { userId, existingNames, features, preferredStyle } = req.body;`;

const replacement = `generateRouter.post("/load-more", freeModelsLimiter, async (req, res) => {
  try {
    const { userId, existingNames, features, preferredStyle } = req.body;
    
    // We deduct 1 generation for AI load more
    if (!userId) {
        return res.status(401).json({ error: "Missing userId" });
    }
    const billingCheck = await checkAndDeductGeneration(userId, 'load-more-' + Date.now(), undefined, 'load-more-' + Date.now());
    if (!billingCheck.ok) {
        return res.status(403).json({ error: billingCheck.error });
    }
`;

if(content.includes('generateRouter.post("/load-more"')) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/server/routes/generate.ts', content);
    console.log("Patched load-more successfully");
} else {
    console.log("Could not find target");
}
