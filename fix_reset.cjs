const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

code = code.replace(
`  const resetApp = () => {
    resetImageState();
    setResults(null);
    setArError(null);
    setArGeneratedImageUrl({});
    setTryOnStyle(null);
    setVtonResultUrl(null);
    setIsTeaserResult(false);
    setVtonError(null);
  };`,
`  const resetApp = () => {
    resetImageState();
    setResults(null);
    setArError(null);
    setArGeneratedImageUrl({});
    setTryOnStyle(null);
    setVtonResultUrl(null);
    setIsTeaserResult(false);
    setVtonError(null);
    localStorage.removeItem('lastGeneratedImage');
    localStorage.removeItem('lastOriginalImage');
    localStorage.removeItem('lastStyleName');
    localStorage.removeItem('lastMimeType');
  };`
);

fs.writeFileSync('src/components/HomePage.tsx', code);
