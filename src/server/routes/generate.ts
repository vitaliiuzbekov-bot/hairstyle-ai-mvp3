
import { Request, Response, Router } from "express";
import { logToTelegram } from "../services/logger";
import { callYandexGPT, callYandexGPTChat, getYandexIamToken, extractFolderId } from "../services/yandex";
import { getCacheKey, getCachedValue, setCachedValue } from "../services/cache";
import { adminApp, adminStorage } from "../firebase";
import crypto from "crypto";

export const generateRouter = Router();

function getDemographicDescriptorRu(gender: string, ageRange: string): string {
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

function getDemographicDescriptor(gender: string, ageRange: string): string {
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

function translateHairlineStatusToEng(hairlineStatus: string, selectedStyleKeyword?: string): string {
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
      eng += "neat forward-swept hairstyle designed to naturally frame the forehead and mask recession. ";
    } else {
      eng += "mature hairline with natural slight temporal recession, realistic forehead. ";
    }
  } else if (hl.includes("пореде") || hl.includes("макушк") || hl.includes("лысин") || hl.includes("теменн")) {
    eng += "natural hair density adapted for neat executive styling. ";
  } else {
    eng += "clean natural hairline. ";
  }
  return eng;
}

function translateHairQualityToEng(hairQuality: string): string {
  if (!hairQuality) return "";
  const hq = hairQuality.toLowerCase();
  let eng = "";
  if (hq.includes("тонк") || hq.includes("слаб") || hq.includes("истонч") || hq.includes("сух") || hq.includes("редк")) {
    eng += "natural hair texture with soft realistic volume. ";
  } else if (hq.includes("густ") || hq.includes("жестк") || hq.includes("здоров")) {
    eng += "thick healthy hair texture with strong volume. ";
  } else {
    eng += "natural healthy hair texture. ";
  }
  return eng;
}

function translateHairTypeToEng(val: string): string {
  if (!val) return "straight";
  const v = val.toLowerCase();
  if (v.includes("прям")) return "straight";
  if (v.includes("волн")) return "wavy";
  if (v.includes("кудр") || v.includes("вьют")) return "curly";
  if (v.includes("курчав")) return "coily / textured";
  return val;
}

function translateHairLengthToEng(val: string): string {
  if (!val) return "short";
  const v = val.toLowerCase();
  if (v.includes("лысый") || v.includes("налысо")) return "completely bald";
  if (v.includes("ежик") || v.includes("очень короткие")) return "very short buzz cut length";
  if (v.includes("короткие")) return "short length";
  if (v.includes("средние")) return "medium length";
  if (v.includes("длинные")) return "long length";
  return val;
}

function translateHairDensityToEng(val: string): string {
  if (!val) return "medium density";
  const v = val.toLowerCase();
  if (v.includes("редк") || v.includes("тонк") || v.includes("пореде")) return "thin / low density";
  if (v.includes("средн")) return "medium density";
  if (v.includes("густ")) return "thick / high density";
  return val;
}

function translateFacialHairToEng(fh: string): string {
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

function getDetailedAgePromptRu(ageRange: string): string {
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

function getDetailedAgePromptEng(ageRange: string): string {
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

function getHairstyleEnglishDescription(keyword: string): string {
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

function getDemographicDetails(gender: string, ageRange: string) {
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

function getSafeRussianPrompt(gender: string, ageRange: string, haircutName?: string, keyword?: string, hairColor?: string): string {
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
      else styleName = "стильная прическа";
    }
  }
  if (!styleName) {
    styleName = isMale ? "мужская стрижка" : "модная стрижка";
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

  return `Стильная стрижка или прическа ${styleName} на человеке. На фото изображен ${demographic}. ${ageFeatures} Фотопортрет крупным планом, лицом к камере, профессиональный фото-свет, нейтральный студийный фон${colorStr}`;
}

function getDetailedRussianPrompt(params: any): string {
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
      else styleName = "стильная прическа";
    }
  }
  if (!styleName) {
    styleName = isMale ? "мужская стрижка" : "модная стрижка";
  }

  let promptBuilder = `Реалистичный профессиональный студийный фотопортрет ОДНОГО человека, крупный план, лицо повернуто прямо к камере, взгляд в объектив. `;
  promptBuilder += `На фото изображен ${demographic}. `;
  promptBuilder += `${ageFeatures} `;

  if (faceShape) {
    promptBuilder += `Форма лица ${nounGen}: ${faceShape.toLowerCase()}. `;
  }

  promptBuilder += `Новая прическа на фото: "${styleName}". `;
  if (description) {
    promptBuilder += `Особенности новой стрижки ${nounGen}: ${description.substring(0, 150)}. `;
  }

  if (hairlineStatus) {
    promptBuilder += `Линия роста волос у лба ${nounGen}: ${hairlineStatus.toLowerCase()}. Стрижка адаптирована под эту линию роста волос, выглядит абсолютно натурально и гармонично. `;
  }
  if (hairQuality) {
    promptBuilder += `Структура волос: ${hairlineStatus && hairlineStatus.toLowerCase().includes("лыс") ? "бритая голова" : hairQuality.toLowerCase()}. `;
  }
  if (hairDensity) {
    promptBuilder += `Густота волос: ${hairDensity.toLowerCase()}. Волосы выглядят естественно, без избыточного объема в зонах поредения. `;
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

  promptBuilder += `Освещение: мягкий студийный портретный свет. Фон: нейтральный серый или светло-бежевый однотонный уединенный студийный фон. `;
  promptBuilder += `КРИТИЧЕСКИЕ ИСКЛЮЧЕНИЯ: Без разделения экрана на до/после, без коллажей из нескольких фото, без наложенного текста, логотипов и графических рамок. Только одно цельное профессиональное реалистичное фото. `;
  promptBuilder += `Категорически запрещено омолаживать лицо, делать его искусственно моложе указанного возраста, превращать взрослого человека среднего возраста в юного парня или девушку. Это должен быть реальный зрелый человек своего возраста, а не отретушированная молодая модель. `;

  return promptBuilder.substring(0, 950).trim();
}

generateRouter.post("/generate-reference", async (req, res) => {
    try {
      const { 
        gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        hairlineStatus, hairQuality, haircutName
      } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      // Check cache first (Cache for 30 days)
      const cacheKey = getCacheKey({ 
        route: "generate-reference-v2", 
        keyword, gender, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair,
        hairlineStatus, hairQuality, haircutName
      });
      const cachedImage = await getCachedValue<string>(cacheKey);
      if (cachedImage) {
        console.log("Returned reference from cache!");
        return res.json({ imageUrl: cachedImage });
      }

      const prompt = getDetailedRussianPrompt({
        gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        hairlineStatus, hairQuality, haircutName
      });

      let finalImageUrl = "";
      let lastError = "";

      const yandexServiceAccountKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
      const yandexFolderId = process.env.YANDEX_FOLDER_ID;

      if (yandexServiceAccountKey && yandexFolderId) {
        console.log("Generating reference via YandexART... prompt:", prompt);
        try {
            const cleanFolderId = extractFolderId(yandexFolderId);
            if (cleanFolderId === "MY_FOLDER_ID" || cleanFolderId.toLowerCase().includes("folder_id") || cleanFolderId.length < 5) {
                throw new Error(`[ОШИБКА НАСТРОЙКИ СЕРВЕРА] В YANDEX_FOLDER_ID указан плейсхолдер "${cleanFolderId}". Пожалуйста, пропишите реальный Идентификатор каталога на Render.com.`);
            }
            const iamToken = await getYandexIamToken(yandexServiceAccountKey);

          // 1. Start Async Generation
          const reqBody = {
            modelUri: `art://${cleanFolderId}/yandex-art/latest`,
            generationOptions: {
              seed: Math.floor(Math.random() * 10000000).toString(),
              aspectRatio: { widthRatio: "3", heightRatio: "4" }
            },
            messages: [
              { weight: 1, text: prompt },
              { weight: -1, text: "grid, split screen, collage, graphic, template, drawing, illustration, sketch, text, watermark, logo, numbers, stamp, circle badge" }
            ]
          };

          let initRes = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${iamToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
          });

          if (!initRes.ok) {
            let errText = await initRes.text();
            
            // Retry with a safer, simplified prompt if we hit safety filters (often code 3)
            if (errText.includes("не могу сгенерировать") || errText.includes("другую тему") || errText.includes("code\":3")) {
              console.log("YandexART rejected the prompt. Retrying with a simplified, safe prompt...");
              const safePrompt = getSafeRussianPrompt(gender, ageRange, haircutName, keyword, hairColor);
              reqBody.messages[0].text = safePrompt.substring(0, 480).trim();
              
              initRes = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${iamToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
              });
              
              if (!initRes.ok) {
                errText = await initRes.text();
              }
            }
            
            if (!initRes.ok) {
              let diagnostic = "";
              if (errText.includes("model_uri") || errText.includes("modelUri") || initRes.status === 400) {
                  const masked = cleanFolderId.length > 5 
                     ? `${cleanFolderId.slice(0, 4)}...${cleanFolderId.slice(-4)}` 
                     : cleanFolderId;
                  diagnostic = `\n(Диагностика: YandexART отклонил запрос. Проверьте правильность YANDEX_FOLDER_ID на вашем сервере. Значение на сервере: "${masked}")`;
              }
              throw new Error(`YandexART Init Error: ${errText}${diagnostic}`);
            }
          }

          const initData = await initRes.json();
          const operationId = initData.id;
          
          if (!operationId) {
            throw new Error('No operation ID returned by YandexART');
          }

          // 2. Poll for Completion using Operation Service
          const pollUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;
          let attempts = 0;
          const maxAttempts = 12; // 12 * 2500ms = 30 seconds
          
          while (attempts < maxAttempts && !finalImageUrl) {
            await new Promise(resolve => setTimeout(resolve, 2500)); // Delay between polling
            
            const pollRes = await fetch(pollUrl, {
              headers: {
                'Authorization': `Bearer ${iamToken}`
              }
            });

            if (!pollRes.ok) {
              console.error(`Polling Error HTTP ${pollRes.status}`);
              attempts++;
              continue;
            }

            const pollData = await pollRes.json();
            
            if (pollData.done) {
              if (pollData.response && pollData.response.image) {
                  finalImageUrl = `data:image/jpeg;base64,${pollData.response.image}`;
              } else if (pollData.error) {
                  throw new Error(`YandexART Gen Error: ${pollData.error.message || JSON.stringify(pollData.error)}`);
              }
            }
            attempts++;
          }
          
          if (!finalImageUrl) {
            throw new Error('YandexART generation timed out after 30 seconds');
          }

        } catch (error: any) {
             lastError += `[YandexART: ${error.message}]`;
             console.error("YandexART Failed:", error);
        }
      } else {
         lastError += "[Яндекс Облако не настроено, отсутствуют YANDEX_SERVICE_ACCOUNT_KEY или YANDEX_FOLDER_ID]";
      }

      // Fallback
      if (!finalImageUrl) {
          console.error(`Не удалось сгенерировать изображение: ${lastError}. Используем fallback-изображение.`);
          finalImageUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80';
      } else {
          // Save to cache for 30 days (30 * 24 * 60 * 60 seconds)
          await setCachedValue(cacheKey, finalImageUrl, 30 * 24 * 60 * 60);
      }

      res.json({ imageUrl: finalImageUrl, debugError: lastError });
    } catch (err: any) {
      console.error("Reference gen error:", err);
      res.status(500).json({ error: err.message || "Ошибка генерации референса" });
    }
  });

  
generateRouter.post("/generate-full", async (req, res) => {
    try {
      const { 
        userId, gender, keyword, description, faceShape, hairLength, hairDensity, hairType, skinTone, 
        skinDetails, hairColor, customHairColor, eyeColor, ageRange, facialFeatures, facialHair, clothingContext,
        selfieImage, // Required for Step 2
        vtonStrength, // Number from 50 to 100
        targetImageUrl, // Optional, generated reference image URL
        hairlineStatus, hairQuality
      } = req.body;
      
      if (!keyword || !selfieImage) {
        return res.status(400).json({ error: "Missing parameters: keyword and selfieImage are required." });
      }

      // Check cache first (Cache for 30 days)
      const cacheKey = getCacheKey({ 
        route: "generate-full-v2", 
        userId, keyword, customHairColor, hairColor, vtonStrength, targetImageUrl,
        // using string truncation or full string to hash the selfie.
        // String hashing is deterministic.
        selfieHash: getCacheKey(selfieImage),
        hairlineStatus, hairQuality
      });
      const cachedImage = await getCachedValue<string>(cacheKey);
      if (cachedImage) {
        console.log("Returned VTON from cache!");
        return res.json({ imageUrl: cachedImage });
      }

      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "Отсутствует FAL_KEY в переменных окружения." });
      }

      let finalImageUrl = "";
      let lastError = "";
      let swappedImageUrl = "";
      const selfieImageFull = selfieImage.startsWith('http') || selfieImage.startsWith('data:') ? selfieImage : `data:image/jpeg;base64,${selfieImage}`;

      const translateColor = (val: string) => {
        val = val.toLowerCase();
        if (val.includes("тёмно-каштан") || val.includes("темно-каштан")) return "rich deep dark chestnut brown";
        if (val.includes("блонд") || val.includes("светл")) return "BRIGHT PLATINUM BLONDE";
        if (val.includes("рус")) return "natural medium ash brown";
        if (val.includes("каштан") || val.includes("шатен")) return "solid warm chestnut brown";
        if (val.includes("черн") || val.includes("тёмн") || val.includes("темн")) return "pure deep jet black";
        if (val.includes("рыж") || val.includes("медн")) return "vivid intense copper red / ginger";
        if (val.includes("сед") || val.includes("пепел") || val.includes("бел") || val.includes("сер")) return "PURE STATUESQUE WHITE AND BRIGHT SILVER GREY";
        if (val.includes("розов")) return "vibrant pastel pink";
        if (val.includes("син") || val.includes("голуб")) return "vivid blue";
        if (val.includes("зелен") || val.includes("зелён")) return "vivid green";
        if (val.includes("фиолет")) return "vivid purple";
        if (val.includes("красн")) return "vivid red";
        return val;
      };

      // 0 means only change hair color, preserve original hairstyle exactly.
      // 1-74 means change shape keeping background.
      // 75-100 means studio shot (use reference image)
      const requestedStrength = Math.min(Math.max(typeof vtonStrength === 'number' ? vtonStrength : 50, 0), 100);
      
      let isStudioShot = requestedStrength >= 75;
      const isCustomColorRequested = customHairColor && customHairColor !== "Любой";
      const targetHairColor = isCustomColorRequested ? customHairColor : hairColor;
      const finalColor = targetHairColor && targetHairColor !== "Любой" ? translateColor(targetHairColor).toLowerCase() : "";
      
      let baseImageForFlux = selfieImageFull;
      let fluxStrength = 0.40;
      
      if (!isStudioShot) {
          baseImageForFlux = selfieImageFull;
          if (requestedStrength === 0) {
              fluxStrength = 0.22; // Very safe strength to keep face completely intact and only change hair color
          } else {
              // Linear scale from 0.28 up to 0.58, preventing high-strength face corruption
              fluxStrength = 0.28 + (requestedStrength / 74) * 0.30; 
          }
      } else {
          if (targetImageUrl) {
              baseImageForFlux = targetImageUrl.startsWith('http') || targetImageUrl.startsWith('data:') 
                  ? targetImageUrl 
                  : `data:image/jpeg;base64,${targetImageUrl}`;
              
              if (isCustomColorRequested) {
                  fluxStrength = 0.80 + ((requestedStrength - 75) / 25) * 0.15; // 0.80 to 0.95
              } else {
                  fluxStrength = requestedStrength === 75 ? 0.05 : 0.40 + ((requestedStrength - 75) / 25) * 0.40; // 0.40 to 0.80
              }
          } else {
              baseImageForFlux = selfieImageFull;
              fluxStrength = isCustomColorRequested 
                  ? 0.80 + ((requestedStrength - 75) / 25) * 0.15
                  : 0.50 + ((requestedStrength - 75) / 25) * 0.30; // 0.50 to 0.80
          }
      }

      // Translate description to English if it contains Cyrillic characters
      let englishDescription = description || "";
      if (description && /[а-яА-ЯёЁ]/.test(description)) {
        try {
          console.log("Translating Russian description to English via YandexGPT...");
          const translationPrompt = "Translate the following Russian description of a hairstyle to high-detail short English keywords suitable for stable diffusion image generator. Return ONLY the English translation, no other text.";
          const translated = await callYandexGPT(translationPrompt, description);
          if (translated && translated.trim().length > 3) {
            englishDescription = translated.trim();
          }
        } catch (e) {
          console.warn("Failed to translate description, falling back to original:", e);
        }
      }

      // Translate clothing context to English if it contains Cyrillic characters
      let englishClothingContext = clothingContext || "";
      if (clothingContext && /[а-яА-ЯёЁ]/.test(clothingContext)) {
        try {
          console.log("Translating Russian clothing context to English via YandexGPT...");
          const cPrompt = "Translate the following description of clothes and background setting from Russian to a clear English description suitable for high-quality image generation props. Return ONLY the English translation, no other text.";
          const translated = await callYandexGPT(cPrompt, clothingContext);
          if (translated && translated.trim().length > 3) {
            englishClothingContext = translated.trim();
          }
        } catch (e) {
          console.warn("Failed to translate clothing context, falling back to original:", e);
        }
      }

      const descriptorEng = getDemographicDescriptor(gender, ageRange);

      // Extract english keyword from something like "Пляжные волны (Beach Waves)"
      let englishKeyword = keyword;
      const bracketMatch = keyword.match(/\(([^)]+)\)/);
      if (bracketMatch && bracketMatch[1]) {
         englishKeyword = bracketMatch[1];
      }

      let promptEng = "";
      
      let extraColorPrompt = "";
      if (finalColor) {
         extraColorPrompt = ` The person has ${finalColor.toUpperCase()} hair. The hair is STRICTLY AND ABSOLUTELY ${finalColor.toUpperCase()} IN COLOR. Every single hair strand must be 100% ${finalColor.toUpperCase()}. DO NOT mix with any other colors, shades, roots or highlights.`;
      }

      // For english translation of the russian description, we provide a structured request to flux
      let fluxHairDetails = `Hairstyle specs: ${englishKeyword}.`;
      if (hairType) fluxHairDetails += ` Hair Texture: ${translateHairTypeToEng(hairType)}.`;
      if (hairLength) fluxHairDetails += ` Hair Length Constraint: ${translateHairLengthToEng(hairLength)}.`;
      if (hairDensity) {
          fluxHairDetails += ` Hair Density: ${translateHairDensityToEng(hairDensity)}. `;
      }
      
      const hairlineEng = translateHairlineStatusToEng(hairlineStatus, englishKeyword);
      if (hairlineEng) fluxHairDetails += ` Hairline details: ${hairlineEng}`;
      
      const qualityEng = translateHairQualityToEng(hairQuality);
      if (qualityEng) fluxHairDetails += ` Hair characteristics: ${qualityEng}`;

      const agePromptEng = getDetailedAgePromptEng(ageRange || "");
      
      if (!isStudioShot) {
          if (requestedStrength === 0) {
             promptEng = `The exact same face and person from the original image. CRITICAL: PRESERVE THE EXACT FACE, EYES, NOSE, MOUTH, AND FACIAL DETAILS 100% EXPLICITLY UNCHANGED. Keep the exact same hairstyle shape, but change the hair color. ${extraColorPrompt} Keep EVERYTHING ELSE EXACTLY the same: background, clothing, lighting, face, and pose.`;
          } else {
             promptEng = `The exact same person from the original image, with a NEW HAIRSTYLE. ${fluxHairDetails} ${extraColorPrompt} This person is a ${agePromptEng}. CRITICAL: Preserve the exact face structure, eyes, nose, mouth, skin pore details, and facial likeness 100% identical and unchanged. Only modify the hairstyle and color. Keep the same background, clothing, lighting, and pose. Context: ${englishDescription || ""}`;
          }
      } else {
          promptEng = `A photorealistic portrait of a ${descriptorEng} with the exact facial features, face shape, and likeness of the person in the reference image. This person is a ${agePromptEng}. NEW HAIRSTYLE TO APPLY: ${fluxHairDetails} ${extraColorPrompt} Look directly at the camera, clean portrait lighting. Context: ${englishDescription || ""}`;
      }
      
      const translateFaceShape = (val: string) => {
        val = val.toLowerCase();
        if (val.includes("овал")) return "oval";
        if (val.includes("круг") || val.includes("round")) return "round";
        if (val.includes("квадрат")) return "square";
        if (val.includes("сердц")) return "heart-shaped";
        if (val.includes("прямоуг")) return "rectangular";
        if (val.includes("ромб") || val.includes("брилл")) return "diamond";
        return val;
      };
      
      const featuresEng = [];
      if (faceShape && faceShape.length > 2) featuresEng.push(`face shape ${translateFaceShape(faceShape)}`);
      if (skinTone && skinTone.length > 2) featuresEng.push(`skin tone ${skinTone}`);
      if (eyeColor && eyeColor.length > 2) featuresEng.push(`eye color ${translateColor(eyeColor)}`);
      
      if (featuresEng.length > 0) {
        promptEng += ` The person has ${featuresEng.join(', ')}.`;
      }
      
      const englishFacialHair = translateFacialHairToEng(facialHair);
      promptEng += ` Facial hair status: ${englishFacialHair}.`;

      if (!isStudioShot) {
          if (englishClothingContext) {
              promptEng += ` EXACT SAME CLOTHING: ${englishClothingContext}.`;
          }
          if (requestedStrength === 0) {
               promptEng += ` CRITICAL: ONLY change the hair color. Do NOT change the hairstyle. Keep EVERYTHING exactly the same.`;
          } else {
               promptEng += ` CRITICAL: Keep EXACTLY the same background, clothing, environment, and pose as the original image. ONLY modify the hairstyle and color.`;
          }
      } else {
          promptEng += ` CRITICAL: Create a beautiful studio portrait or matching scene. Perfect lighting.`;
      }
      
      promptEng += ` Highly detailed natural skin texture, visible pores, no airbrushing, unretouched, natural skin imperfections. Amateur phone snapshot, high quality raw photography.`;
      
      if (finalColor) {
          promptEng += ` CRITICAL REQUIREMENT: THIS PERSON MUST HAVE ${finalColor.toUpperCase()} HAIR. DO NOT MAKE THE HAIR ANY OTHER COLOR. ${finalColor.toUpperCase()} HAIR ONLY!`;
      }

      // Add high-priority bracketing prefix for hair color to make sure it's strictly observed
      if (finalColor) {
          promptEng = `[STRICTLY AND ABSOLUTELY ${finalColor.toUpperCase()} HAIR COLOR REQUIRED, NO OTHER SHADES OR TONES ALLOWED, 100% COMPLETE HAIR COLOR SOLID COVERAGE] ` + promptEng;
      }

      promptEng = promptEng.substring(0, 1500).trim();

      if (fluxStrength <= 0.05 && targetImageUrl) {
          console.log("Skipping Flux Image-to-Image entirely, directly using targetImageUrl for FaceSwap...");
          finalImageUrl = baseImageForFlux;
      } else {
        try {
          console.log("Generating target blueprint via FAL.AI (Flux Dev Image-to-Image)... strength:", fluxStrength);
          let endpoint = "https://fal.run/fal-ai/flux/dev/image-to-image";
          
          const bodyPayload: any = {
             prompt: promptEng,
             image_url: baseImageForFlux,
             strength: fluxStrength,
             num_inference_steps: 28,
             guidance_scale: 3.5
          };
          
          const fluxRes = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Authorization": `Key ${falKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyPayload)
          });

          if (!fluxRes.ok) {
             const errData = await fluxRes.text();
             throw new Error(`FAL Flux Dev Error HTTP ${fluxRes.status}: ${errData}`);
          }
          
          const fluxData = await fluxRes.json();
          const generatedUrl = fluxData.images?.[0]?.url || fluxData.image?.url || fluxData.image_url || fluxData.url;
          
          if (generatedUrl) {
              finalImageUrl = generatedUrl;
          } else {
              throw new Error(`No image generated by Flux. Payload: ${JSON.stringify(fluxData)}`);
          }
        } catch (e: any) {
          throw e; 
        }
      }

      // Always run FaceSwap to ensure 100% facial feature retention
      try {
         console.log("Starting Virtual Try-On FaceSwap via FAL.AI...");
         const faceSwapPayload = {
           base_image_url: finalImageUrl,
           swap_image_url: selfieImageFull
         };
         console.log("FaceSwap Payload:", JSON.stringify(faceSwapPayload).substring(0, 500) + "... (truncated)");
         
         const falRes = await fetch("https://fal.run/fal-ai/face-swap", {
           method: "POST",
           headers: {
             "Authorization": `Key ${falKey}`,
             "Content-Type": "application/json"
           },
           body: JSON.stringify(faceSwapPayload)
         });

         if (!falRes.ok) {
           const errText = await falRes.text();
           throw new Error(`FAL.AI FaceSwap Error: HTTP ${falRes.status} - ${errText}`);
         }

         const falData = await falRes.json();

         const swapUrl = falData.image?.url || falData.image_url || falData.url;
         if (swapUrl) {
            swappedImageUrl = swapUrl;
         } else {
              throw new Error(`Unexpected FAL.AI FaceSwap output format: ${JSON.stringify(falData)}`);
         }
      } catch (error: any) {
          console.error("FAL VTON failed:", error);
          return res.status(500).json({ 
            error: "Step 2 (FAL.AI Virtual Try-On) failed: " + error.message,
            referenceImage: finalImageUrl 
          });
        }

      // Upload to Firebase Storage to persist
      if (adminStorage && swappedImageUrl) {
         try {
             const bucket = adminStorage.bucket();
             if (bucket.name) {
                 const imageRes = await fetch(swappedImageUrl);
                 if (imageRes.ok) {
                     const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
                     const fileName = `generations/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                     const file = bucket.file(fileName);
                     const uuid = crypto.randomUUID();
                     await file.save(imageBuffer, {
                         metadata: { 
                           contentType: "image/jpeg",
                           metadata: {
                             firebaseStorageDownloadTokens: uuid
                           }
                         }
                     });
                     swappedImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
                 }
             }
         } catch (storageErr: any) {
             console.warn("Storage upload skipped. To enable cloud persistence, ensure Firebase Storage is enabled in the Firebase Console (Build -> Storage). Falling back to temporary image URL.");
             // Fallback to original URL
         }
      }

      // Final success
      logToTelegram(`🎨 <b>Генерация (${req.body.userId || 'unknown'})</b>\nУспешно.`).catch(console.error);
      
      // Save to cache for 30 days
      await setCachedValue(cacheKey, swappedImageUrl, 30 * 24 * 60 * 60);

      res.json({ 
        imageUrl: swappedImageUrl,            // Final processed image (face swapped)
        referenceImage: finalImageUrl,        // Original generation
        debugError: lastError 
      });

    } catch (err: any) {
      console.error("Full pipeline error:", err);
      logToTelegram(`❌ <b>Ошибка Генерации (${req.body.userId || 'unknown'})</b>\n<code>${err.message || 'Pipeline error'}</code>`).catch(console.error);
      res.status(500).json({ error: err.message || "Pipeline error" });
    }
  });

  
generateRouter.post("/generate-ar", async (req, res) => {
    try {
      const { styleKeyword, styleName, features } = req.body;
      if (!styleKeyword || !styleName) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      console.log("Generating final AR text via YandexGPT using cached features...");
      
      let pureFeatures1 = { ...(features || {}) };
      delete pureFeatures1.recommendations;
      const faceDescription = features ? JSON.stringify(pureFeatures1) : "Нет данных о лице (ошибка)";
      
      const systemInstruction = `Ты профессиональный парикмахер. Проанализируй эти особенности лица человека.
Подробно объясни, как стрижка "${styleKeyword}" (${styleName}) будет смотреться на этом конкретном человеке. Напиши 3 пункта: 
- "Персональный анализ": Почему это подойдет или какие нужны адаптации под форму лица.
- "Как просить мастера": Конкретные инструкции для барбера/парикмахера.
- "Уход и укладка": Какие средства использовать каждый день.
Форматируй текст СТРОГО с помощью HTML-тегов (<p>, <strong>, <br>, <ul>, <li>).
НЕ используй синтаксис markdown (никаких \`\`\`html или \`\`\`). Верни ТОЛЬКО готовый HTML код.`;

      let consultationHtml = await callYandexGPT(systemInstruction, `Физические особенности клиента: ${faceDescription}`);
      
      consultationHtml = consultationHtml.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();

      logToTelegram(`👔 <b>Консультация (${req.body.userId || 'unknown'})</b>\nСгенерирована для: ${styleName}`).catch(console.error);

      return res.json({ 
        consultationHtml,
        warning: ""
      });
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || "Ошибка генерации примерки";
      if (typeof errorMsg === "string" && errorMsg.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(errorMsg);
          errorMsg = parsed.error?.message || errorMsg;
        } catch(e) {}
      }
      if (typeof errorMsg === "object") errorMsg = JSON.stringify(errorMsg);

      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("429") ||
          errorMsg.includes("quota") ||
          errorMsg.includes("RESOURCE_EXHAUSTED") ||
          errorMsg.includes("limit: 0"))
      ) {
        errorMsg =
          "Лимит запросов к серверам ИИ временно исчерпан. Пожалуйста, попробуйте сгенерировать гайд немного позже, когда лимиты восстановятся.";
      } else if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("503") ||
          errorMsg.includes("high demand") ||
          errorMsg.includes("UNAVAILABLE") ||
          errorMsg.includes("overloaded"))
      ) {
        errorMsg = "Сервер перегружен (503). Повторите попытку.";
      }

      logToTelegram(`❌ <b>Ошибка Консультации (${req.body.userId || 'unknown'})</b>\n<code>${errorMsg}</code>`).catch(console.error);

      res.status(500).json({ error: errorMsg });
    }
  });

  
generateRouter.post("/chat-stylist", async (req, res) => {
    try {
      const { messages, features, styleName } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Missing or invalid messages array" });
      }

      let pureFeatures = { ...(features || {}) };
      delete pureFeatures.recommendations;
      
      const systemInstruction = `Ты - креативный и опытный звездный стилист-парикмахер. Твоя задача — отвечать на вопросы клиента о его волосах и стиле.
Физические данные клиента: ${JSON.stringify(pureFeatures)}.
Выбранная стрижка для обсуждения: ${styleName ? styleName : 'не указана'}.
Отвечай вежливо, профессионально, давай четкие, практичные советы.
Используй форматирование HTML (<strong>, <em>, <ul>, <li>, <p>, <br>) для лучшей читаемости, так как твой ответ будет вставлен в HTML документ. НЕ используй markdown (например, ** или \`\`\`html). Старайся отвечать лаконично, без лишней воды.`;

      const responseHtml = await callYandexGPTChat(systemInstruction, messages);
      
      let finalHtml = responseHtml.replace(/```html\s*/g, "").replace(/```\s*$/g, "").trim();

      return res.json({ replyHtml: finalHtml });
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({ error: err.message || "Ошибка чата со стилистом" });
    }
  });

  

generateRouter.post("/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64 || !mimeType) {
        return res.status(400).json({ error: "Missing audioBase64 or mimeType" });
      }

      const folderId = process.env.YANDEX_FOLDER_ID;
      const saKey = process.env.YANDEX_SERVICE_ACCOUNT_KEY;
      const geminiApiKey = process.env.GEMINI_API_KEY;

      const cleanMimeType = mimeType.split(";")[0].trim();
      const isOgg = cleanMimeType.includes("ogg") || cleanMimeType.includes("opus");

      // Check if Yandex is not set up, or if this is a webm/mp4 structure that Yandex cannot parse directly
      if (!isOgg || !folderId || !saKey) {
        if (geminiApiKey) {
          console.log("Transcribing via Gemini API for browser compatibility:", cleanMimeType);
          try {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ 
              apiKey: geminiApiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build'
                }
              }
            });

            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: [
                {
                  text: "Преврати аудиозапись в текст. Напиши только распознанный текст на русском языке и ничего больше. Не добавляй никаких пояснений, хэштегов или кавычек."
                },
                {
                  inlineData: {
                    mimeType: cleanMimeType,
                    data: audioBase64
                  }
                }
              ]
            });

            const transcribedText = response.text?.trim() || "";
            return res.json({ text: transcribedText });
          } catch (geminiErr: any) {
            console.error("Gemini fallback STT failed:", geminiErr);
            throw new Error(`Ошибка распознавания аудио: ${geminiErr.message}`);
          }
        } else {
             throw new Error("Yandex SpeechKit не настроен, а GEMINI_API_KEY отсутствует для резервного распознавания.");
        }
      }

      // If it has ogg format, use Yandex SpeechKit
      const cleanFolderId = extractFolderId(folderId);
      const iamToken = await getYandexIamToken(saKey);
      const audioBuffer = Buffer.from(audioBase64, 'base64');

      const url = `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=${cleanFolderId}&lang=ru-RU&format=oggopus`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${iamToken}`,
          "Content-Type": "application/octet-stream"
        },
        body: audioBuffer
      });

      if (!response.ok) {
         const errText = await response.text();
         // If Yandex fails due to format / ogg header issue, try Gemini as safety net
         if ((errText.includes("header") || response.status === 400) && geminiApiKey) {
            console.warn("Yandex STT failed with 400. Trying Gemini API fallback...");
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ 
              apiKey: geminiApiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build'
                }
              }
            });
            const fallbackResponse = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: [
                { text: "Преврати аудиозапись в текст. Напиши только распознанный текст на русском языке и ничего больше." },
                { inlineData: { mimeType: cleanMimeType, data: audioBase64 } }
              ]
            });
            const textResult = fallbackResponse.text?.trim() || "";
            return res.json({ text: textResult });
         }
         throw new Error(`Ошибка Yandex SpeechKit STT (HTTP ${response.status}): ${errText}`);
      }

      const data = await response.json();
      const transcribedText = data.result || "";
      return res.json({ text: transcribedText });
    } catch (err: any) {
      console.error("Transcribe error:", err);
      res.status(500).json({ error: err.message || "Ошибка транскрибации" });
    }
});
