const fs = require('fs');
let content = fs.readFileSync('src/server/routes/analysis.ts', 'utf8');

const target = `5. ТРЕБОВАНИЕ К 'imageKeyword' (ДЛЯ ОПТИМАЛЬНОЙ ГЕНЕРАЦИИ РЕФЕРЕНСОВ):
   - 'imageKeyword' должен быть детальным набором ключевых слов НА АНГЛИЙСКОМ через запятую.
   - Он должен сочетать название стрижки, ее текстуру, правильный возраст и пол, густоту, чтобы результат генерации точно наложился за счет правильного референса.
   - КРИТИЧНО ДЛЯ ГЕНЕРАЦИИ: Чтобы нейросети не раздували прически до абсурда, добавляй в imageKeyword жесткие ограничения объема: "absolutely no puffy hair, strictly flat lying top, realistic natural fall, zero artificial volume".
   - Например: "neat gentleman clean side part haircut, low taper fade, absolutely no puffiness, flat hair, 40 years old man classic business executive hair model, high-quality studio portrait".
   - Избегай банального названия "Fade". Всегда пиши конкретную стрижку, возраст, пол и структуру волос.`;

const replacement = `5. ТРЕБОВАНИЕ К ВЫБОРУ ИЗ БИБЛИОТЕКИ И 'imageKeyword' (КРИТИЧЕСКИ ВАЖНО):
   - Твоя ГЛАВНАЯ задача — выбрать 3 стрижки СТРОГО из стандартной библиотеки (названия должны совпадать буква в букву с популярными стрижками, например "Пикси (Pixie)", "Андеркат (Женский)", "Слик бэк (Slick Back)", "Кроп (Crop)" и т.д.).
   - Поле 'name' в JSON должно содержать короткое точное название стрижки из библиотеки (например, "Кроп (Crop)").
   - 'imageKeyword' должен быть в точности равен 'name' (например, "Кроп (Crop)"). НЕ ДОБАВЛЯЙ НИКАКИХ АНГЛИЙСКИХ КЛЮЧЕЙ В imageKeyword, ТОЛЬКО НАЗВАНИЕ СТРИЖКИ ИЗ БИБЛИОТЕКИ! Это обеспечит использование бесплатных готовых фото из нашей библиотеки.`;

if(content.includes("5. ТРЕБОВАНИЕ К 'imageKeyword'")) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/server/routes/analysis.ts', content);
    console.log("Patched successfully");
} else {
    console.log("Could not find target");
}
