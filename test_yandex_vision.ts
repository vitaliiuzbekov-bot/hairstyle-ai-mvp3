import { extractFolderId, getYandexIamToken } from './src/server/services/yandex';
import "dotenv/config";

async function test() {
    const folderId = process.env.YANDEX_FOLDER_ID;
    const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
    const cleanFolderId = extractFolderId(folderId!);
    console.log("folderId is:", cleanFolderId);
    const iamToken = await getYandexIamToken(saKey!);
    
    // tiny 1x1 image
    const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
    
    const payload1 = {
      modelUri: `vis://${cleanFolderId}/yandexvision/latest`,
      completionOptions: { stream: false, temperature: 0.1, maxTokens: 100 },
      messages: [
        { 
          role: "user", 
          text: "What is this image?",
          image: base64Image
        }
      ]
    };
    
    const res1 = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${iamToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload1)
    });
    console.log("PAYLOAD 1 STATUS:", res1.status, await res1.text());
}

test().catch(console.error);
