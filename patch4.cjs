const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

const target = `      setVtonResultUrl,
      isTeaserResult,
      vtonError,`;

const replacement = `      setVtonResultUrl,
      isTeaserResult,
      setIsTeaserResult,
      vtonError,`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/HomePage.tsx', code.replace(target, replacement));
  console.log('Patched HomePage destructuring successfully');
} else {
  console.log('Target not found in HomePage destructuring');
}
