import axios from 'axios';
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
    const url = "https://fal.run/fal-ai/flux-pro/v1/image-to-image";

    while (retries >= 0) {
      try {
        const res = await imageGenQueue.add(() => axios.post(url, bodyPayload, {
          headers: {
            "Authorization": `Key ${this.falKey}`,
            "Content-Type": "application/json"
          }
        }));

        const data = res?.data;
        const resultUrl = data?.images?.[0]?.url || data?.image?.url || data?.url;
        if (!resultUrl) {
            throw new Error(`Fal.ai response conversion failed: ${JSON.stringify(data)}`);
        }
        return resultUrl;
      } catch (error: any) {
        if (error.name === 'AbortError') throw error;
        
        console.error(' [FalAdapter][Error] Failed invocation to Fal.run шлюз (Flux):');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Message: ${error.message}`);
        }
        
        if (retries > 0) {
          retries--;
          await new Promise(r => setTimeout(r, 1000));
        } else {
          throw new Error(`Fal.ai integration failed: ${error.response?.data?.detail || error.message}`);
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
    // Используем официальный queue эндпоинт по инструкции
    const url = "https://queue.fal.run/fal-ai/face-swap";

    while (retries >= 0) {
      try {
        // 1. Submit job
        const res = await imageGenQueue.add(() => axios.post(url, bodyPayload, {
          headers: {
            "Authorization": `Key ${this.falKey}`,
            "Content-Type": "application/json"
          }
        }));

        const data = res?.data;
        
        // 2. Опрашиваем статус (queue endpoint returns status_url)
        let resultUrl = data?.image?.url || data?.image_url || data?.url;
        
        if (!resultUrl && data?.status_url) {
            // Polling loop
            let attempts = 0;
            while (attempts < 30) {
                await new Promise(r => setTimeout(r, 2000));
                const statusRes = await axios.get(data.status_url, {
                    headers: { "Authorization": `Key ${this.falKey}` }
                });
                const statusData = statusRes.data;
                
                if (statusData.status === "COMPLETED") {
                    // Usually payload is in response_url, but fal often returns it directly in status if completed, 
                    // or we might need to get response_url
                    if (statusData.payload?.image?.url || statusData.payload?.image_url) {
                         resultUrl = statusData.payload.image?.url || statusData.payload.image_url;
                         break;
                    }
                    if (statusData.response_url) {
                        const finalRes = await axios.get(statusData.response_url, {
                             headers: { "Authorization": `Key ${this.falKey}` }
                        });
                        resultUrl = finalRes.data?.image?.url || finalRes.data?.image_url;
                        break;
                    }
                } else if (statusData.status === "FAILED") {
                    throw new Error(`Fal.ai task failed: ${statusData.error}`);
                }
                attempts++;
            }
        }
        
        if (!resultUrl) {
            throw new Error(`Fal.ai response conversion failed: ${JSON.stringify(data)}`);
        }
        return resultUrl;
      } catch (error: any) {
        if (error.name === 'AbortError') throw error;
        
        console.error(' [FalAdapter][Error] Failed invocation to Fal.run шлюз (FaceSwap):');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Message: ${error.message}`);
        }
        
        if (retries > 0) {
          retries--;
          await new Promise(r => setTimeout(r, 1000));
        } else {
          throw new Error(`Fal.ai integration failed: ${error.response?.data?.detail || error.message}`);
        }
      }
    }
    throw new Error("FAL.AI FaceSwap failed after retries.");
  }
}
