const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  useEffect\(\(\) => \{\n    const params = new URLSearchParams\(window\.location\.search\);\n    const img = params\.get\('image'\);\n    console\.log\("App mounted\. Window location:", window\.location\.href\);\n    console\.log\("Search params:", window\.location\.search\);\n    console\.log\("Image param:", img\);\n    \n    \/\/ Also try to extract from hash if telegram messed it up\n    let imgFromHash = null;\n    if \(window\.location\.hash\.includes\('image='\)\) \{\n        const hashParams = new URLSearchParams\(window\.location\.hash\.split\('\?'\)\[1\] || window\.location\.hash\.replace\('#\/', ''\)\.replace\('#', ''\)\);\n        imgFromHash = hashParams\.get\('image'\);\n        console\.log\("Image from hash:", imgFromHash\);\n    \}\n    \n    const finalImg = img || imgFromHash;\n    if \(finalImg\) \{\n      console\.log\("Setting result image to:", finalImg\);\n      setResultImage\(finalImg\);\n      \/\/ We will show a toast in HomePage instead\n    \} else \{/;

const replacement = `  useEffect(() => {
    try {
      const saved = localStorage.getItem('lastResult');
      if (saved) {
        const data = JSON.parse(saved);
        // Передаём результат в контекст или через событие
        window.dispatchEvent(new CustomEvent('showGenerationResult', { detail: data }));
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let img = params.get('image') || params.get('imageUrl');
    let orig = params.get('originalUrl');
    
    // Also try to extract from hash if telegram messed it up
    if (window.location.hash.includes('image=') || window.location.hash.includes('imageUrl=')) {
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.hash.replace('#/', '').replace('#', ''));
        img = img || hashParams.get('image') || hashParams.get('imageUrl');
        orig = orig || hashParams.get('originalUrl');
    }
    
    if (img) {
      setResultImage(img);
      localStorage.setItem('lastGeneratedImage', img);
      if (orig) {
         localStorage.setItem('lastOriginalImage', orig);
      }
      try {
         localStorage.setItem('lastResult', JSON.stringify({ imageUrl: img, originalUrl: orig }));
      } catch(e) {}
    } else {`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Rewrote App.tsx");
