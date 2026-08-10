const fs = require('fs');
let code = fs.readFileSync('src/components/BarberBlueprintModal.tsx', 'utf8');

const target1 = `                exportToPDF(undefined, "neurostylist-guide.pdf", {`;
const replacement1 = `                exportToPDF(undefined, clientName ? \`neurostylist-guide-\${clientName}.pdf\` : "neurostylist-guide.pdf", {`;

if (code.includes(target1)) {
  code = code.replace(target1, replacement1);
  fs.writeFileSync('src/components/BarberBlueprintModal.tsx', code);
  console.log('Fixed BarberBlueprintModal PDF name');
} else {
  console.log('Target not found');
}
