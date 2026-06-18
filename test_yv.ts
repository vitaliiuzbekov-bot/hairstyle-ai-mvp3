import { detectFaceAndHairline } from './src/server/services/yandexVision';
import { getYandexIamToken } from './src/server/services/yandex';
import 'dotenv/config';

async function test() {
  const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
  if (!saKey) throw new Error("No SA key");
  const iamToken = await getYandexIamToken(saKey);
  
  // Create a 1x1 base64 encoded image
  const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

  try {
    const res = await fetch('https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${iamToken}`
      },
      body: JSON.stringify({
        folderId: "b1gels913826k38vrotg",
        analyzeSpecs: [{
          features: [{ type: 'FACE_DETECTION' }],
          content: base64,
        }],
      })
    });
    console.log(res.status, await res.text());
  } catch (err) {
    console.error(err);
  }
}
test().catch(console.error);
