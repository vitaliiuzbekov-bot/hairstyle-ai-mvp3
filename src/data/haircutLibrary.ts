export type HaircutCategory = "short" | "medium" | "long" | "creative";

export interface HaircutLibraryItem {
  name: string;
  description: string;
  stylingTips: string;
  category: HaircutCategory;
}

export const FEMALE_LIBRARY: HaircutLibraryItem[] = [
  // Short
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
  },
  {
    name: "Пикси (Pixie)",
    description: "Короткая элегантная женская стрижка. Открывает шею и подчеркивает скулы.",
        stylingTips: "Используйте текстурирующий спрей или легкую пасту для выделения прядей.",
    category: "short"
  },
  {
    name: "Бикси (Bixie)",
    description: "Смесь боба и пикси. Текстурная, слегка небрежная стрижка 90-х.",
        stylingTips: "Немного мусса на корни и сушка с диффузором.",
    category: "short"
  },
  {
    name: "Гарсон (Garcon)",
    description: "Ультракороткая стрижка 'под мальчика' с мягкими линиями.",
        stylingTips: "Гладкая укладка или легкая взъерошенность с помощью воска.",
    category: "short"
  },
  
  // Medium
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
  },
  {
    name: "Классический Боб",
    description: "Элегантное каре, прямые волосы с ровным срезом.",
        stylingTips: "Гладкая укладка феном и утюжком для зеркального блеска.",
    category: "medium"
  },
  {
    name: "Удлиненный боб (Lob)",
    description: "Универсальный боб длиной до ключиц.",
        stylingTips: "Легкие волны спреем с морской солью для пляжного эффекта.",
    category: "medium"
  },
  {
    name: "Wolf Cut (Волчица)",
    description: "Дерзкая стрижка с объемом на макушке и рваными концами.",
        stylingTips: "Текстурирующий спрей и сушка головой вниз для объема.",
    category: "medium"
  },
  {
    name: "Шэгги (Shag)",
    description: "Многослойная стрижка 70-х с рваной челкой и текстурой.",
        stylingTips: "Сушка естественным путем с кремом для вьющихся волос.",
    category: "medium"
  },

  // Long
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
  },
  {
    name: "Длинные с Curtain Bangs",
    description: "Длинные волосы со знаменитой челкой-шторкой.",
        stylingTips: "Уложите челку крупной круглой щеткой от лица.",
    category: "long"
  },
  {
    name: "Butterfly Cut",
    description: "Каскад с короткими слоями у лица, создающий эффект крыльев бабочки.",
        stylingTips: "Накрутка на крупную плойку или брашинг с фиксацией лаком.",
    category: "long"
  },
  {
    name: "Идеально прямые (Glass Hair)",
    description: "Длинные идеально прямые и гладкие волосы с блеском.",
        stylingTips: "Обильно термозащита, утюжок и жидкий шелк/масло на кончики.",
    category: "long"
  },

  // Creative
  {
    name: "Hime Cut",
    description: "Японская стрижка с прямыми длинными волосами и резким срезом у щек.",
        stylingTips: "Идеальное выпрямление утюжком, чтобы подчеркнуть геометрию.",
    category: "creative"
  },
  {
    name: "Маллет (Mullet)",
    description: "Короткие спереди и по бокам, длинные сзади. Современный ретро-стиль.",
        stylingTips: "Матовая глина для корней, чтобы создать легкую небрежность.",
    category: "creative"
  }
];

export const MALE_LIBRARY: HaircutLibraryItem[] = [
  // Short
  {
    name: "Buzz Cut (Под машинку)",
    description: "Очень короткая мужская стрижка. Акцент на черты лица.",
        stylingTips: "Не требует укладки. Можно добавить четкий контур (Line-up).",
    category: "short"
  },
  {
    name: "French Crop",
    description: "Короткая стрижка с текстурированной прямой или рваной челкой и фейдом.",
        stylingTips: "Используйте матовую пасту или пудру для прикорневого объема.",
    category: "short"
  },
  {
    name: "Edgar (Эдгар)",
    description: "Резкая прямая челка с высоким фейдом. Хит среди молодежи.",
        stylingTips: "Челка укладывается ровно вниз с легкой фиксацией.",
    category: "short"
  },
  {
    name: "Crew Cut",
    description: "Классическая короткая стрижка, немного длиннее спереди.",
        stylingTips: "Слегка зачесать переднюю часть наверх с помощью воска.",
    category: "short"
  },

  // Medium
  {
    name: "Pompadour (Помпадур)",
    description: "Классическая мужская стрижка с большим объемом надо лбом.",
        stylingTips: "Нужен сильный фен, брашинг и помада сильной фиксации.",
    category: "medium"
  },
  {
    name: "Quiff (Квифф)",
    description: "Повседневный вариант помпадура, более текстурный и небрежный.",
        stylingTips: "Высушить феном вверх, нанести матовую глину.",
    category: "medium"
  },
  {
    name: "Middle Part (Шторки)",
    description: "Волосы средней длины с прямым пробором. Стиль Леонардо Ди Каприо 90-х.",
        stylingTips: "Крем для укладки, чтобы волосы ложились мягкими волнами.",
    category: "medium"
  },
  {
    name: "Flow (Bro Flow)",
    description: "Расслабленные, зачесанные назад волосы средней длины.",
        stylingTips: "Легкий крем или солевой спрей. Не использовать жесткие гели.",
    category: "medium"
  },

  // Long
  {
    name: "Man Bun (Пучок)",
    description: "Длинные волосы, собранные на затылке или макушке.",
        stylingTips: "Собрать резинкой. Для андерката - сбрить виски (Top Knot).",
    category: "long"
  },
  {
    name: "Shoulder Length (До плеч)",
    description: "Естественные длинные волосы для гранж-стиля.",
        stylingTips: "Увлажняющий несмываемый кондиционер для борьбы с пушистостью.",
    category: "long"
  },

  // Creative
  {
    name: "Маллет (Modern Mullet)",
    description: "Короткие виски, объем сверху и удлиненный затылок.",
        stylingTips: "Текстурирующая пудра для максимальной небрежности.",
    category: "creative"
  },
  {
    name: "Burst Fade",
    description: "Фейд полукругом вокруг ушей, оставляющий объем на затылке.",
        stylingTips: "Можно сочетать с маллетом или V-образным затылком.",
    category: "creative"
  }
];

export const CATEGORY_LABELS = {
  short: "Короткие",
  medium: "Средние",
  long: "Длинные",
  creative: "Креатив"
};
