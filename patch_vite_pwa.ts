import fs from 'fs';

// Remove from package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (pkg.devDependencies && pkg.devDependencies['vite-plugin-pwa']) {
    delete pkg.devDependencies['vite-plugin-pwa'];
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log("Removed vite-plugin-pwa from package.json");
}

// Remove from vite.config.ts
let vite = fs.readFileSync('vite.config.ts', 'utf8');
vite = vite.replace(/import\s*{\s*VitePWA\s*}\s*from\s*['"]vite-plugin-pwa['"];?/g, '');

const pwaRegex = /VitePWA\(\s*\{[\s\S]*?\}\s*\)(?:,)?/g;
vite = vite.replace(pwaRegex, '');

fs.writeFileSync('vite.config.ts', vite);
console.log("Removed VitePWA from vite.config.ts");
