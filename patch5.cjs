const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

const target = `        vtonResultUrl,
        setVtonResultUrl,
        isTeaserResult,
        vtonError,`;

const replacement = `        vtonResultUrl,
        setVtonResultUrl,
        isTeaserResult,
        setIsTeaserResult,
        vtonError,`;

if (code.includes(target)) {
  fs.writeFileSync('src/hooks/useAnalysis.ts', code.replace(target, replacement));
  console.log('Patched useAnalysis return successfully');
} else {
  console.log('Target not found in useAnalysis return');
}
