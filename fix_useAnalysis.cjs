const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');

code = code.replace(/useState<AnalysisResult \| null>\(\(\) => \{[\s\S]*?return cached \? JSON\.parse\(cached\) : null;[\s\S]*?\}\)/, 'useState<AnalysisResult | null>(null)');
code = code.replace(/useState<string \| null>\(\(\) => \{[\s\S]*?return localStorage\.getItem\("persistent_teaserUrl"\) \|\| null;[\s\S]*?\}\)/, 'useState<string | null>(null)');

fs.writeFileSync('src/hooks/useAnalysis.ts', code);
console.log('Fixed useAnalysis');
