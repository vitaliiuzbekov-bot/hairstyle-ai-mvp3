import * as fal from "@fal-ai/serverless-client";
import { ImageGenerationProvider, FluxOptions, FaceSwapOptions } from "../ports/ImageGenerationProvider";
import { imageGenQueue } from "../utils/queues";

export class FalAdapter implements ImageGenerationProvider {
  
  constructor() {
    // SDK автоматически подхватывает переменную окружения process.env.FAL_KEY
    if (!process.env.FAL_KEY) {
      throw new Error('[FalAdapter] Нарушена конфигурация среды: process.env.FAL_KEY не задан');
    }
  }

  private extractResultUrl(result: any): string | null {
    const possiblePaths = [
      result?.output?.images?.[0]?.url,
      result?.images?.[0]?.url,
      result?.image?.url,
      result?.url
    ];

    return possiblePaths.find(url => typeof url === 'string') || null;
  }

  private async downloadToBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[FalAdapter] Failed to download generated image from CDN: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async generateBaseImage(options: FluxOptions): Promise<Buffer> {
    try {
      const result = await imageGenQueue.add(() => fal.subscribe<any, any>("fal-ai/flux/dev/image-to-image", {
        input: {
          prompt: options.prompt,
          image_url: options.imageUrl,
          strength: options.strength,
          num_inference_steps: 20
        },
        mode: "streaming",
      }));

      const resultUrl = this.extractResultUrl(result);
      if (!resultUrl) {
        console.error("DEBUG: Fal SDK Response:", JSON.stringify(result, null, 2));
        throw new Error(`[FalAdapter] Не удалось найти URL изображения в ответе.`);
      }

      return await this.downloadToBuffer(resultUrl);
    } catch (error: any) {
      console.error('❌ [FalAdapter][SDK-Error] Сбой обработки на стороне Fal.ai Cloud GPU (Flux):');
      console.error(`- Сообщение ошибки: ${error.message}`);
      if (error.body) {
        console.error(`- Тело ответа провайдера: ${JSON.stringify(error.body)}`);
      }
      throw new Error(`Fal.ai integration failed via SDK: ${error.message}`);
    }
  }

  /**
   * Выполняет замену лица/прически через строго типизированный вызов SDK Fal
   */
  async swapFace(options: FaceSwapOptions): Promise<Buffer> {
    try {
      // ✅ ИСПОЛЬЗУЕМ ОФИЦИАЛЬНЫЙ SDK: Вызов синхронного шлюза fal.subscribe через очередь
      const result = await imageGenQueue.add(() => fal.subscribe<any, any>("fal-ai/face-swap", {
        input: {
          base_image_url: options.baseImageUrl,
          swap_image_url: options.swapImageUrl,
        },
        // Опционально: можно явно указать метод получения результата
        mode: "streaming", 
      }));

      const resultUrl = this.extractResultUrl(result);
      if (!resultUrl) {
        console.error("DEBUG: Fal SDK Response:", JSON.stringify(result, null, 2));
        throw new Error(`[FalAdapter] Не удалось найти URL изображения в ответе.`);
      }

      return await this.downloadToBuffer(resultUrl);
    } catch (error: any) {
      // Оборонительное программирование: изолируем и детально логируем сбои инфраструктуры
      console.error('❌ [FalAdapter][SDK-Error] Сбой обработки на стороне Fal.ai Cloud GPU:');
      console.error(`- Сообщение ошибки: ${error.message}`);
      if (error.body) {
        console.error(`- Тело ответа провайдера: ${JSON.stringify(error.body)}`);
      }
      
      // Пробрасываем ошибку на уровень бизнес-логики в понятном формате
      throw new Error(`Fal.ai integration failed via SDK: ${error.message}`);
    }
  }
}
