const fs = require('fs');
let code = fs.readFileSync('src/context/UserContext.tsx', 'utf8');

const interfaceRegex = /  setUserId: \(val: string \| null\) => void;\n\}/;
const interfaceReplacement = `  setUserId: (val: string | null) => void;
  loadLastGeneration: () => Promise<any>;
}`;

code = code.replace(interfaceRegex, interfaceReplacement);

const providerRegex = /  useEffect\(\(\) => \{\n    const welcomeShown = localStorage\.getItem\("welcomeShown"\);/;
const providerReplacement = `  const loadLastGeneration = async () => {
    if (!userId) return null;
    try {
      const res = await fetch(\`/api/user/last-generation?userId=\${userId}\`);
      if (res.ok) {
        const data = await res.json();
        return data.result;
      }
    } catch(e) {
      console.error("loadLastGeneration error", e);
    }
    return null;
  };

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");`;

code = code.replace(providerRegex, providerReplacement);

const returnRegex = /        setUserId\n      \}\}/;
const returnReplacement = `        setUserId,
        loadLastGeneration
      }}`;
code = code.replace(returnRegex, returnReplacement);

fs.writeFileSync('src/context/UserContext.tsx', code);
console.log("Rewrote UserContext.tsx");
