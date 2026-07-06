const fs = require('fs');
let file = '/app/applet/src/utils/pdfExport.ts';
let content = fs.readFileSync(file, 'utf8');

// Change onclone to only remove styles outside of our pdfContainer, or to replace oklch instead of removing.
const oldOnclone = `onclone: (clonedDoc: Document) => {
          // Remove all style and link tags in the cloned document's head
          // This prevents html2canvas from parsing Tailwind's oklch colors which cause crashes
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(s => s.remove());
        }`;

const newOnclone = `onclone: (clonedDoc: Document) => {
          // Keep our custom PDF styles, but remove/sanitize others that crash html2canvas
          const styles = clonedDoc.querySelectorAll('style');
          styles.forEach(s => {
             // If it's our injected PDF style, keep it
             if (s.innerHTML.includes('.pdf-page')) return;
             // Otherwise sanitize oklch
             if (s.innerHTML) {
                s.innerHTML = s.innerHTML.replace(/oklch\\([^)]+\\)/g, '#cbd5e1');
             }
          });
          const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
          links.forEach(l => l.remove());
        }`;

content = content.replace(oldOnclone, newOnclone);
fs.writeFileSync(file, content);
