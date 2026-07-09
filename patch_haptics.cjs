const fs = require('fs');

function patchFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  if (!content.includes('hapticImpact')) {
    // Add import
    content = content.replace(/import React/, 'import { hapticImpact } from "../utils/haptics";\nimport React');
    
    // Replace onClick with onClick combined with hapticImpact
    // This is tricky using regex, I'll use a few simple targeted replaces
    
    content = content.replace(/onClick=\{resetApp\}/g, "onClick={(e) => { hapticImpact('light'); resetApp(); }}");
    content = content.replace(/onClick=\{\(\) => navigate\('\/faq'\)\}/g, "onClick={() => { hapticImpact('light'); navigate('/faq'); }}");
    content = content.replace(/onClick=\{analyzeImage\}/g, "onClick={() => { hapticImpact('medium'); analyzeImage(); }}");
    content = content.replace(/onClick=\{\(\) => setPreferredStyle\(styleOpt\)\}/g, "onClick={() => { hapticImpact('light'); setPreferredStyle(styleOpt); }}");
    
    fs.writeFileSync(filepath, content);
  }
}

patchFile('src/components/UploadZone.tsx');
