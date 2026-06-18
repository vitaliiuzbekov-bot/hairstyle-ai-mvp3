import sharp from 'sharp';

export interface HairParams {
  density: 'low' | 'medium' | 'high';
  texture: 'fine' | 'normal' | 'thick';
  curlType: 'straight' | 'wavy' | 'curly';
  currentLength: 'short' | 'medium' | 'long';
  isColored: boolean;
  promptSuffixRu: string;
  promptSuffixEn: string;
}

interface HairlineInput {
  topCenter: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
}

export async function analyzeHair(
  photoBuffer: Buffer,
  hairline: HairlineInput
): Promise<HairParams> {
  const metadata = await sharp(photoBuffer).metadata();
  const { width = 800, height = 800 } = metadata;

  const hairBottom = Math.max(
    hairline.topCenter.y, hairline.leftTemple.y, hairline.rightTemple.y
  );
  const hairLeft = Math.max(0, hairline.leftTemple.x - 40);
  const hairRight = Math.min(width, hairline.rightTemple.x + 40);
  const hairHeight = hairBottom;

  const hairRegion = await sharp(photoBuffer)
    .extract({
      left: Math.floor(hairLeft),
      top: 0,
      width: Math.floor(hairRight - hairLeft),
      height: Math.floor(hairHeight),
    })
    .grayscale()
    .raw()
    .toBuffer();

  const belowRegion = await sharp(photoBuffer)
    .extract({
      left: Math.floor(hairLeft),
      top: Math.floor(hairBottom),
      width: Math.floor(hairRight - hairLeft),
      height: Math.floor(height * 0.3),
    })
    .grayscale()
    .raw()
    .toBuffer();

  const density = analyzeDensity(hairRegion);
  const texture = analyzeTexture(hairRegion);
  const curlType = analyzeCurlType(hairRegion);
  const currentLength = analyzeLength(hairRegion, belowRegion);
  const isColored = false;

  return {
    density, texture, curlType, currentLength, isColored,
    promptSuffixRu: `${densityMap[density]}, ${textureMap[texture]}, ${curlMap[curlType]}, ${lengthMap[currentLength]}`,
    promptSuffixEn: `${density} density, ${texture} ${curlType} hair, ${currentLength} length`,
  };
}

export const densityMap = { low: 'Редкие', medium: 'Средней густоты', high: 'Густые' };
export const textureMap = { fine: 'Тонкие', normal: 'Нормальные', thick: 'Жесткие' };
export const curlMap = { straight: 'Прямые', wavy: 'Волнистые', curly: 'Кудрявые' };
export const lengthMap = { short: 'Короткие', medium: 'Средней длины', long: 'Длинные' };

function analyzeDensity(buffer: Buffer): 'low' | 'medium' | 'high' {
  let darkPixels = 0;
  const threshold = 75;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] < threshold) darkPixels++;
  }
  const ratio = darkPixels / buffer.length;
  if (ratio < 0.3) return 'low';
  if (ratio < 0.6) return 'medium';
  return 'high';
}

function analyzeTexture(buffer: Buffer): 'fine' | 'normal' | 'thick' {
  const mean = buffer.reduce((s, v) => s + v, 0) / buffer.length;
  const variance = buffer.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / buffer.length;
  if (variance < 800) return 'fine';
  if (variance < 2500) return 'normal';
  return 'thick';
}

function analyzeCurlType(buffer: Buffer): 'straight' | 'wavy' | 'curly' {
  let transitions = 0;
  for (let i = 0; i < buffer.length - 1; i++) {
    if (Math.abs(buffer[i] - buffer[i + 1]) > 30) transitions++;
  }
  const rate = transitions / buffer.length;
  if (rate < 0.08) return 'straight';
  if (rate < 0.2) return 'wavy';
  return 'curly';
}

function analyzeLength(hairRegion: Buffer, belowRegion: Buffer): 'short' | 'medium' | 'long' {
  let darkBelow = 0;
  for (let i = 0; i < belowRegion.length; i++) {
    if (belowRegion[i] < 80) darkBelow++;
  }
  const ratio = darkBelow / belowRegion.length;
  if (ratio < 0.05) return 'short';
  if (ratio < 0.2) return 'medium';
  return 'long';
}
