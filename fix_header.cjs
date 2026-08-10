const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const target1 = `import { useNavigate } from "react-router-dom";`;
const replacement1 = `import { useNavigate } from "react-router-dom";
import { useToast } from "./Toast";`;

const target2 = `  const navigate = useNavigate();`;
const replacement2 = `  const navigate = useNavigate();
  const { addToast } = useToast();`;

const target3 = `onClick={() => setIsProMode(!isProMode)}`;
const replacement3 = `onClick={() => {
              const newMode = !isProMode;
              setIsProMode(newMode);
              if (newMode) {
                addToast("PRO-режим включен: расширенная аналитика, PDF-отчеты и заметки.", "info");
              }
            }}`;

if (code.includes(target1) && code.includes(target2) && code.includes(target3)) {
  code = code.replace(target1, replacement1);
  code = code.replace(target2, replacement2);
  code = code.replace(target3, replacement3);
  fs.writeFileSync('src/components/Header.tsx', code);
  console.log('Fixed Header');
} else {
  console.log('Target not found', { t1: code.includes(target1), t2: code.includes(target2), t3: code.includes(target3) });
}
