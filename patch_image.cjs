const fs = require('fs');
let content = fs.readFileSync('src/components/ImageEditorModal.tsx', 'utf8');

const target = `  useEffect(() => {
    if (!isOpen) {
      setBrightness(100);
      setContrast(100);
      setRemoveBg(false);
      setFaceDetected(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      imageRef.current = img;
      await runFaceDetection(img);
      drawCanvas();
    };
    img.src = originalBase64.startsWith('data:') ? originalBase64 : \`data:\${mimeType || 'image/jpeg'};base64,\${originalBase64}\`;
  }, [isOpen, originalBase64]);

  useEffect(() => {
    if (isOpen && imageRef.current) {
      drawCanvas();
    }
  }, [isOpen, brightness, contrast]);

  const runFaceDetection = async (img: HTMLImageElement) => {
  useModalBackButton(isOpen, onClose);
    try {`;

const replacement = `  useModalBackButton(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) {
      setBrightness(100);
      setContrast(100);
      setRemoveBg(false);
      setFaceDetected(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      imageRef.current = img;
      drawCanvas();
      await runFaceDetection(img);
    };
    img.src = originalBase64.startsWith('data:') ? originalBase64 : \`data:\${mimeType || 'image/jpeg'};base64,\${originalBase64}\`;
  }, [isOpen, originalBase64]);

  useEffect(() => {
    if (isOpen && imageRef.current) {
      drawCanvas();
    }
  }, [isOpen, brightness, contrast]);

  const runFaceDetection = async (img: HTMLImageElement) => {
    try {`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ImageEditorModal.tsx', content);
console.log("Patched ImageEditorModal");
