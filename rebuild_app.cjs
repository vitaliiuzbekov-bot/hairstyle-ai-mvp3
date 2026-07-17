const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert the URL parameter extraction and local storage reading inside the component
const componentStart = /  const \[isFeedbackOpen, setIsFeedbackOpen\] = React\.useState\(false\);/;
const replacement = `  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);

  const [resultImage, setResultImage] = React.useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lastGenerationResult') || localStorage.getItem('lastResult');
      if (saved) {
        const data = JSON.parse(saved);
        window.dispatchEvent(new CustomEvent('showGenerationResult', { detail: data }));
      }
    } catch(e) {}
  }, []);

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
      console.log("Setting result image to:", img);
      setResultImage(img);
      localStorage.setItem('lastGeneratedImage', img);
      if (orig) {
         localStorage.setItem('lastOriginalImage', orig);
      }
      try {
         localStorage.setItem('lastResult', JSON.stringify({ imageUrl: img, originalUrl: orig }));
      } catch(e) {}
    } else {
      const saved = localStorage.getItem('lastGeneratedImage');
      if (saved) {
        console.log("Setting result image from lastGeneratedImage:", saved);
        setResultImage(saved);
      } else {
        const lastResultStr = localStorage.getItem('lastResult');
        if (lastResultStr) {
          try {
            const lastResult = JSON.parse(lastResultStr);
            if (lastResult.imageUrl) {
              console.log("Setting result image from localStorage:", lastResult.imageUrl);
              setResultImage(lastResult.imageUrl);
            }
          } catch(e) {}
        }
      }
    }
  }, []);`;

code = code.replace(componentStart, replacement);

const returnStatement = /    <div className="relative min-h-screen/g;
const returnReplacement = `      resultImage={resultImage}
    <div className="relative min-h-screen`;

// Add resultImage prop to HomePage
const homePageRegex = /<HomePage/;
const homePageReplacement = `<HomePage resultImage={resultImage}`;
code = code.replace(homePageRegex, homePageReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Rebuilt App.tsx");
