import sharp from 'sharp';

interface HairlineCoords {
  topCenter: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
  midForehead: { x: number; y: number };
}

export async function createHairMask(
  width: number,
  height: number,
  hairline: HairlineCoords
): Promise<Buffer> {
  const svgMask = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blendHair" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="white" />
        <stop offset="50%" stop-color="white" />
        <stop offset="75%" stop-color="gray" />
        <stop offset="100%" stop-color="black" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="white" />
    <ellipse
      cx="${hairline.midForehead.x}"
      cy="${hairline.midForehead.y + height * 0.25}"
      rx="${width * 0.22}"
      ry="${height * 0.3}"
      fill="black"
    />
  </svg>`;

  return sharp(Buffer.from(svgMask)).resize(width, height).png().toBuffer();
}
