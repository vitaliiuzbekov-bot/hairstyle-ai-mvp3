export interface AnalysisResult {
  warning?: string;
  gender: string;
  faceShape: string;
  hairLength?: string;
  hairDensity: string;
  hairType: string;
  hairlineStatus?: string;
  hairQuality?: string;
  skinTone?: string;
  skinDetails?: string;
  hairColor?: string;
  eyeColor?: string;
  ageRange?: string;
  facialFeatures?: string;
  facialHair?: string;
  clothingContext?: string;
  recommendations: Array<{
    name: string;
    description: string;
    stylingTips: string;
    imageKeyword: string;
    ru?: string;
  }>;
}
