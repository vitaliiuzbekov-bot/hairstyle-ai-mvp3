const fs = require('fs');
let code = fs.readFileSync('src/server/routes/reference.ts', 'utf8');

const limiterCode = `
const referenceLimiter = createRateLimiter(5 * 60 * 1000, 20); // 20 requests per 5 minutes

export const referenceRouter = Router();

referenceRouter.post("/reference", referenceLimiter, async (req: Request, res: Response): Promise<void> => {
`;

code = code.replace(
  /export const referenceRouter = Router\(\);\s*referenceRouter\.post\("\/reference", async \(req: Request, res: Response\): Promise<void> => \{/,
  limiterCode.trim()
);

const validationCode = `
    const { keyword, gender, hairColor, isLibrary } = req.body;
    
    // VALIDATE LIBRARY KEYWORD TO PREVENT ABUSE
    if (isLibrary) {
      const library = gender === 'male' ? MALE_LIBRARY : FEMALE_LIBRARY;
      const existsInLibrary = library.some(item => item.imageKeyword === keyword);
      if (!existsInLibrary) {
        console.warn(\`Unauthorized library reference generation attempt for keyword: \${keyword}\`);
        res.status(403).json({ error: "Invalid library keyword" });
        return;
      }
    }
`;

code = code.replace(
  /const \{ keyword, gender, hairColor, isLibrary \} = req\.body;/,
  validationCode.trim()
);

fs.writeFileSync('src/server/routes/reference.ts', code);
