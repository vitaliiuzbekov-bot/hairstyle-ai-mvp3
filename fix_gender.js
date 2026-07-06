const fs = require('fs');

// Fix reference.ts
let refFile = fs.readFileSync('src/server/routes/reference.ts', 'utf8');
refFile = refFile.replace(
  'const isMale = lowerGender.includes("муж") || lowerGender.includes("male") || lowerGender.includes("man") || lowerGender.includes("пар");',
  `const isFemale = lowerGender === "female" || lowerGender.includes("жен") || lowerGender.includes("woman") || lowerGender.includes("girl") || lowerGender.includes("девушк") || lowerGender.includes("девочк");
    const isMale = !isFemale && (lowerGender.includes("муж") || lowerGender.includes("male") || lowerGender.includes("man") || lowerGender.includes("пар") || lowerGender.includes("boy"));`
);
fs.writeFileSync('src/server/routes/reference.ts', refFile);

// Fix generate.ts
let genFile = fs.readFileSync('src/server/routes/generate.ts', 'utf8');
genFile = genFile.replace(
  'const isMale = gender === "male" || gender === "Мужчина";',
  'const isMale = (gender || "").toLowerCase() === "male" || (gender || "").toLowerCase().includes("муж") || (gender || "").toLowerCase().includes("man") || (gender || "").toLowerCase().includes("boy");'
);
fs.writeFileSync('src/server/routes/generate.ts', genFile);

// Fix promptGenerator.ts
let promptFile = fs.readFileSync('src/server/utils/promptGenerator.ts', 'utf8');
// It currently has duplicate `const isFemale`
promptFile = promptFile.replace(/const isFemale = g === 'female' \|\| g\.includes\('жен'\) \|\| g\.includes\('woman'\) \|\| g\.includes\('girl'\) \|\| g\.includes\('девушк'\) \|\| g\.includes\('девочк'\);\n  const isMale = !isFemale && \(g === 'male' \|\| g\.includes\('муж'\) \|\| g\.includes\('man'\) \|\| g\.includes\('boy'\) \|\| g\.includes\('пар'\)\);\n  const isFemale = g === 'female' \|\| g\.includes\('жен'\) \|\| g\.includes\('woman'\) \|\| g\.includes\('girl'\);/g, `const isFemale = g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl') || g.includes('девушк') || g.includes('девочк');\n  const isMale = !isFemale && (g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy') || g.includes('пар'));`);
fs.writeFileSync('src/server/utils/promptGenerator.ts', promptFile);

console.log("Fixed!");
