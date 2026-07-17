const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add loadLastGeneration to useUser destruct
const useUserRegex = /    consentGiven, setConsentGiven,\n  \} = useUser\(\);/;
const useUserReplacement = `    consentGiven, setConsentGiven,
    loadLastGeneration
  } = useUser();`;
code = code.replace(useUserRegex, useUserReplacement);

// Add the useEffect for loadLastGeneration
const effectRegex = /  const \[resultImage, setResultImage\] = React\.useState<string \| null>\(null\);\n  useEffect\(\(\) => \{/;
const effectReplacement = `  const [resultImage, setResultImage] = React.useState<string | null>(null);

  useEffect(() => {
    if (userId && !resultImage && window.location.pathname === '/' && !window.location.hash.includes('image=')) {
      loadLastGeneration().then(lastGen => {
        if (lastGen && lastGen.url) {
          console.log("Loaded last generation from API:", lastGen.url);
          localStorage.setItem('lastResult', JSON.stringify({ 
             imageUrl: lastGen.url, 
             originalUrl: lastGen.originalUrl 
          }));
          setResultImage(lastGen.url);
        }
      });
    }
  }, [userId]);

  useEffect(() => {`;
code = code.replace(effectRegex, effectReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Rewrote App.tsx with loadLastGeneration effect");
