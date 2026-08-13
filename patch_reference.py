import re

with open("src/server/routes/reference.ts", "r") as f:
    content = f.read()

content = content.replace('"v2_" + getCacheKey', '"v4_raw_" + getCacheKey')

old_ageProps = 'const ageProps = "beautiful young adult around 25 years old, flawless glowing skin, perfect complexion, studio lighting, photorealistic, attractive";'
new_ageProps = 'const ageProps = "around 25 years old";'
content = content.replace(old_ageProps, new_ageProps)

old_faceProps = 'const faceProps = "Symmetrical, highly attractive beautiful face. ";'
new_faceProps = 'const faceProps = "Natural, candid face. ";'
content = content.replace(old_faceProps, new_faceProps)

old_prompt = 'let prompt = `Professional salon portrait photo of a highly attractive ${isMale ? \'man\' : \'woman\'}. ${ageProps}. ${faceProps}${colorProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Style: ${finalKeyword}. High-end fashion editorial photography, flawless lighting, photorealistic, cinematic, highly detailed, beautiful benchmark hairstyle.`;'
new_prompt = 'let prompt = `Amateur smartphone selfie photo of a ${isMale ? \'man\' : \'woman\'}. ${ageProps}. ${faceProps}${colorProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Style: ${finalKeyword}. Shot on iPhone 12, natural window light, real skin texture with visible pores and slight imperfections, candid photography, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look.`;'
content = content.replace(old_prompt, new_prompt)

with open("src/server/routes/reference.ts", "w") as f:
    f.write(content)
