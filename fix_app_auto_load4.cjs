const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The original file was:
//     if (img) {
//       console.log("Setting result image to:", img);
//       setResultImage(img);
//       localStorage.setItem('lastGeneratedImage', img);
//       if (orig) {
//          localStorage.setItem('lastOriginalImage', orig);
//       }
//       try {
//          localStorage.setItem('lastResult', JSON.stringify({ imageUrl: img, originalUrl: orig }));
//       } catch(e) {}
//     } catch(e) {}
//         }
//       }
//     }
//   }, []);
// 
// That looks broken. Let's rebuild that exact useEffect.

const regex = /useEffect\(\(\) => \{\s*const params = new URLSearchParams\(window\.location\.search\);[\s\S]*?\}, \[\]\);/g;

const newEffect = `useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let img = params.get('image') || params.get('imageUrl');
    let orig = params.get('originalUrl');
    
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
    }
  }, []);`;

code = code.replace(regex, newEffect);
fs.writeFileSync('src/App.tsx', code);
