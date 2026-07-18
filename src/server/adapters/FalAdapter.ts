import { ImageGenerationProvider, FluxOptions, FaceSwapOptions } from "../ports/ImageGenerationProvider";
import { imageGenQueue } from "../utils/queues";

export class FalAdapter implements ImageGenerationProvider {
  private get falKey(): string {
    return process.env.FAL_KEY || "";
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
    while (retries >= 0) {
      try {
        const res = await imageGenQueue.add(() => fetch("https://fal.run/fal-ai/flux-pro/v1/image-to-image", {
          method: "POST",
          headers: {
            "Authorization": `Key ${this.falKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyPayload)
        })) as globalThis.Response;

        if (!res.ok) {
          lastErrorText = await res.text();
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
        const url = data.images?.[0]?.url || data.image?.url || data.url;
        if (!url) throw new Error("Unexpected FAL Flux output format: " + JSON.stringify(data));
        return url;
      } catch (e: any) {
        if (e.name === 'AbortError') throw e;
        if (retries > 0) {
          retries--;
          await new Promise(r => setTimeout(r, 1000));
        } else {
          throw e;
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
    while (retries >= 0) {
      try {
        const res = await imageGenQueue.add(() => fetch("https://fal.run/fal-ai/face-swap", {
          method: "POST",
          headers: {
            "Authorization": `Key ${this.falKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyPayload)
        })) as globalThis.Response;

        if (!res.ok) {
          lastErrorText = await res.text();
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
        const url = data.image?.url || data.image_url || data.url;
        if (!url) throw new Error(`Unexpected FAL FaceSwap output format: ${JSON.stringify(data)}`);
        return url;
      } catch (e: any) {
        if (e.name === 'AbortError') throw e;
        if (retries > 0) {
          retries--;
          await new Promise(r => setTimeout(r, 1000));
        } else {
          throw e;
        }
      }
    }
    throw new Error("FAL.AI FaceSwap failed after retries.");
  }
}
