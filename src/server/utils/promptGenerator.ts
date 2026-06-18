export function getDemographicDescriptorRu(gender: string, ageRange: string): string {
  const g = (gender || '').toLowerCase().trim();
  const isMale = g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy');
  const isFemale = g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl');
  
  const age = (ageRange || '').toLowerCase().trim();
  
  if (age.includes("child") || age.includes("kid") || age.includes("rebenok") || age.includes("ребенок") || age.includes("дет") || age.includes("мальчик") || age.includes("девочка")) {
    return isMale ? "мальчик" : (isFemale ? "девочка" : "ребенок");
  }
  
  let ageLabel = "";
  if (age.includes("teen") || age.includes("podrostok") || age.includes("подросток") || age.includes("молод") || age.includes("youth") || age.includes("15-18")) {
    ageLabel = "подросток";
  } else if (age.includes("old") || age.includes("senior") || age.includes("elderly") || age.includes("grand") || age.includes("пожил") || age.includes("стар") || age.includes("бабушк") || age.includes("дедушк")) {
    ageLabel = "пожилой";
  } else if (age.includes("middle") || age.includes("зрел") || age.includes("middle-aged") || age.includes("mature")) {
    ageLabel = "средних лет";
  } else {
    const numbers = age.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const avgAge = numbers.reduce((acc, n) => acc + parseInt(n, 10), 0) / numbers.length;
      if (avgAge < 12) {
        return isMale ? "мальчик" : (isFemale ? "девочка" : "ребенок");
      } else if (avgAge >= 12 && avgAge < 20) {
        ageLabel = "подросток";
      } else if (avgAge >= 20 && avgAge < 35) {
        ageLabel = "молодой";
      } else if (avgAge >= 35 && avgAge < 55) {
        ageLabel = "средних лет";
      } else if (avgAge >= 55) {
        ageLabel = "пожилой";
      }
    }
  }
  
  if (isMale) {
    if (ageLabel === "подросток") return "юноша-подросток";
    if (ageLabel === "молодой") return "молодой мужчина";
    if (ageLabel === "средних лет") return "мужчина средних лет";
    if (ageLabel === "пожилой") return "пожилой мужчина";
    return "мужчина";
  } else if (isFemale) {
    if (ageLabel === "подросток") return "девушка-подросток";
    if (ageLabel === "молодой") return "молодая женщина";
    if (ageLabel === "средних лет") return "женщина средних лет";
    if (ageLabel === "пожилой") return "пожилая женщина";
    return "женщина";
  }
  
  if (ageLabel) return `${ageLabel} человек`;
  return "человек";
}

export function getDemographicDescriptor(gender: string, ageRange: string): string {
  const g = (gender || '').toLowerCase().trim();
  const isMale = g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy');
  const isFemale = g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl');
  
  const age = (ageRange || '').toLowerCase().trim();
  
  if (age.includes("child") || age.includes("kid") || age.includes("rebenok") || age.includes("ребенок") || age.includes("дет") || age.includes("мальчик") || age.includes("девочка")) {
    return isMale ? "young boy" : (isFemale ? "young girl" : "child");
  }
  
  let ageLabel = "";
  let ageNum = 0;
  const numbers = age.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    const avgAge = numbers.reduce((acc, n) => acc + parseInt(n, 10), 0) / numbers.length;
    ageNum = Math.round(avgAge);
  }

  if (age.includes("teen") || age.includes("podrostok") || age.includes("подросток") || age.includes("молод") || age.includes("youth") || age.includes("15-18") || (ageNum >= 11 && ageNum <= 20)) {
    ageLabel = "teenage";
  } else if (age.includes("old") || age.includes("senior") || age.includes("elderly") || age.includes("grand") || age.includes("пожил") || age.includes("стар") || age.includes("бабушк") || age.includes("дедушк") || (ageNum >= 60)) {
    ageLabel = "elderly";
  } else if (age.includes("middle") || age.includes("зрел") || age.includes("middle-aged") || age.includes("mature") || (ageNum >= 35)) {
    ageLabel = "middle-aged";
  } else if (ageNum > 0 && ageNum < 35) {
    ageLabel = "young";
  }
  
  if (isMale) {
    if (ageLabel === "teenage") return ageNum ? `${ageNum}-year-old teenage boy` : "teenage boy";
    if (ageLabel === "young") return ageNum ? `${ageNum}-year-old guy` : "young man";
    if (ageLabel === "middle-aged") return ageNum ? `realistic ${ageNum}-year-old mature middle-aged man` : "middle-aged man";
    if (ageLabel === "elderly") return ageNum ? `realistic ${ageNum}-year-old elderly man` : "elderly man";
    return "man";
  } else if (isFemale) {
    if (ageLabel === "teenage") return ageNum ? `${ageNum}-year-old teenage girl` : "teenage girl";
    if (ageLabel === "young") return ageNum ? `${ageNum}-year-old young woman` : "young woman";
    if (ageLabel === "middle-aged") return ageNum ? `realistic ${ageNum}-year-old mature middle-aged woman` : "middle-aged woman";
    if (ageLabel === "elderly") return ageNum ? `realistic ${ageNum}-year-old elderly woman` : "elderly woman";
    return "woman";
  }
  
  return ageNum ? `realistic ${ageNum}-year-old person` : "person";
}

export function translateHairlineStatusToEng(hairlineStatus: string, selectedStyleKeyword?: string): string {
  if (!hairlineStatus) return "";
  const hl = hairlineStatus.toLowerCase();
  
  // If the haircut selected is a shaved head / bald look
  const style = (selectedStyleKeyword || "").toLowerCase();
  const isBaldStyle = style.includes("bald") || style.includes("shave") || style.includes("лыс") || style.includes("брит");
  
  if (hl.includes("лыс") || hl.includes("лысина") || hl.includes("bald") || hl.includes("shaved head") || isBaldStyle) {
    return "clean shaved head, neat smooth scalp style. ";
  }
  
  // For other styles, we want to adapt naturally
  let eng = "";
  if (hl.includes("залысин") || hl.includes("височн") || hl.includes("m-shape") || hl.includes("thinning") || hl.includes("receding")) {
    // If it's a style with fringe or crop that covers forehead, describe it as neat.
    if (style.includes("crop") || style.includes("caesar") || style.includes("fringe")) {
      eng += "neat forward-swept hairstyle designed to naturally frame the forehead and work with a receding hairline. ";
    } else {
      eng += "mature authentic receding hairline with deep temporal recession, realistic large forehead, sparse coverage at the front. ";
    }
  } else if (hl.includes("пореде") || hl.includes("макушк") || hl.includes("лысин") || hl.includes("теменн")) {
    eng += "natural thin hair density on the crown, showing scalp realistically. Do not add fake hair volume on top. ";
  } else {
    eng += "clean natural hairline. ";
  }
  return eng;
}

export function translateHairQualityToEng(hairQuality: string): string {
  if (!hairQuality) return "";
  const hq = hairQuality.toLowerCase();
  let eng = "";
  if (hq.includes("тонк") || hq.includes("слаб") || hq.includes("истонч") || hq.includes("сух") || hq.includes("редк")) {
    eng += "natural thin fine hair texture with visible scalp, strictly avoiding any artificial volume or thickness. ";
  } else if (hq.includes("густ") || hq.includes("жестк") || hq.includes("здоров")) {
    eng += "thick healthy hair texture with strong volume. ";
  } else {
    eng += "natural healthy hair texture. ";
  }
  return eng;
}

export function translateHairTypeToEng(val: string): string {
  if (!val) return "straight";
  const v = val.toLowerCase();
  if (v.includes("прям")) return "straight";
  if (v.includes("волн")) return "wavy";
  if (v.includes("кудр") || v.includes("вьют")) return "curly";
  if (v.includes("курчав")) return "coily / textured";
  return val;
}

export function translateHairLengthToEng(val: string): string {
  if (!val) return "short";
  const v = val.toLowerCase();
  if (v.includes("лысый") || v.includes("налысо")) return "completely bald";
  if (v.includes("ежик") || v.includes("очень короткие")) return "very short buzz cut length";
  if (v.includes("короткие")) return "short length";
  if (v.includes("средние")) return "medium length";
  if (v.includes("длинные")) return "long length";
  return val;
}

export function translateHairDensityToEng(val: string): string {
  if (!val) return "medium density, natural realistic fall, NO exaggerated artificial volume, strictly no puffy tops";
  const v = val.toLowerCase();
  if (v.includes("редк") || v.includes("тонк") || v.includes("пореде") || v.includes("залысины")) return "very thin / extremely low density, sparse hair, visibly low amount of hair, strictly flat styling, absolutely DO NOT add any artificial volume or puffiness, natural thinning";
  if (v.includes("средн")) return "medium density, realistic natural fall, absolutely NO exaggerated hyper-volume, strictly no artificial puffy salon styling, hair lies flat naturally";
  if (v.includes("густ")) return "thick / high density hair, natural weight and fall, DO NOT add hyper-volume, strictly avoid an exaggerated high puffed-up top";
  return val + ", natural realistic volume, strictly NO hyper-volume on top, no puffy styling";
}

export function translateFacialHairToEng(fh: string): string {
  if (!fh) return "clean shaven, no beard, no mustache";
  const val = fh.toLowerCase().trim();
  if (val.includes("clean") || val.includes("shave") || val.includes("без растительности") || val.includes("чисто выбрит") || val.includes("нет")) {
    return "clean shaven, smooth face, no beard, no mustache";
  }
  let parts: string[] = [];
  if (val.includes("beard") || val.includes("бород")) {
    parts.push("a prominent detailed real beard");
  }
  if (val.includes("mustache") || val.includes("усн") || val.includes("усы")) {
    parts.push("a prominent natural mustache");
  }
  if (val.includes("stubble") || val.includes("щетин")) {
    parts.push("authentic short facial stubble style");
  }
  if (parts.length > 0) {
    return parts.join(" and ");
  }
  return val;
}

export function getDetailedAgePromptRu(ageRange: string): string {
  const age = (ageRange || '').toLowerCase().trim();
  if (age.includes("child") || age.includes("kid") || age.includes("ребенок") || age.includes("дет") || age.includes("мальчик") || age.includes("девочка")) {
    return "ребенок, юный возраст, гладкая детская кожа. ";
  }
  if (age.includes("teen") || age.includes("подросток") || age.includes("15-18")) {
    return "подросток, молодой человек, гладкая чистая кожа. ";
  }
  
  // Parse numbers
  const numbers = age.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    const avgAge = numbers.reduce((acc, n) => acc + parseInt(n, 10), 0) / numbers.length;
    if (avgAge >= 55) {
      return `пожилой человек старшего возраста, реальный возраст около ${Math.round(avgAge)} лет, реалистичные глубокие морщины у глаз, складки, седина, возрастные изменения лица, естественная увядающая текстура кожи с порами и несовершенствами, абсолютно без омоложения и без ретуши. `;
    } else if (avgAge >= 35) {
      return `человек среднего возраста, реальный возраст около ${Math.round(avgAge)} лет (солидный солидный возраст, не молодой юноша), видны мимические морщины на лбу и вокруг глаз, естественные складки у рта, настоящая текстура кожи взрослого человека с порами и неровностями, реалистичный вид взрослого мужчины или женщины. `;
    } else if (avgAge >= 20) {
      return `молодой человек, возраст около ${Math.round(avgAge)} лет, естественная текстура кожи, без глянца. `;
    }
  }
  
  if (age.includes("old") || age.includes("senior") || age.includes("elderly") || age.includes("пожил") || age.includes("стар") || age.includes("дедушк") || age.includes("бабушк")) {
    return "пожилой человек преклонного возраста, реальный возраст около 65-75 лет, реалистичные глубокие морщины, стареющая кожа с возрастной пигментацией и порами, седые волосы, без ретуши. ";
  }
  if (age.includes("middle") || age.includes("зрел") || age.includes("middle-aged") || age.includes("mature")) {
    return "человек среднего возраста, зрелые черты лица, возраст 45-55 лет, естественные возрастные изменения, морщинки на лбу и у глаз, настоящая текстура кожи взрослого человека без фильтров и омоложения. ";
  }
  
  return "зрелый солидный возраст, естественная текстура кожи с мимическими морщинками и порами, реальное обычное лицо без глянца и ретуши. ";
}

export function getDetailedAgePromptEng(ageRange: string): string {
  const age = (ageRange || '').toLowerCase().trim();
  if (age.includes("child") || age.includes("kid") || age.includes("ребенок") || age.includes("дет") || age.includes("мальчик") || age.includes("девочка")) {
    return "young child, clear youthful skin, very young facial features";
  }
  if (age.includes("teen") || age.includes("подросток") || age.includes("15-18")) {
    return "teenager, adolescent features, young smooth skin";
  }
  
  const numbers = age.match(/\d+/g);
  let avgAge = 0;
  if (numbers && numbers.length > 0) {
    avgAge = Math.round(numbers.reduce((acc, n) => acc + parseInt(n, 10), 0) / numbers.length);
  }

  const realIsElderly = age.includes("old") || age.includes("senior") || age.includes("elderly") || age.includes("пожил") || age.includes("стар") || age.includes("бабушк") || age.includes("дедушк") || avgAge >= 60;
  if (realIsElderly) {
    const displayAge = avgAge || 70;
    return `elderly senior, aged around ${displayAge}, realistic deep wrinkles under eyes and on forehead, realistic neck lines, graying skin, weathered mature skin with age spots, PURE NATURAL look, ABSOLUTELY NOT a young model, looking authentic and aged`;
  }

  const realIsMiddle = age.includes("middle") || age.includes("зрел") || age.includes("middle-aged") || age.includes("mature") || avgAge >= 35;
  if (realIsMiddle) {
    const displayAge = avgAge || 48;
    if (displayAge >= 50) {
      return `mature middle-aged person, aged around ${displayAge} years old (around fifty), with natural crow's feet wrinkles under eyes, moderate forehead lines, realistic complex skin texture with visible natural pores and natural age lines, NOT a young model, looking completely authentic and realistic for their age, absolutely zero digital smoothing, no AI-generated perfection`;
    } else if (displayAge >= 45) {
      return `middle-aged mature adult, aged around ${displayAge} years old, with natural fine lines around eyes, visible forehead wrinkles, realistic mature skin texture with pores, absolutely no face-smoothing filters, looks realistic and unretouched, age is fully respected`;
    } else {
      return `middle-aged mature person, aged around ${displayAge}, realistic fine wrinkles under eyes and forehead, natural skin pores, mature distinct features, absolutely no digital smoothing`;
    }
  }

  if (avgAge && avgAge >= 20) {
    return `young adult, aged around ${avgAge}, realistic raw photo texture, natural raw skin, no smoothing`;
  }
  return "realistic human face texture with natural wrinkles and pores, raw camera photograph, no airbrushing or professional beauty filters";
}

export function getHairstyleEnglishDescription(keyword: string): string {
  const kw = (keyword || '').toLowerCase().trim();
  if (kw.includes("полубокс")) return "classic short sportive side-part haircut, faded sides";
  if (kw.includes("цезарь")) return "modern crop style, short flat bangs, french crop";
  if (kw.includes("кроп")) return "textured crop haircut, short fringe, low fade";
  if (kw.includes("андеркат")) return "undercut hairstyle with clean shaved temples and back";
  if (kw.includes("канадка")) return "classic canadian style crew cut, styled volume on top";
  if (kw.includes("британка")) return "stylish british comb over haircut with side-part";
  if (kw.includes("бокс")) return "ultra clean short buzz cut, athletic look";
  if (kw.includes("пикси")) return "textured chic pixie cut, fine soft layers on top";
  if (kw.includes("боб")) return "classic elegant bob length haircut";
  if (kw.includes("каре")) return "symmetrical straight lines lob bob haircut";
  if (kw.includes("каскад")) return "layered cascading waves haircut";
  if (kw.includes("маллет")) return "modern soft mullet haircut";
  if (kw.includes("ежик")) return "short buzz cut textured top";
  if (kw.includes("лысый") || kw.includes("налысо")) return "completely clean bald shaved head, smooth aesthetic skull shorn scalp";
  return kw;
}

export function getDemographicDetails(gender: string, ageRange: string) {
  const g = (gender || '').toLowerCase().trim();
  const isMale = g === 'male' || g.includes('муж') || g.includes('man') || g.includes('boy');
  const isFemale = g === 'female' || g.includes('жен') || g.includes('woman') || g.includes('girl');
  
  const age = (ageRange || '').toLowerCase().trim();
  const isChild = age.includes("child") || age.includes("kid") || age.includes("rebenok") || age.includes("ребенок") || age.includes("дет") || age.includes("мальчик") || age.includes("девочка");
  const isTeen = age.includes("teen") || age.includes("podrostok") || age.includes("подросток") || age.includes("молод") || age.includes("youth") || age.includes("15-18");
  const isElderly = age.includes("old") || age.includes("senior") || age.includes("elderly") || age.includes("grand") || age.includes("пожил") || age.includes("хор") || age.includes("стар") || age.includes("бабушк") || age.includes("дедушк") || age.includes("65") || age.includes("70") || age.includes("75") || age.includes("80");

  const numbers = age.match(/\d+/g);
  let numericAge = 0;
  if (numbers && numbers.length > 0) {
    const sum = numbers.reduce((acc, n) => acc + parseInt(n, 10), 0);
    numericAge = Math.round(sum / numbers.length);
  }

  // Override/finalize triggers if numeric age is specified
  const realIsElderly = isElderly || (numericAge >= 60);
  const realIsTeen = isTeen || (numericAge >= 11 && numericAge <= 20);
  const realIsChild = isChild || (numericAge > 0 && numericAge <= 10);

  let demographic = "";
  let ageFeatures = "";

  if (realIsChild) {
    if (isMale) {
      demographic = numericAge ? `маленький мальчик в возрасте ${numericAge} лет` : "маленький мальчик ребенок";
    } else if (isFemale) {
      demographic = numericAge ? `маленькая девочка в возрасте ${numericAge} лет` : "маленькая девочка ребенок";
    } else {
      demographic = "маленький ребенок";
    }
    ageFeatures = "Гладкая детская кожа, естественные мягкие детские черты лица, ребенок до 10 лет.";
  } else if (realIsTeen) {
    if (isMale) {
      demographic = numericAge ? `молодой юноша парень-подросток в возрасте ${numericAge} лет` : "молодой парень юноша-подросток";
    } else {
      demographic = numericAge ? `молодая девушка-подросток в возрасте ${numericAge} лет` : "молодая девушка-подросток";
    }
    ageFeatures = "Чистая юношеская кожа, естественное молодое лицо.";
  } else if (realIsElderly) {
    if (isMale) {
      demographic = numericAge ? `пожилой благородный пожилой мужчина в возрасте ${numericAge} лет` : "пожилой благородный мужчина старшего возраста";
    } else {
      demographic = numericAge ? `пожилая благородная женщина в возрасте ${numericAge} лет` : "пожилая благородная женщина старшего возраста";
    }
    ageFeatures = "Реалистичные глубокие морщины на лбу и вокруг глаз, благородная седина, настоящая стареющая текстура кожи со всеми порами, абсолютно естественный вид пожилого человека без ретуши, без омоложения.";
  } else {
    // Adult
    if (isMale) {
      if (numericAge) {
        if (numericAge >= 50) {
          demographic = `зрелый мужчина среднего возраста в возрасте ровно ${numericAge} лет`;
          ageFeatures = `Выраженные зрелые мужские черты лица, соответствующие возрасту ${numericAge} лет, естественные возрастные мимические морщины вокруг глаз и на лбу, легкая текстура кожи взрослого человека с порами без фильтров омоложения, зрелый вид пятидесятилетнего человека.`;
        } else if (numericAge >= 40) {
          demographic = `взрослый мужчина в возрасте ${numericAge} лет`;
          ageFeatures = `Естественные мимические морщины на лбу и у глаз, благородный зрелый вид мужчины ${numericAge} лет.`;
        } else {
          demographic = `мужчина в возрасте ${numericAge} лет`;
          ageFeatures = `Естественная текстура мужской кожи с порами, реальный возраст ${numericAge} лет.`;
        }
      } else {
        demographic = "взрослый солидный мужчина";
        ageFeatures = "Естественная текстура кожи с порами, реальный взрослый вид.";
      }
    } else if (isFemale) {
      if (numericAge) {
        if (numericAge >= 50) {
          demographic = `зрелая ухоженная женщина в возрасте ровно ${numericAge} лет`;
          ageFeatures = `Привлекательные зрелые женские черты лица, соответствующие возрасту ${numericAge} лет, естественные мимические морщинки у глаз, реальная кожа зрелой женщины без омоложения, естественный вид пятидесятилетней женщины.`;
        } else if (numericAge >= 40) {
          demographic = `взрослая привлекательная женщина в возрасте ${numericAge} лет`;
          ageFeatures = `Привлекательный зрелый вид женщины ${numericAge} лет, мягкие мимические линии.`;
        } else {
          demographic = `женщина в возрасте ${numericAge} лет`;
          ageFeatures = `Естественная текстура кожи с порами, реальный возраст ${numericAge} лет.`;
        }
      } else {
        demographic = "взрослая привлекательная женщина";
        ageFeatures = "Естественная текстура женской кожи с порами.";
      }
    } else {
      demographic = numericAge ? `человек в возрасте ${numericAge} лет` : "взрослый человек";
      ageFeatures = "Естественные черты лица, соответствующие возрасту.";
    }
  }

  return { demographic, ageFeatures, isMale, isFemale, numericAge, realIsChild, realIsTeen, realIsElderly };
}

export function getSafeRussianPrompt(gender: string, ageRange: string, haircutName?: string, keyword?: string, hairColor?: string, clothingContext?: string): string {
  const { demographic, ageFeatures, isMale, isFemale } = getDemographicDetails(gender, ageRange);
  
  let styleName = haircutName || "";
  if (!styleName && keyword) {
    if (/[а-яА-Я]/.test(keyword)) {
      styleName = keyword;
    } else {
      const kwLower = keyword.toLowerCase();
      if (kwLower.includes("pixie") || kwLower.includes("пикси")) styleName = "Пикси";
      else if (kwLower.includes("bob") || kwLower.includes("боб")) styleName = "Боб";
      else if (kwLower.includes("crop") || kwLower.includes("кроп")) styleName = "Кроп";
      else if (kwLower.includes("undercut") || kwLower.includes("андеркат")) styleName = "Андеркат";
      else if (kwLower.includes("buzz") || kwLower.includes("ежик") || kwLower.includes("бокс")) styleName = "Бокс/Ежик";
      else if (kwLower.includes("fade") || kwLower.includes("полубокс")) styleName = "Полубокс";
      else if (kwLower.includes("mullet") || kwLower.includes("маллет")) styleName = "Маллет";
      else if (kwLower.includes("shave") || kwLower.includes("лыс") || kwLower.includes("bald")) styleName = "налысо";
      else styleName = "повседневная прическа";
    }
  }
  if (!styleName) {
    styleName = isMale ? "обычная мужская стрижка" : "обычная женская стрижка";
  }

  let colorStr = "";
  if (hairColor) {
    const col = hairColor.toLowerCase();
    if (col.includes("блонд") || col.includes("светл")) colorStr = ", светлые волосы";
    else if (col.includes("русый")) colorStr = ", русые волосы";
    else if (col.includes("каштан")) colorStr = ", каштановые волосы";
    else if (col.includes("черн")) colorStr = ", темные черные волосы";
    else if (col.includes("рыж")) colorStr = ", рыжие волосы";
    else if (col.includes("сед") || col.includes("пепел")) colorStr = ", седные волосы";
  }

  let result = `Повседневная стрижка или прическа ${styleName} на человеке. На фото изображен ${demographic}. ${ageFeatures} Фотопортрет по плечи (чтобы прическа полностью была в кадре), лицом к камере, профессиональный фото-свет, нейтральный студийный фон${colorStr}. `;
  if (clothingContext) {
    result += `Одежда: ${clothingContext}. `;
  }
  result += `Очень естественная прическа, как у обычного человека в жизни. КРИТИЧНО: без гипер-объема сверху, строго без фейковой салонной укладки, волосы лежат плоско или с минимальным объемом.`;
  return result;
}

export function getDetailedRussianPrompt(params: any): string {
  const {
    gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
    skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
    hairlineStatus, hairQuality, haircutName
  } = params;

  const { demographic, ageFeatures, isMale, isFemale } = getDemographicDetails(gender, ageRange);

  const noun = isMale ? "мужчина" : (isFemale ? "женщина" : "человек");
  const nounGen = isMale ? "мужчины" : (isFemale ? "женщины" : "человека");

  let styleName = haircutName || "";
  if (!styleName && keyword) {
    if (/[а-яА-Я]/.test(keyword)) {
      styleName = keyword;
    } else {
      const kwLower = keyword.toLowerCase();
      if (kwLower.includes("pixie") || kwLower.includes("пикси")) styleName = "Пикси";
      else if (kwLower.includes("bob") || kwLower.includes("боб")) styleName = "Боб";
      else if (kwLower.includes("crop") || kwLower.includes("кроп")) styleName = "Кроп";
      else if (kwLower.includes("undercut") || kwLower.includes("андеркат")) styleName = "Андеркат";
      else if (kwLower.includes("buzz") || kwLower.includes("ежик") || kwLower.includes("бокс")) styleName = "Бокс/Ежик";
      else if (kwLower.includes("fade") || kwLower.includes("полубокс")) styleName = "Полубокс";
      else if (kwLower.includes("mullet") || kwLower.includes("маллет")) styleName = "Маллет";
      else if (kwLower.includes("shave") || kwLower.includes("лыс") || kwLower.includes("bald")) styleName = "налысо";
      else styleName = "повседневная прическа";
    }
  }
  if (!styleName) {
    styleName = isMale ? "обычная мужская стрижка" : "обычная женская стрижка";
  }

  let promptBuilder = `Любительское, непрофессиональное фото или обычное повседневное селфи по грудь. Много свободного пространства над головой (negative space). Реалистичное фото ОДНОГО человека, лицо прямо к камере. `;
  promptBuilder += `На фото НЕ модель, а обычный, реальный ${demographic}. ${ageFeatures} Фотореалистичность 100%, камера телефона, без фильтров и ретуши. Кожа с естественными порами и неровностями. Строго запрещено делать пышную или высокую укладку. Никакого гипер-объема или "гнезда" сверху. Волосы должны прилегать к голове реалистично. `;

  const kwLowerForStyle = styleName.toLowerCase();
  if (kwLowerForStyle.includes("кроп") || kwLowerForStyle.includes("бокс") || kwLowerForStyle.includes("андеркат") || kwLowerForStyle.includes("полубокс") || kwLowerForStyle.includes("fade") || kwLowerForStyle.includes("crew") || kwLowerForStyle.includes("buzz")) {
       promptBuilder += `Это короткая стрижка! Волосы сверху ДОЛЖНЫ ЛЕЖАТЬ МАКСИМАЛЬНО ПЛОСКО, абсолютно НОЛЬ объема! Никаких торчащих пушистых кудрей, никаких челок вверх, никакой шапки. Этом строгий запрет на любой объем! `;
  } else {
       promptBuilder += `Волосы должны выглядеть естественно, лежать плоско, с минимальным базовым объемом. Запрещен салонный пышный объем. `;
  }

  if (faceShape) {
    promptBuilder += `Форма лица: ${faceShape.toLowerCase()}. `;
  }

  promptBuilder += `Новая прическа: "${styleName.replace(/растрепанный/gi, "").replace(/объемный/gi, "").replace(/messy/gi, "").trim()}". `;
  if (description) {
    const cleanDesc = description.substring(0, 150)
      .replace(/растрепанный/gi, "гладкий")
      .replace(/объемный/gi, "приглаженный")
      .replace(/пышный/gi, "плоский")
      .replace(/небрежный/gi, "аккуратный")
      .replace(/торчащие/gi, "гладкие");
    promptBuilder += `Особенности новой стрижки: ${cleanDesc}. `;
  }

  if (hairDensity) {
    const dens = hairDensity.toLowerCase();
    if (dens.includes("редкие") || dens.includes("жидкие") || dens.includes("поредение") || dens.includes("залысины") || dens.includes("тонкие")) {
      promptBuilder += `У ${nounGen} ОЧЕНЬ РЕДКИЕ ТОНКИЕ волосы. Волосы плотно прилегают к голове. Концы плоские. Никаких пышных шапок. Максимально естественная, прилизанная текстура. `;
    } else {
      promptBuilder += `Густота волос: в точности ${dens.substring(0, 50)}. СТРОГИЙ ЗАПРЕТ на искусственный гипер-объем! Волосы падают вниз плоско под силой гравитации. `;
    }
  } else {
      promptBuilder += `Густота: естественная (строго без гипер-объема). `;
  }
  
  if (hairlineStatus) {
    const hs = hairlineStatus.toLowerCase();
    if (hs.includes("залысины") || hs.includes("редкая") || hs.includes("височн") || hs.includes("receding")) {
      promptBuilder += `ВАЖНО: У ${nounGen} глубокие височные залысины и высокий лоб. Не сглаживать линию роста! Залысины должны быть явно видны, волосы не скрывают залысины. `;
    } else {
      promptBuilder += `Линия роста волос у лба: ${hs}. `;
    }
  }
  
  if (hairQuality) {
    promptBuilder += `Структура волос: ${hairlineStatus && hairlineStatus.toLowerCase().includes("лыс") ? "бритая голова" : hairQuality.toLowerCase()}. Волосы выглядят обычно, как в реальной жизни (не из рекламы шампуня). `;
  }

  let colorStr = "";
  if (customHairColor && customHairColor !== "Любой") {
    colorStr = customHairColor;
  } else if (hairColor) {
    colorStr = hairColor;
  }
  if (colorStr) {
    let colRu = colorStr.toLowerCase();
    if (colRu.includes("dark brown") || colRu.includes("тёмно-каштанов")) colRu = "темно-каштановые волосы";
    else if (colRu.includes("light brown") || colRu.includes("светло-рус")) colRu = "светло-русые волосы";
    else if (colRu.includes("blond") || colRu.includes("блонд") || colRu.includes("светл")) colRu = "светлые волосы (блонд)";
    else if (colRu.includes("ash") || colRu.includes("рус")) colRu = "русые волосы";
    else if (colRu.includes("brown") || colRu.includes("каштан") || colRu.includes("шатен")) colRu = "каштановые волосы";
    else if (colRu.includes("black") || colRu.includes("черн")) colRu = "темные черные волосы";
    else if (colRu.includes("red") || colRu.includes("рыж") || colRu.includes("медн")) colRu = "рыжие волосы";
    else if (colRu.includes("grey") || colRu.includes("gray") || colRu.includes("сед") || colRu.includes("пепел")) colRu = "седые волосы";
    promptBuilder += `Цвет волос: строго ${colRu}. `;
  }

  if (hairType) {
    promptBuilder += `Тип волос ${nounGen}: ${hairType.toLowerCase()}. `;
  }

  if (facialHair) {
    let fhRu = facialHair.toLowerCase();
    if (fhRu.includes("clean") || fhRu.includes("shave") || fhRu.includes("без")) {
      promptBuilder += `Чисто выбритое лицо, отсутствие любой щетины, бороды или усов. `;
    } else {
      if (fhRu.includes("beard") && fhRu.includes("mustache")) fhRu = "аккуратная борода и усы";
      else if (fhRu.includes("beard")) fhRu = "аккуратная борода";
      else if (fhRu.includes("mustache")) fhRu = "усы";
      else if (fhRu.includes("stubble")) fhRu = "аккуратная короткая щетина";
      promptBuilder += `Растительность на лице ${nounGen}: ${fhRu}. `;
    }
  } else {
    promptBuilder += `Чисто выбритое лицо, усы и борода отсутствуют. `;
  }

  if (eyeColor) {
    let ecRu = eyeColor.toLowerCase();
    if (ecRu.includes("brown") || ecRu.includes("кари")) ecRu = "карие";
    else if (ecRu.includes("blue") || ecRu.includes("голуб")) ecRu = "голубые";
    else if (ecRu.includes("green") || ecRu.includes("зелен")) ecRu = "зеленые";
    else if (ecRu.includes("gray") || ecRu.includes("grey") || ecRu.includes("сер")) ecRu = "серые";
    promptBuilder += `Цвет глаз: ${ecRu}. `;
  }

  if (clothingContext) {
    promptBuilder += `Одежда: ${clothingContext}. `;
  }

  promptBuilder += `Освещение: обычный дневной свет из окна. Фон: нейтральный, обычная пустая стена (серый или бежевый). Фокус на лице. `;
  promptBuilder += `КРИТИЧЕСКИЕ ИСКЛЮЧЕНИЯ: Без разделения экрана на до/после, без коллажей. Только одно цельное фото. `;
  promptBuilder += `САМОЕ ВАЖНОЕ: Это любительское фото обычного человека, не с обложки журнала Vogue. Максимально естественная, аккуратная, гладкая и повседневная (casual) прическа. ВОЛОСЫ ПЛОТНО ПРИЛЕГАЮТ К ГОЛОВЕ ИЛИ ИМЕЮТ УМЕРЕННЫЙ ЕСТЕСТВЕННЫЙ ОБЪЕМ (без гипер-объема сверху). Строгий запрет на фейковую идеальную салонную укладку, на торчащие во все стороны пряди, на растрепанность (messy hair) как после урагана, на аниме-прически. Категорически запрещено делать "шапку" из волос, высокую челку-помпадур, слишком пушистые кудри. Прическа должна быть спокойной и носибельной. `;
  promptBuilder += `Категорически запрещено делать идеальные черты лица челюсти (скулы супермодели). Лицо должно быть обычным, не идеализированным. Категорически запрещено омолаживать лицо, делать его искусственно моложе указанного возраста. Это должен быть реальный человек своего возраста. `;


  return promptBuilder.substring(0, 950).trim();
}
