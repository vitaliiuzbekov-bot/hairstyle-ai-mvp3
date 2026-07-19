const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

const target = `  const handleFileUploadWrapper = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      originalHandleFileUpload(e, () => {
          setResults(null);
          setArGeneratedImageUrl({});
          setTryOnStyle(null);
      });
  }, [originalHandleFileUpload, setResults, setArGeneratedImageUrl, setTryOnStyle]);`;

const replacement = `  const handleFileUploadWrapper = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      originalHandleFileUpload(e, () => {
          setResults(null);
          setArGeneratedImageUrl({});
          setTryOnStyle(null);
          setVtonResultUrl(null);
          setIsTeaserResult(false);
          setVtonError(null);
      });
  }, [originalHandleFileUpload, setResults, setArGeneratedImageUrl, setTryOnStyle, setVtonResultUrl, setIsTeaserResult, setVtonError]);`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/HomePage.tsx', code.replace(target, replacement));
  console.log('Patched HomePage successfully');
} else {
  console.log('Target not found in HomePage');
}
