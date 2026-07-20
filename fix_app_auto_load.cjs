const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We want to remove the block that auto-loads last generation
// Because if the user opens the app normally, it shouldn't jump to the result page.
// The result page should ONLY open if there is a query param (from Telegram bot notification)
// or from history.

code = code.replace(
`  useEffect(() => {
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
  }, [userId]);`,
`  // Auto-loading last generation on startup was removed because it forces the user
  // to the result page every time they open the app from the menu.`
);

fs.writeFileSync('src/App.tsx', code);
