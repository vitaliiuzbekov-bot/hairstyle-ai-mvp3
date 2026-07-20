import * as fal from '@fal-ai/serverless-client';

const API_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY || '';
fal.config({
  credentials: API_KEY || 'mock-key',
});

interface GenerateImageInput {
  prompt: string;
  imageUrl: string;
  maskUrl: string;
  negativePrompt?: string;
  numSteps?: number;
  guidanceScale?: number;
  strength?: number;
}

export async function generateWithInpainting(input: GenerateImageInput): Promise<string> {
  if (!API_KEY || API_KEY === 'mock-key') {
    console.warn("FAL_KEY is missing, returning a fallback image for inpainting.");
    return "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&auto=format&fit=crop&q=60";
  }

  const result = await fal.subscribe('fal-ai/flux-lora/inpainting', {
    input: {
      image_url: input.imageUrl,
      mask_url: input.maskUrl,
      prompt: input.prompt,
      negative_prompt: input.negativePrompt ||
        'different face, wig, cartoon, blurry, distorted features, unnatural hair, plastic skin',
      num_inference_steps: input.numSteps || 28,
      guidance_scale: input.guidanceScale || 7.5,
      strength: input.strength || 0.85,
    },
    logs: false,
  });

  return (result as any).images[0].url;
}

export async function uploadImageToFal(base64DataUri: string): Promise<string> {
  let finalUri = base64DataUri;
  if (typeof finalUri === 'string' && !finalUri.startsWith('data:') && !finalUri.startsWith('http')) {
      finalUri = 'data:image/jpeg;base64,' + finalUri;
  }
  
  if (finalUri.startsWith('data:')) {
    try {
      const match = finalUri.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const mimeType = `image/${match[1]}`;
        const buffer = Buffer.from(match[2], 'base64');
        const blob = new Blob([buffer], { type: mimeType });
        const uploadedUrl = await fal.storage.upload(blob);
        return uploadedUrl;
      }
    } catch (e) {
      console.warn("Failed to upload to fal.storage:", e);
    }
  }

  return finalUri;
}

export async function generateReference(prompt: string): Promise<string> {
  if (!API_KEY || API_KEY === 'mock-key') {
    console.warn("FAL_KEY is missing, returning a fallback image for reference.");
    return "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=60";
  }

  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt: prompt,
      negative_prompt: 'ugly, deformed, extra fingers, blurry, text, watermark',
      num_inference_steps: 4,
      // guidance_scale: 7.0,
      image_size: 'portrait_4_3',
    },
    logs: false,
  });

  return (result as any).images[0].url;
}
