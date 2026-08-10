#!/bin/bash
sed -i '/<button\s*onClick={() => {\s*if (results &&/,/<\/button>/d' src/components/HaircutList.tsx
sed -i '/<div className="flex flex-col gap-3 w-full sm:w-auto">/,/<\/div>/d' src/components/HaircutList.tsx
sed -i 's/<span>Свое фото<\/span>/<span>Своя стрижка (фото)<\/span>/g' src/components/HaircutList.tsx
sed -i 's/Библиотека стрижек/Каталог стрижек/g' src/components/HaircutList.tsx
