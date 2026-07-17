const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `    const img = params.get('image');
    if (img) {
      setResultImage(img);
    }`,
  `    const img = params.get('image');
    console.log("App mounted. Window location:", window.location.href);
    console.log("Search params:", window.location.search);
    console.log("Image param:", img);
    
    // Also try to extract from hash if telegram messed it up
    let imgFromHash = null;
    if (window.location.hash.includes('image=')) {
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.hash.replace('#/', '').replace('#', ''));
        imgFromHash = hashParams.get('image');
        console.log("Image from hash:", imgFromHash);
    }
    
    const finalImg = img || imgFromHash;
    if (finalImg) {
      console.log("Setting result image to:", finalImg);
      setResultImage(finalImg);
    }`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Added logs to App.tsx");
