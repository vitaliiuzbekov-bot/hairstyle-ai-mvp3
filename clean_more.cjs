const fs = require('fs');

// BarberBlueprintModal
let bb = fs.readFileSync('src/components/BarberBlueprintModal.tsx', 'utf8');
bb = bb.replace(/              setCustomHairColor=\{setCustomHairColor\}\n/g, '');
fs.writeFileSync('src/components/BarberBlueprintModal.tsx', bb);

// AnalysisContext
let ac = fs.readFileSync('src/context/AnalysisContext.tsx', 'utf8');
ac = ac.replace(/  setCustomHairColor: \(val: string \| null\) => void;\n/g, '');
ac = ac.replace(/    setCustomHairColor\(null\);\n/g, '');
fs.writeFileSync('src/context/AnalysisContext.tsx', ac);

// useAnalysis
let ua = fs.readFileSync('src/hooks/useAnalysis.ts', 'utf8');
ua = ua.replace(/        setCustomHairColor,\n/g, '');
fs.writeFileSync('src/hooks/useAnalysis.ts', ua);

// promptGenerator
let pg = fs.readFileSync('src/server/utils/promptGenerator.ts', 'utf8');
pg = pg.replace(/  if \(false\) \{\n    colorStr = customHairColor;\n  \} else if \(hairColor\) \{\n    colorStr = hairColor;\n  \}\n/g, '  if (hairColor) {\n    colorStr = hairColor;\n  }\n');
fs.writeFileSync('src/server/utils/promptGenerator.ts', pg);

