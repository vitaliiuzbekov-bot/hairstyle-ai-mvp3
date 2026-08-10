const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace('import { useToast } from "./Toast";', 'import { useUI } from "../context/UIContext";');
code = code.replace('const { addToast } = useToast();', 'const { addToast } = useUI();');

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed Header imports');
