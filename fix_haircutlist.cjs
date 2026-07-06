const fs = require('fs');

let content = fs.readFileSync('src/components/HaircutList.tsx', 'utf-8');

// Replace item.customImageUrl usage when passing to selected library item
content = content.replace(/customImageUrl: item\.customImageUrl,/g, 'customImageUrl: "",');

// Replace the <img ... /> block
const imgRegex = /<img\s+src=\{item\.customImageUrl \|\| undefined\}\s+alt=\{item\.name\}\s+loading=\{idx < 4 \? undefined : "lazy"\}\s+fetchPriority=\{idx < 4 \? "high" : "auto"\}\s+className="absolute inset-0 w-full h-full object-cover rounded-xl"\s+\/>/;

const lazyImageBlock = `                        <div className="absolute inset-0 w-full h-full object-cover rounded-xl overflow-hidden">
                          <LazyImage
                            keyword={item.name}
                            gender={results?.gender || ""}
                            uniqueName={item.name}
                            description={item.description}
                            results={results || undefined}
                            autoLoad={false}
                          />
                        </div>`;

content = content.replace(imgRegex, lazyImageBlock);

fs.writeFileSync('src/components/HaircutList.tsx', content);
