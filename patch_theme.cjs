const fs = require('fs');
const file = 'src/hooks/useTelegram.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `        if (tg.colorScheme === 'light') {
          setIsLightMode(true);
        } else if (tg.colorScheme === 'dark') {
          setIsLightMode(false);
        }`,
  `        if (tg.colorScheme === 'light') {
          setIsLightMode(true);
          try {
             tg.setHeaderColor('#f8fafc');
             tg.setBackgroundColor('#f8fafc');
          } catch(e) {}
        } else if (tg.colorScheme === 'dark') {
          setIsLightMode(false);
          try {
             tg.setHeaderColor('#050508');
             tg.setBackgroundColor('#050508');
          } catch(e) {}
        }`
);

fs.writeFileSync(file, content);
console.log('patched useTelegram');
