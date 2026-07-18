const fs = require('fs');
let code = fs.readFileSync('./src/server/adapters/FalAdapter.ts', 'utf-8');

const oldExtractUrl = `  private extractUrl(res: any): string | null {
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
  }`;

const newExtractUrl = `  private extractResultUrl(result: any): string | null {
    const possiblePaths = [
      result?.output?.images?.[0]?.url,
      result?.images?.[0]?.url,
      result?.image?.url,
      result?.url
    ];

    return possiblePaths.find(url => typeof url === 'string') || null;
  }`;

code = code.replace(oldExtractUrl, newExtractUrl);

const oldGenBaseError = `      const resultUrl = this.extractUrl(result);
      if (!resultUrl) {
        console.error("[FalAdapter] Missing URL. Full result:", JSON.stringify(result, null, 2));
        throw new Error(\`[FalAdapter] SDK не вернул URL результирующего изображения. Ответ: \${JSON.stringify(result)}\`);
      }`;

const newGenBaseError = `      const resultUrl = this.extractResultUrl(result);
      if (!resultUrl) {
        console.error("DEBUG: Fal SDK Response:", JSON.stringify(result, null, 2));
        throw new Error(\`[FalAdapter] Не удалось найти URL изображения в ответе.\`);
      }`;

code = code.replace(oldGenBaseError, newGenBaseError);
code = code.replace(oldGenBaseError, newGenBaseError); // swapFace uses the same code block exactly

fs.writeFileSync('./src/server/adapters/FalAdapter.ts', code);
console.log("Replaced!");
