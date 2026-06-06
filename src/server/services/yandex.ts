import jwt from "jsonwebtoken";
import "dotenv/config";

let cachedIamToken: string | null = null;
let iamTokenExpiry: number = 0;

export async function getYandexIamToken(serviceAccountKeyJSON: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedIamToken && iamTokenExpiry > now + 120) {
    return cachedIamToken;
  }

  let key;
  try {
    key = JSON.parse(serviceAccountKeyJSON);
  } catch (e: any) {
    throw new Error("Не удалось распарсить YANDEX_SERVICE_ACCOUNT_KEY");
  }
  
  if (!key.service_account_id || !key.private_key || !key.id) {
    throw new Error("YANDEX_SERVICE_ACCOUNT_KEY не содержит необходимых полей");
  }

  const payload = {
    aud: "https://iam.api.cloud.yandex.net/iam/v1/tokens",
    iss: key.service_account_id,
    iat: now,
    exp: now + 3600
  };

  const jwtToken = jwt.sign(payload, key.private_key, {
    algorithm: 'PS256',
    keyid: key.id
  });

  const res = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt: jwtToken })
  });

  if (!res.ok) {
    throw new Error(`Failed to get IAM token: ${await res.text()}`);
  }

  const data = await res.json();
  cachedIamToken = data.iamToken;
  iamTokenExpiry = now + 3600;

  return cachedIamToken;
}

export function extractFolderId(rawFolderId: string): string {
  let cleaned = rawFolderId.trim().replace(/^["']|["']$/g, '');
  
  // Cut query strings & hashes first
  cleaned = cleaned.split('?')[0].split('#')[0].trim();
  
  // Extract the ID after /folders/ or folders/ if present
  if (cleaned.includes('/folders/')) {
    const parts = cleaned.split('/folders/');
    const folderPart = parts[parts.length - 1]; // e.g. "b1gels913826k38vrotg/overview" or "b1gels913826k38vrotg"
    cleaned = folderPart.split('/')[0];
  } else if (cleaned.includes('folders/')) {
    const parts = cleaned.split('folders/');
    const folderPart = parts[parts.length - 1];
    cleaned = folderPart.split('/')[0];
  } else if (cleaned.includes('/')) {
    const parts = cleaned.split('/').filter(Boolean);
    const folderIdCandidate = parts.find(p => p.startsWith('b1') && p.length >= 10);
    if (folderIdCandidate) {
      cleaned = folderIdCandidate;
    } else {
      cleaned = parts[parts.length - 1] || cleaned;
    }
  }
  
  return cleaned.trim();
}

export async function callYandexGPTChat(systemText: string, messages: {role: string, text: string}[]): Promise<string> {
    const folderId = process.env.YANDEX_FOLDER_ID;
    const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
    if (!folderId || !saKey) {
        throw new Error("YANDEX_FOLDER_ID или YANDEX_SERVICE_ACCOUNT_KEY не установлены");
    }
    const cleanFolderId = extractFolderId(folderId);
    
    if (cleanFolderId === "MY_FOLDER_ID" || cleanFolderId.toLowerCase().includes("folder_id") || cleanFolderId.length < 5) {
        throw new Error(`[ОШИБКА НАСТРОЙКИ СЕРВЕРА] В переменных окружения вашего сервера (на Render.com) в ключе YANDEX_FOLDER_ID все еще указан стандартный шаблон или плейсхолдер "${cleanFolderId}". Пожалуйста, зайдите в настройки (Environment) на Render.com и замените "MY_FOLDER_ID" на реальный Идентификатор каталога (например, b1gqp...).`);
    }

    const iamToken = await getYandexIamToken(saKey);
    
    const payload = {
      modelUri: `gpt://${cleanFolderId}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.85,
        maxTokens: 2000
      },
      messages: [
        { role: "system", text: systemText },
        ...messages
      ]
    };

    const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${iamToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Ответ YandexGPT: ${err}`);
    }

    const data = await res.json();
    return data.result.alternatives[0].message.text;
}

export async function callYandexGPT(systemText: string, userText: string): Promise<string> {
    const folderId = process.env.YANDEX_FOLDER_ID;
    const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
    if (!folderId || !saKey) {
        throw new Error("YANDEX_FOLDER_ID или YANDEX_SERVICE_ACCOUNT_KEY не установлены");
    }
    const cleanFolderId = extractFolderId(folderId);
    
    if (cleanFolderId === "MY_FOLDER_ID" || cleanFolderId.toLowerCase().includes("folder_id") || cleanFolderId.length < 5) {
        throw new Error(`[ОШИБКА НАСТРОЙКИ СЕРВЕРА] В переменных окружения вашего сервера (на Render.com) в ключе YANDEX_FOLDER_ID все еще указан стандартный шаблон или плейсхолдер "${cleanFolderId}". Пожалуйста, зайдите в настройки (Environment) на Render.com и замените "MY_FOLDER_ID" на реальный Идентификатор каталога (например, b1gqp...).`);
    }

    const iamToken = await getYandexIamToken(saKey);
    
    const payload = {
      modelUri: `gpt://${cleanFolderId}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.85,
        maxTokens: 2000
      },
      messages: [
        { role: "system", text: systemText },
        { role: "user", text: userText }
      ]
    };

    const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${iamToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        let diagnostic = "";
        if (err.includes("model_uri") || err.includes("modelUri") || res.status === 400) {
            const masked = cleanFolderId.length > 5 
               ? `${cleanFolderId.slice(0, 4)}...${cleanFolderId.slice(-4)}` 
               : cleanFolderId;
            diagnostic = `\n(Диагностика: Модель YandexGPT отклонила запрос с ошибкой "invalid model_uri". Проверьте, что в переменных окружения вашего сервера (например, на Render.com) Идентификатор каталога (YANDEX_FOLDER_ID) указан абсолютно правильно. Значение, используемое сейчас сервером: "${masked}" [длина: ${cleanFolderId.length}].)`;
        }
        throw new Error(`YandexGPT API Error HTTP ${res.status}: ${err}${diagnostic}`);
    }
    
    const data = await res.json();
    return data.result.alternatives[0].message.text;
}
