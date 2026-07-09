const fs = require('fs');
const content = fs.readFileSync('src/components/RotatingFactsLoader.tsx', 'utf8');
const newContent = content.replace(
  /bg-blue-500 rounded-full blur-xl/g,
  'bg-purple-500 rounded-full blur-xl'
).replace(
  /from-blue-500 to-indigo-500/g,
  'from-purple-500 to-pink-500'
).replace(
  /text-blue-500/g,
  'text-purple-500'
).replace(
  /text-blue-400/g,
  'text-purple-400'
).replace(
  /text-blue-600/g,
  'text-purple-600'
).replace(
  /text-blue-200/g,
  'text-purple-200'
).replace(
  /text-blue-800/g,
  'text-purple-800'
).replace(
  /text-blue-900/g,
  'text-purple-900'
).replace(
  /bg-blue-50 /g, // Notice the space to not match 500
  'bg-purple-50 '
).replace(
  /border-blue-200/g,
  'border-purple-200'
).replace(
  /bg-blue-500\/10/g,
  'bg-purple-500/10'
).replace(
  /border-blue-500\/20/g,
  'border-purple-500/20'
);
fs.writeFileSync('src/components/RotatingFactsLoader.tsx', newContent);
