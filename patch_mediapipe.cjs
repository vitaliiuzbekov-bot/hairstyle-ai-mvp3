const fs = require('fs');
let content = fs.readFileSync('src/services/mediapipeTasks.ts', 'utf8');

content = content.replace(/import \{ FilesetResolver, FaceDetector, ImageSegmenter \} from '@mediapipe\/tasks-vision';\n/, '');

content = content.replace(/const vision = await FilesetResolver/g, `const { FilesetResolver, FaceDetector, ImageSegmenter } = await import('@mediapipe/tasks-vision');\n  const vision = await FilesetResolver`);

// Add type imports if needed. TypeScript won't complain if we just use them as types
content = `import type { FaceDetector as FaceDetectorType, ImageSegmenter as ImageSegmenterType } from '@mediapipe/tasks-vision';\n` + content;
content = content.replace(/let faceDetectorInstance: FaceDetector \| null/g, 'let faceDetectorInstance: FaceDetectorType | null');
content = content.replace(/let imageSegmenterInstance: ImageSegmenter \| null/g, 'let imageSegmenterInstance: ImageSegmenterType | null');
content = content.replace(/let multiclassSegmenterInstance: ImageSegmenter \| null/g, 'let multiclassSegmenterInstance: ImageSegmenterType | null');

fs.writeFileSync('src/services/mediapipeTasks.ts', content);
