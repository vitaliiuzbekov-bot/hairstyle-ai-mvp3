const fs = require('fs');

let content = fs.readFileSync('src/data/haircutLibrary.ts', 'utf-8');

// Replace customImageUrl with imageKeyword
content = content.replace(/customImageUrl:\s*"https:\/\/picsum\.photos[^"]+",/g, (match) => {
    return `imageKeyword: "",`;
});

// For each item, generate a good keyword based on the name.
// Actually, it's easier to just do it via regex.
// Wait, we can just let LazyImage use `item.name` if keyword is empty.
// Let's just remove customImageUrl completely.

content = content.replace(/customImageUrl:\s*".*?",/g, "");

fs.writeFileSync('src/data/haircutLibrary.ts', content);
