export interface SupportedVideoConfig {
  mimeType: string;
  extension: 'mp4' | 'webm';
}

export function getBestSupportedVideoCodec(): SupportedVideoConfig {
  const types: SupportedVideoConfig[] = [
    // Приоритет для iOS (Safari / WebKit)
    { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', extension: 'mp4' },
    { mimeType: 'video/mp4;codecs=avc1', extension: 'mp4' },
    { mimeType: 'video/mp4', extension: 'mp4' },
    // Приоритет для Android / Desktop (Chromium)
    { mimeType: 'video/webm;codecs=vp9,opus', extension: 'webm' },
    { mimeType: 'video/webm;codecs=vp8,opus', extension: 'webm' },
    { mimeType: 'video/webm', extension: 'webm' },
  ];

  for (const config of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(config.mimeType)) {
      return config;
    }
  }

  throw new Error('MediaRecorder или подходящий видеокодек не поддерживаются в данном браузере.');
}
