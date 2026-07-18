import { ImageGenerationProvider, FluxOptions, FaceSwapOptions } from "../ports/ImageGenerationProvider";
import { FalAdapter } from "../adapters/FalAdapter";

export class ImageGenerationService {
  private provider: ImageGenerationProvider;

  constructor(provider: ImageGenerationProvider) {
    this.provider = provider;
  }

  async generateBaseImage(options: FluxOptions): Promise<Buffer> {
    return this.provider.generateBaseImage(options);
  }

  async swapFace(options: FaceSwapOptions): Promise<Buffer> {
    return this.provider.swapFace(options);
  }
}

export const defaultImageService = new ImageGenerationService(new FalAdapter());
