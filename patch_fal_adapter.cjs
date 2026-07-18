const fs = require('fs');
let code = fs.readFileSync('./src/server/adapters/FalAdapter.ts', 'utf-8');

const targetMethodGenerateBaseImage = `
      const resultUrl = result.data?.images?.[0]?.url || result.data?.image?.url || result.data?.url;
      if (!resultUrl) {
        throw new Error(\`[FalAdapter] SDK не вернул URL результирующего изображения. Ответ: \${JSON.stringify(result.data)}\`);
      }
`;

const replacementGenerateBaseImage = `
      const resultUrl = this.extractUrl(result);
      if (!resultUrl) {
        console.error("[FalAdapter] Missing URL. Full result:", JSON.stringify(result, null, 2));
        throw new Error(\`[FalAdapter] SDK не вернул URL результирующего изображения. Ответ: \${JSON.stringify(result)}\`);
      }
`;

const targetMethodSwapFace = `
      const resultUrl = result.data?.image?.url || result.data?.image_url || result.data?.url;
      if (!resultUrl) {
        throw new Error(\`[FalAdapter] SDK не вернул URL результирующего изображения. Ответ: \${JSON.stringify(result.data)}\`);
      }
`;

const replacementSwapFace = `
      const resultUrl = this.extractUrl(result);
      if (!resultUrl) {
        console.error("[FalAdapter] Missing URL. Full result:", JSON.stringify(result, null, 2));
        throw new Error(\`[FalAdapter] SDK не вернул URL результирующего изображения. Ответ: \${JSON.stringify(result)}\`);
      }
`;

code = code.replace(targetMethodGenerateBaseImage.trim(), replacementGenerateBaseImage.trim());
code = code.replace(targetMethodSwapFace.trim(), replacementSwapFace.trim());

const privateMethodToAdd = `
  private extractUrl(res: any): string | null {
    if (!res) return null;
    const candidates = [
      res.images?.[0]?.url,
      res.data?.images?.[0]?.url,
      res.image?.url,
      res.data?.image?.url,
      res.url,
      res.data?.url,
      res.data?.image_url,
      res.image_url
    ];
    for (const url of candidates) {
      if (typeof url === 'string' && url.startsWith('http')) {
        return url;
      }
    }
    return null;
  }
`;

const constructorTarget = `
  constructor() {
    // SDK автоматически подхватывает переменную окружения process.env.FAL_KEY
    if (!process.env.FAL_KEY) {
      throw new Error('[FalAdapter] Нарушена конфигурация среды: process.env.FAL_KEY не задан');
    }
  }
`;

code = code.replace(constructorTarget.trim(), constructorTarget.trim() + "\\n\\n" + privateMethodToAdd.trim());

fs.writeFileSync('./src/server/adapters/FalAdapter.ts', code);
console.log("Patched FalAdapter.ts");
