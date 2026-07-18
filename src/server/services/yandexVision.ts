import { getYandexIamToken, extractFolderId } from './llm';

export interface HairlineCoords {
  topCenter: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
  midForehead: { x: number; y: number };
  lowForehead: { x: number; y: number };
}

export interface FaceData {
  hairline: HairlineCoords;
  faceBbox: { x: number; y: number; width: number; height: number };
  age: number;
  gender: string;
}

export async function detectFaceAndHairline(
  imageBase64: string
): Promise<FaceData | null> {
  const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
  const apiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_OAUTH_TOKEN;
  const rawFolderId = process.env.YANDEX_FOLDER_ID;

  if (!saKey && !apiKey) {
    throw new Error('Yandex credentials are not set (YANDEX_SERVICE_ACCOUNT_KEY or YANDEX_API_KEY missing), локальный фоллбэк активирован');
  }

  let authHeader = '';
  if (saKey) {
    const iamToken = await getYandexIamToken(saKey);
    authHeader = `Bearer ${iamToken}`;
  } else if (apiKey) {
    authHeader = `Api-Key ${apiKey}`;
  }

  const folderId = extractFolderId(rawFolderId || '');

  const response = await fetch('https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      folderId,
      analyzeSpecs: [{
        features: [{ type: 'FACE_DETECTION' }],
        content: imageBase64,
      }],
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Yandex Vision error: ${response.status} ${response.statusText} ${errText}`);
  }

  const data: any = await response.json();
  if (data.results?.[0]?.error) {
    throw new Error(`Yandex Vision batch error: ${data.results[0].error.message}`);
  }
  if (data.results?.[0]?.results?.[0]?.error) {
    throw new Error(`Yandex Vision task error: ${data.results[0].results[0].error.message}`);
  }
  console.log("Yandex Vision response:", JSON.stringify(data, null, 2));
  const faces = data.results?.[0]?.results?.[0]?.faceDetection?.faces;
  if (!faces || faces.length === 0) return null;

  const face = faces[0];
  const bbox = face.boundingBox!;

  let left = 0, top = 0, width = 0, height = 0;
  if (bbox.vertices && bbox.vertices.length === 4) {
    const xs = bbox.vertices.map((v: any) => parseInt(v.x || '0', 10));
    const ys = bbox.vertices.map((v: any) => parseInt(v.y || '0', 10));
    left = Math.min(...xs);
    top = Math.min(...ys);
    width = Math.max(...xs) - left;
    height = Math.max(...ys) - top;
  }

  const hairline: HairlineCoords = {
    topCenter: { x: left + width * 0.5, y: top + height * 0.03 },
    leftTemple: { x: left + width * 0.08, y: top + height * 0.08 },
    rightTemple: { x: left + width * 0.92, y: top + height * 0.08 },
    midForehead: { x: left + width * 0.5, y: top + height * 0.12 },
    lowForehead: { x: left + width * 0.5, y: top + height * 0.22 },
  };

  return {
    hairline,
    faceBbox: { x: left, y: top, width, height },
    age: face.age || 30,
    gender: face.gender || 'unknown',
  };
}
