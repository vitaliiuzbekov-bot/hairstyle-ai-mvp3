const fs = require('fs');
const path = './src/services/localHistory.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "const HISTORY_KEY = 'neurostylist_history';\n\n// A helper to sync to Telegram CloudStorage if available",
  "const HISTORY_KEY = 'neurostylist_history';\n\n// In-memory cache to prevent object URL memory leaks\nconst blobUrlCache = new Map<number, string>();\nconst originalBlobUrlCache = new Map<number, string>();\n\n// A helper to sync to Telegram CloudStorage if available"
);

code = code.replace(
  "    // Revive blob URLs\n    return history.map(item => {\n      let finalUrl = item.url;\n      let finalOriginalUrl = item.originalUrl;\n      \n      if (item.blob) {\n        finalUrl = URL.createObjectURL(item.blob);\n      }\n      if (item.originalBlob) {\n        finalOriginalUrl = URL.createObjectURL(item.originalBlob);\n      }\n      return {\n        ...item,\n        url: finalUrl,\n        originalUrl: finalOriginalUrl\n      };\n    });",
  "    // Revive blob URLs\n    return history.map(item => {\n      let finalUrl = item.url;\n      let finalOriginalUrl = item.originalUrl;\n      \n      if (item.blob) {\n        if (!blobUrlCache.has(item.timestamp)) {\n           blobUrlCache.set(item.timestamp, URL.createObjectURL(item.blob));\n        }\n        finalUrl = blobUrlCache.get(item.timestamp)!;\n      }\n      if (item.originalBlob) {\n        if (!originalBlobUrlCache.has(item.timestamp)) {\n           originalBlobUrlCache.set(item.timestamp, URL.createObjectURL(item.originalBlob));\n        }\n        finalOriginalUrl = originalBlobUrlCache.get(item.timestamp)!;\n      }\n      return {\n        ...item,\n        url: finalUrl,\n        originalUrl: finalOriginalUrl\n      };\n    });"
);

code = code.replace(
  "export const removeHistoryItem = async (timestamp: number, url: string): Promise<HistoryItem[]> => {\n  const history = await getHistory();\n  // We need to match on timestamp or url\n  const newHistory = history.filter(\n    (item) => item.timestamp !== timestamp\n  );\n  await saveHistory(newHistory);\n  return await getHistory();\n};",
  "export const removeHistoryItem = async (timestamp: number, url: string): Promise<HistoryItem[]> => {\n  const history = await getHistory();\n  // We need to match on timestamp or url\n  const newHistory = history.filter(\n    (item) => item.timestamp !== timestamp\n  );\n  if (blobUrlCache.has(timestamp)) {\n      URL.revokeObjectURL(blobUrlCache.get(timestamp)!);\n      blobUrlCache.delete(timestamp);\n  }\n  if (originalBlobUrlCache.has(timestamp)) {\n      URL.revokeObjectURL(originalBlobUrlCache.get(timestamp)!);\n      originalBlobUrlCache.delete(timestamp);\n  }\n  await saveHistory(newHistory);\n  return await getHistory();\n};"
);

fs.writeFileSync(path, code);
