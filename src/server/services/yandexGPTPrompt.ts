import { HairParams } from './hairAnalyzer';
import { getYandexIamToken, extractFolderId } from './yandex';

interface PromptInput {
  hairstyleName: string;
  hairParams: HairParams;
  userAge: number;
  userGender: string;
}

export async function buildHairstylePromptEn(input: PromptInput): Promise<string> {
  const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
  const rawFolderId = process.env.YANDEX_FOLDER_ID;
  const apiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_OAUTH_TOKEN;

  let authHeader = '';
  let folderId = '';
  
  try {
    if (saKey && rawFolderId) {
      const iamToken = await getYandexIamToken(saKey);
      authHeader = `Bearer ${iamToken}`;
      folderId = extractFolderId(rawFolderId);
    } else if (apiKey && rawFolderId) {
      authHeader = `Api-Key ${apiKey}`;
      folderId = extractFolderId(rawFolderId);
    } else {
      return `${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, photorealistic salon photo`;
    }
  } catch (e) {
    console.warn("Failed to get IAM token for YandexGPT (buildHairstylePromptEn), using fallback prompt:", e);
    return `${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, photorealistic salon photo`;
  }

  const systemPrompt = `You are a professional hairstylist with 20 years of experience.
Create detailed prompts in ENGLISH for AI hair generation (Stable Diffusion).
CRITICAL: The hairstyle must match the client's REAL hair density, texture, and type.
Do not make thin hair look thick. Do not make curly hair straight.
If the client is a child (under 15), ensure the prompt requests a child model.
If the client has low density hair, they are balding or have very thin hair; ensure the prompt reflects a balding/thinning or clean shaven look without magically adding hair.`;

  const userPrompt = `Client parameters:
- Age: ${input.userAge} years old
- Gender: ${input.userGender}
- Real hair: ${input.hairParams.promptSuffixEn}
- Desired hairstyle: ${input.hairstyleName}

Create a prompt (max 80 words) for Stable Diffusion. Include:
- Hairstyle name and shape
- Realistic volume for this hair density
- Age-appropriate styling
- Photo quality markers (photorealistic, salon photo, natural lighting)

IMPORTANT: If the client has ${input.hairParams.density} density, the result must show ${input.hairParams.density} density hair. Do not add volume that doesn't exist.`;

  try {
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt/latest`,
        completionOptions: { stream: false, temperature: 0.4, maxTokens: 250 },
        messages: [
          { role: 'system', text: systemPrompt },
          { role: 'user', text: userPrompt },
        ],
      })
    });

    const data: any = await response.json();
    return data?.result?.alternatives?.[0]?.message?.text ||
      `${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, photorealistic salon photo`;
  } catch (error) {
    console.error("YandexGPT error:", error);
    return `${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, photorealistic salon photo`;
  }
}

export async function buildReferencePromptEn(input: PromptInput): Promise<string> {
  const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
  const rawFolderId = process.env.YANDEX_FOLDER_ID;
  const apiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_OAUTH_TOKEN;

  let authHeader = '';
  let folderId = '';
  
  try {
    if (saKey && rawFolderId) {
      const iamToken = await getYandexIamToken(saKey);
      authHeader = `Bearer ${iamToken}`;
      folderId = extractFolderId(rawFolderId);
    } else if (apiKey && rawFolderId) {
      authHeader = `Api-Key ${apiKey}`;
      folderId = extractFolderId(rawFolderId);
    } else {
      return `model with ${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, ${input.userAge} year old ${input.userGender}, salon photo`;
    }
  } catch (e) {
    console.warn("Failed to get IAM token for YandexGPT (buildReferencePromptEn), using fallback prompt:", e);
    return `model with ${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, ${input.userAge} year old ${input.userGender}, salon photo`;
  }

  const systemPrompt = `You are a professional hairstylist creating reference images for clients.
Generate prompts for AI to create photos of MODELS (not the client) with specific hairstyles.
Models must match the client's age range, gender, and real hair parameters.
If the client is a child (under 15), generate a prompt for a child.
If the client has low density hair, generate a prompt for a balding or thin-haired person.`;

  const userPrompt = `Client for reference:
- Age: ${input.userAge} years old
- Gender: ${input.userGender}
- Hair: ${input.hairParams.promptSuffixEn}
- Hairstyle to show: ${input.hairstyleName}

Create a prompt (max 60 words) for a REFERENCE PHOTO of a MODEL with this hairstyle.
Model: ~${input.userAge} years old, ${input.userGender}.
Hair must be: ${input.hairParams.promptSuffixEn}.
Style: professional salon photo, clean background, 3/4 angle.`;

  try {
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt/latest`,
        completionOptions: { stream: false, temperature: 0.3, maxTokens: 200 },
        messages: [
          { role: 'system', text: systemPrompt },
          { role: 'user', text: userPrompt },
        ],
      })
    });


    const data: any = await response.json();
    return data?.result?.alternatives?.[0]?.message?.text ||
      `model with ${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, ${input.userAge} year old ${input.userGender}, salon photo`;
  } catch (error) {
    console.error("YandexGPT error:", error);
    return `model with ${input.hairstyleName} haircut, ${input.hairParams.promptSuffixEn}, ${input.userAge} year old ${input.userGender}, salon photo`;
  }
}
