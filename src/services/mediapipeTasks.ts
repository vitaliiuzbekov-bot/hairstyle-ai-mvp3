import { FilesetResolver, FaceDetector, ImageSegmenter } from '@mediapipe/tasks-vision';

let faceDetectorInstance: FaceDetector | null = null;
let imageSegmenterInstance: ImageSegmenter | null = null;

export const getFaceDetector = async () => {
  if (faceDetectorInstance) return faceDetectorInstance;
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  faceDetectorInstance = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
      delegate: "GPU"
    },
    runningMode: "IMAGE"
  });
  return faceDetectorInstance;
};

let multiclassSegmenterInstance: ImageSegmenter | null = null;

export const getMulticlassSegmenter = async () => {
  if (multiclassSegmenterInstance) return multiclassSegmenterInstance;
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  multiclassSegmenterInstance = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
      delegate: "GPU"
    },
    runningMode: "IMAGE",
    outputCategoryMask: true,
    outputConfidenceMasks: false
  });
  return multiclassSegmenterInstance;
};

export const getImageSegmenter = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  imageSegmenterInstance = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
      delegate: "GPU"
    },
    runningMode: "IMAGE",
    outputCategoryMask: true,
    outputConfidenceMasks: false
  });
  return imageSegmenterInstance;
};
