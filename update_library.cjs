const fs = require('fs');

let content = fs.readFileSync('src/data/haircutLibrary.ts', 'utf-8');

// I will add a few more female haircuts to each category
const newFemaleShort = `
  {
    name: "Французский боб",
    description: "Короткий боб длиной до линии губ с легкой небрежной челкой. Очень романтичный стиль.",
    stylingTips: "Слегка подкрутить концы утюжком внутрь, добавить текстурирующий спрей.",
    category: "short"
  },
  {
    name: "Шорт-каскад",
    description: "Многослойная короткая стрижка, придающая максимальный объем тонким волосам.",
    stylingTips: "Сушка феном с брашингом небольшого диаметра, приподнимая корни.",
    category: "short"
  },`;

const newFemaleMedium = `
  {
    name: "Удлиненное каре с ровным срезом",
    description: "Стильная и строгая стрижка средней длины без челки. Подчеркивает густоту волос.",
    stylingTips: "Идеально выпрямить утюжком, использовать спрей-блеск.",
    category: "medium"
  },
  {
    name: "Аврора (Итальянка)",
    description: "Ступенчатая объемная стрижка с пышной шапочкой на макушке и удлиненными прядями снизу.",
    stylingTips: "Сушка вниз головой, легкий начес у корней.",
    category: "medium"
  },`;

const newFemaleLong = `
  {
    name: "Лисий хвост",
    description: "V-образный срез на длинных волосах. Отлично смотрится в распущенном виде.",
    stylingTips: "Завить концы на крупную плойку для подчеркивания формы.",
    category: "long"
  },
  {
    name: "Каскад с удлиненной челкой",
    description: "Плавный переход длины от челки к основным прядям. Подходит для любого типа лица.",
    stylingTips: "Использовать брашинг для создания мягких завитков от лица.",
    category: "long"
  },`;

content = content.replace('// Short', '// Short' + newFemaleShort);
content = content.replace('// Medium', '// Medium' + newFemaleMedium);
content = content.replace('// Long', '// Long' + newFemaleLong);

fs.writeFileSync('src/data/haircutLibrary.ts', content);
