const isMale = true;
const ageProps = "age around 30";
const faceProps = "Face shape: oval. ";
const colorProps = "Hair color: black. ";
const eyeProps = "Eye color: brown. ";
const skinProps = "Skin tone: fair. ";
const hairDensProps = "Hair density: very sparse stubble. ";
const hairlineProps = "Hairline: low short stubble hairline. ";
const beardProps = "Clean shaven face. ";
const extraBaldInjunction = "CRITICAL INSTRUCTION: STYLED COMPACT BUZZ CUT. NO PUFFY OR VOLUMINOUS HAIR ON TOP. NO LONG HAIR. СТРИЖКА СВЕРХКОРОТКАЯ, НЕТ НИКАКОГО ОБЪЕМА НА ГОЛОВЕ. ";
const finalKeyword = "ultra-short buzz cut, head shaved under clipper 0.5mm, neat thin stubble, extremely short close taper fade, absolutely no hair volume, hair is flat against skin, ультракороткая мужская стрижка ежик под ноль машинкой";

const prompt = `Hyper-realistic, unedited, authentic amateur smartphone selfie of an ordinary ${isMale ? 'man' : 'woman'}. ${ageProps}. ${faceProps}${colorProps}${eyeProps}${skinProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Hairstyle: ${finalKeyword}. Typical indoor room lighting or natural window light, asymmetric raw facial features, natural uneven skin texture with visible pores and slight blemishes. NOT a professional model, very casual daily look, no airbrushing, no studio lighting, completely raw unretouched photo. Cannot look like a GQ or Vogue model.`;

console.log(prompt.length);
