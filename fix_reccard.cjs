const fs = require('fs');

let content = fs.readFileSync('src/components/RecommendationCard.tsx', 'utf-8');

// Add autoLoad={true} to LazyImage
content = content.replace(/<LazyImage([^>]+)results=\{results\}/, '<LazyImage$1results={results}\n                  autoLoad={true}');

fs.writeFileSync('src/components/RecommendationCard.tsx', content);
