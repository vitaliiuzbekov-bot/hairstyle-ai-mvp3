import type { FaceDetector as FaceDetectorType, ImageSegmenter as ImageSegmenterType } from '@mediapipe/tasks-vision';

let faceDetectorInstance: FaceDetectorType | null = null;
let imageSegmenterInstance: ImageSegmenterType | null = null;

export const getFaceDetector = async () => {
  if (faceDetectorInstance) return faceDetectorInstance;
  const { FilesetResolver, FaceDetector, ImageSegmenter } = await import('@mediapipe/tasks-vision');
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  faceDetectorInstance = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
      delegate: "CPU"
    },
    runningMode: "IMAGE"
  });
  return faceDetectorInstance;
};

let multiclassSegmenterInstance: ImageSegmenterType | null = null;

export const getMulticlassSegmenter = async () => {
  if (multiclassSegmenterInstance) return multiclassSegmenterInstance;
  const { FilesetResolver, FaceDetector, ImageSegmenter } = await import('@mediapipe/tasks-vision');
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  multiclassSegmenterInstance = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
      delegate: "CPU"
    },
    runningMode: "IMAGE",
    outputCategoryMask: true,
    outputConfidenceMasks: true
  });
  return multiclassSegmenterInstance;
};

export const getImageSegmenter = async () => {
  if (imageSegmenterInstance) return imageSegmenterInstance;
  const { FilesetResolver, FaceDetector, ImageSegmenter } = await import('@mediapipe/tasks-vision');
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  imageSegmenterInstance = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
      delegate: "CPU"
    },
    runningMode: "IMAGE",
    outputCategoryMask: true,
    outputConfidenceMasks: false
  });
  return imageSegmenterInstance;
};
