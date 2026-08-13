import re

def replace_in_file(filename, old_str, new_str):
    with open(filename, "r") as f:
        content = f.read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(filename, "w") as f:
            f.write(content)
        print(f"Patched {filename}")
    else:
        print(f"Could not find old_str in {filename}")

# Patch reference.ts
replace_in_file("src/server/routes/reference.ts",
    'let prompt = `Amateur smartphone selfie photo of a ${isMale ? \'man\' : \'woman\'}. ${ageProps}. ${faceProps}${colorProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Style: ${finalKeyword}. Shot on iPhone 12, natural window light, real skin texture with visible pores and slight imperfections, candid photography, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look.`;',
    'let prompt = `Candid front-facing portrait photo of a ${isMale ? \'man\' : \'woman\'}. ${ageProps}. ${faceProps}${colorProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Style: ${finalKeyword}. Natural window light, real skin texture with visible pores and slight imperfections, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look, hands not visible, no phone in frame.`;'
)

# Patch reference.ts negative prompt
with open("src/server/routes/reference.ts", "r") as f:
    content = f.read()
if 'let negativePrompt = "professional, studio lighting' in content:
    content = content.replace('let negativePrompt = "professional, studio lighting', 'let negativePrompt = "holding phone, phone in frame, hand, mirror selfie, camera, professional, studio lighting')
    with open("src/server/routes/reference.ts", "w") as f:
        f.write(content)

# Patch generate.ts
replace_in_file("src/server/routes/generate.ts",
    'Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI to generate an amateur, unretouched smartphone selfie with a specific hairstyle. CRITICAL: The image MUST look like a casual iPhone photo, with natural lighting, real skin texture (pores, slight imperfections), and NO studio lighting. Avoid CGI or plastic look.',
    'Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI to generate a candid, unretouched portrait with a specific hairstyle. CRITICAL: The image MUST look like a casual everyday photo, with natural lighting, real skin texture (pores, slight imperfections), and NO studio lighting. Avoid CGI or plastic look. DO NOT include hands or phones in the frame.'
)

replace_in_file("src/server/routes/generate.ts",
    'promptEng = `Amateur smartphone selfie photo of a person. Age: ${ageRange || "unknown"}, Gender: ${gender || "unknown"}. New Hairstyle: ${mappedKw} - ${description || ""}. Desired Hair Color: ${finalColor || "original"}. Shot on iPhone 12, natural window light, real skin texture with visible pores and slight imperfections, candid photography, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look.`;',
    'promptEng = `Candid front-facing portrait photo of a person. Age: ${ageRange || "unknown"}, Gender: ${gender || "unknown"}. New Hairstyle: ${mappedKw} - ${description || ""}. Desired Hair Color: ${finalColor || "original"}. Natural window light, real skin texture with visible pores and slight imperfections, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look, hands not visible, no phone in frame.`;'
)

# Also fix the telegram.ts close method TS error
with open("src/utils/telegram.ts", "r") as f:
    tg_content = f.read()

tg_content = tg_content.replace('tg.close();', '(tg as any).close();')
with open("src/utils/telegram.ts", "w") as f:
    f.write(tg_content)

