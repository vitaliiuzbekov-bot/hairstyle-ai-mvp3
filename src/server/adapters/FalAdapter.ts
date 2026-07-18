import { ImageGenerationProvider, FluxOptions, FaceSwapOptions } from "../ports/ImageGenerationProvider";
import { imageGenQueue } from "../utils/queues";

export class FalAdapter implements ImageGenerationProvider {
  private get falKey(): string {
    const key = process.env.FAL_KEY;
    if (!key) {
      throw new Error('FAL_KEY is not defined in environment variables');
    }
    return key;
  }

  async generateBaseImage(options: FluxOptions): Promise<string> {
    const bodyPayload = {
      prompt: options.prompt,
      image_url: options.imageUrl,
      strength: options.strength,
      num_inference_steps: 20
    };

    let retries = 2;
    let lastErrorText = "";
    
    // Используем fal.run для синхронной генерации (queue.fal.run требует поллинга статусов)
    const url = "https://fal.run/fal-ai/flux-pro/v1/image-to-image";

    while (retries >= 0) {
      try {
        const res = await imageGenQueue.add(() => fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Key ${this.falKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyPayload)
        })) as globalThis.Response;

        if (!res.ok) {
          lastErrorText = await res.text();
          console.error(`[FalAdapter][Error] Failed invocation to Fal.run шлюз:`);
          console.error(`Status: ${res.status}`);
          console.error(`Data: ${lastErrorText}`);

          if (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 429) {
            retries--;
            if (retries >= 0) {
              console.log(`FAL Flux Dev HTTP ${res.status}, retrying...`);
              await new Promise(r => setTimeout(r, 1000));
              continue;
            }
          }
          throw new Error(`FAL Flux Dev Error HTTP ${res.status}: ${lastErrorText}`);
        }
        
        const data = await res.json();
        const resultUrl = data.images?.[0]?.url || data.image?.url || data.url;
        if (!resultUrl) {
            throw new Error(`Fal.ai response conversion failed: ${JSON.stringify(data)}`);
        }
        return resultUrl;
      } catch (error: any) {
        if (error.name === 'AbortError') throw error;
        
        console.error(' [FalAdapter][Error] Failed invocation to Fal.run шлюз (Flux):');
        console.error(`Message: ${error.message}`);
        
        if (retries > 0) {
          retries--;
          await new Promise(r => setTimeout(r, 1000));
        } else {
          throw new Error(`Fal.ai integration failed: ${error.message}`);
        }
      }
    }
    throw new Error("FAL.AI Flux failed after retries.");
  }

  async swapFace(options: FaceSwapOptions): Promise<string> {
    const bodyPayload = {
      base_image_url: options.baseImageUrl,
      swap_image_url: options.swapImageUrl
    };

    let retries = 2;
    let lastErrorText = "";
    const url = "https://fal.run/fal-ai/face-swap";

    while (retries >= 0) {
      try {
        const res = await imageGenQueue.add(() => fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Key ${this.falKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyPayload)
        })) as globalThis.Response;

        if (!res.ok) {
          lastErrorText = await res.text();
          console.error(`[FalAdapter][Error] Failed invocation to Fal.run шлюз:`);
          console.error(`Status: ${res.status}`);
          console.error(`Data: ${lastErrorText}`);

          if (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 429) {
            retries--;
            if (retries >= 0) {
              console.log(`FAL FaceSwap HTTP ${res.status}, retrying...`);
              await new Promise(r => setTimeout(r, 1000));
              continue;
            }
          }
          throw new Error(`FAL FaceSwap Error: HTTP ${res.status} - ${lastErrorText}`);
        }

        const data = await res.json();
        const resultUrl = data.image?.url || data.image_url || data.url;
        if (!resultUrl) {
            throw new Error(`Fal.ai response conversion failed: ${JSON.stringify(data)}`);
        }
        return resultUrl;
      } catch (error: any) {
        if (error.name === 'AbortError') throw error;
        
        console.error(' [FalAdapter][Error] Failed invocation to Fal.run шлюз (FaceSwap):');
        console.error(`Message: ${error.message}`);
        
        if (retries > 0) {
          retries--;
          await new Promise(r => setTimeout(r, 1000));
        } else {
          throw new Error(`Fal.ai integration failed: ${error.message}`);
        }
      }
    }
    throw new Error("FAL.AI FaceSwap failed after retries.");
  }
}
