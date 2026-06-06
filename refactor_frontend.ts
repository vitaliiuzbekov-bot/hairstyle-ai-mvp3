import fs from "fs";

let appCode = fs.readFileSync("src/App.tsx", "utf-8");

const importLine = `import { useImageProcessor } from "./hooks/useImageProcessor";\n`;
appCode = importLine + appCode;

const hookInstantiation = `
  const { processImage, isProcessing: isCompressing, error: compressError } = useImageProcessor();
`;

// Insert the hook inside App component
const appCompIndex = appCode.indexOf("export default function App() {");
const insertIndex = appCode.indexOf("\n", appCompIndex) + 1;
appCode = appCode.substring(0, insertIndex) + hookInstantiation + appCode.substring(insertIndex);

// Rewrite handleFileUpload
const handleStartStr = `const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {`;
const handleEndStr = `reader.readAsDataURL(file);\n  };`;

const handleStartIndex = appCode.indexOf(handleStartStr);
const handleEndIndex = appCode.indexOf(handleEndStr, handleStartIndex) + handleEndStr.length;

if (handleStartIndex > -1 && handleEndIndex > -1) {
    const newHandleFileUpload = `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResults(null);
    setArGeneratedImageUrl({});
    setTryOnStyle(null);
    setImageUrl(null);

    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, загрузите изображение (JPEG, PNG).");
      return;
    }

    setMimeType("image/jpeg");
    setIsUploadingImage(true);
    
    try {
        const b64 = await processImage(file);
        setImageBase64(b64);
        setIsUploadingImage(false);
        setImageUrl(null);
    } catch(err: any) {
        setIsUploadingImage(false);
        setError(compressError || err.message || "Ошибка обработки");
    }
  };`;
    appCode = appCode.substring(0, handleStartIndex) + newHandleFileUpload + appCode.substring(handleEndIndex);
}

fs.writeFileSync("src/App.tsx", appCode);
console.log("Refactored handleFileUpload.");
