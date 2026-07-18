export interface FluxOptions {
  prompt: string;
  imageUrl: string; // The base image to img2img
  strength: number;
}

export interface FaceSwapOptions {
  baseImageUrl: string;
  swapImageUrl: string;
}

export interface ImageGenerationProvider {
  generateBaseImage(options: FluxOptions): Promise<string>; // Returns URL of generated image
  swapFace(options: FaceSwapOptions): Promise<string>;      // Returns URL of swapped image
}
