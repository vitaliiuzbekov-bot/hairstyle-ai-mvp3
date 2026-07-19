const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

const target = `  const resetApp = () => {
    resetImageState();
    setResults(null);
    setArError(null);
    setArGeneratedImageUrl({});
  };`;

const replacement = `  const resetApp = () => {
    resetImageState();
    setResults(null);
    setArError(null);
    setArGeneratedImageUrl({});
    setTryOnStyle(null);
    setVtonResultUrl(null);
    setIsTeaserResult(false);
    setVtonError(null);
  };`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/HomePage.tsx', code.replace(target, replacement));
  console.log('Patched resetApp successfully');
} else {
  console.log('Target not found in resetApp');
}
