const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /    consentGiven, setConsentGiven,\n  \} = useUser\(\);/;
const replacement = `    consentGiven, setConsentGiven,
    loadLastGeneration
  } = useUser();`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed App.tsx");
