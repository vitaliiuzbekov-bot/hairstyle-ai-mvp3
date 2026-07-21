const fs = require('fs');
let content = fs.readFileSync('src/server/routes/telegramExport.ts', 'utf8');

content = content.replace(
  /-filter_complex "\[0:v\]scale=720:960:force_original_aspect_ratio=increase,crop=720:960\[v0\];\[1:v\]scale=720:960:force_original_aspect_ratio=increase,crop=720:960\[v1\];\[v0\]\[v1\]xfade=transition=wiperight:duration=1\.5:offset=1\.0,format=yuv420p"/,
  `-filter_complex "[0:v]scale=720:960:force_original_aspect_ratio=increase,crop=720:960,fps=30[v0];[1:v]scale=720:960:force_original_aspect_ratio=increase,crop=720:960,fps=30[v1];[v0][v1]xfade=transition=wiperight:duration=1.5:offset=1.0,format=yuv420p"`
);

fs.writeFileSync('src/server/routes/telegramExport.ts', content);
