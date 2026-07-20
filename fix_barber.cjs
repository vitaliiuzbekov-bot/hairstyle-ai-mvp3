const fs = require('fs');
let code = fs.readFileSync('src/components/BarberBlueprintModal.tsx', 'utf8');

code = code.replace(
`  React.useEffect(() => {
  }, [tryOnStyle]);`,
`  React.useEffect(() => {
    if (!tryOnStyle) {
      setLoadedReferenceUrl(null);
    }
  }, [tryOnStyle]);`
);

fs.writeFileSync('src/components/BarberBlueprintModal.tsx', code);
