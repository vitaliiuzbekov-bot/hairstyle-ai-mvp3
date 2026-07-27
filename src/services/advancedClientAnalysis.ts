import { getMulticlassSegmenter } from './mediapipeTasks';

export interface AdvancedAnalysis {
    hairColor: string | null;
    skinTone: string | null;
    hairLength: 'Короткие' | 'Средние' | 'Длинные' | 'Лысый' | 'Неизвестно';
}

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

function classifyColor(r: number, g: number, b: number, type: 'hair' | 'skin'): string {
    const brightness = (r + g + b) / 3;
    if (type === 'hair') {
        if (brightness < 40) return 'Черный / Очень темный';
        if (brightness < 80) return 'Темно-каштановый';
        if (brightness > 150 && r > g + 10 && g > b + 10) return 'Блонд / Светлый';
        if (r > g + 30 && r > 100 && b < 100) return 'Рыжий / Медный';
        if (brightness > 120) return 'Светло-русый';
        return 'Каштановый / Русый';
    } else {
        if (brightness > 180) return 'Очень светлый / Фарфоровый';
        if (brightness > 125) return 'Светлый / Бежевый';
        if (brightness > 85) return 'Средний / Оливковый';
        return 'Темный / Смуглый';
    }
}

export const analyzeFaceAndHairClientSide = async (imageElement: HTMLImageElement): Promise<AdvancedAnalysis> => {
    try {
        const segmenter = await getMulticlassSegmenter();
        const result = segmenter.segment(imageElement);
        
        if (!result || !result.categoryMask) {
            return { hairColor: null, skinTone: null, hairLength: 'Неизвестно' };
        }

        const mask = result.categoryMask.getAsUint8Array();
        const width = result.categoryMask.width;
        const height = result.categoryMask.height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("No canvas 2d context");
        
        ctx.drawImage(imageElement, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;

        // Collect pixels to calculate median instead of average (more robust to shadows/highlights)
        const hairPixels: {r: number, g: number, b: number, y: number}[] = [];
        const skinPixels: {r: number, g: number, b: number, y: number}[] = [];
        
        let lowestHairY = 0;
        let lowestFaceY = 0;
        let highestFaceY = height;

        for (let i = 0; i < mask.length; i++) {
            const category = mask[i];
            const y = Math.floor(i / width);
            const x = i % width;
            
            // Exclude edges to avoid background bleeding
            if (x < width * 0.1 || x > width * 0.9) continue;

            const r = imageData[i * 4];
            const g = imageData[i * 4 + 1];
            const b = imageData[i * 4 + 2];

            if (category === 1) { // 1 = Hair
                hairPixels.push({r, g, b, y});
                if (y > lowestHairY) lowestHairY = y;
            } else if (category === 3) { // 3 = Face Skin
                // For skin, we want to sample from the center of the face to avoid neck shadows
                if (y > height * 0.2 && y < height * 0.8) {
                   skinPixels.push({r, g, b, y});
                }
                if (y > lowestFaceY) lowestFaceY = y;
                if (y < highestFaceY) highestFaceY = y;
            }
        }

        let hairColorResult = null;
        let skinToneResult = null;
        let hairLength: AdvancedAnalysis['hairLength'] = 'Неизвестно';

        if (hairPixels.length > 0) {
            // Sort by brightness to get median
            hairPixels.sort((a, b) => (a.r+a.g+a.b) - (b.r+b.g+b.b));
            const mid = Math.floor(hairPixels.length / 2);
            const r = hairPixels[mid].r;
            const g = hairPixels[mid].g;
            const b = hairPixels[mid].b;
            
            hairColorResult = classifyColor(r, g, b, 'hair') + ` (${rgbToHex(r, g, b)})`;
            
            if (lowestFaceY > 0 && highestFaceY < height) {
                 const faceHeight = lowestFaceY - highestFaceY;
                 const diff = lowestHairY - lowestFaceY;
                 
                 // If hair goes lower than the chin by 15% of image height
                 if (diff > height * 0.15) {
                     hairLength = 'Длинные';
                 } else if (diff > 0) {
                     hairLength = 'Средние';
                 } else {
                     hairLength = 'Короткие';
                 }
            }
        } else {
            hairLength = 'Лысый';
        }

        if (skinPixels.length > 0) {
            skinPixels.sort((a, b) => (a.r+a.g+a.b) - (b.r+b.g+b.b));
            // Sample from the 60th percentile to avoid shadows
            const idx = Math.floor(skinPixels.length * 0.6);
            const r = skinPixels[idx].r;
            const g = skinPixels[idx].g;
            const b = skinPixels[idx].b;
            
            skinToneResult = classifyColor(r, g, b, 'skin') + ` (${rgbToHex(r, g, b)})`;
        }

        return {
            hairColor: hairColorResult,
            skinTone: skinToneResult,
            hairLength
        };

    } catch (error) {
        console.error("Advanced client analysis failed:", error);
        return { hairColor: null, skinTone: null, hairLength: 'Неизвестно' };
    }
};
