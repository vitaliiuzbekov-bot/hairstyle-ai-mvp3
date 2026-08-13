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
    'let prompt = `Candid front-facing portrait photo of a ${isMale ? \'man\' : \'woman\'}. ${ageProps}. ${faceProps}${colorProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Style: ${finalKeyword}. Natural window light, real skin texture with visible pores and slight imperfections, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look, hands not visible, no phone in frame.`;',
    'let prompt = `Raw, unedited amateur photograph of a ${isMale ? \'man\' : \'woman\'}. ${ageProps}. ${faceProps}${colorProps}${hairDensProps}${hairlineProps}${beardProps} ${extraBaldInjunction}Style: ${finalKeyword}. Captured on 35mm film, natural uneven skin texture, visible pores, slight skin imperfections, candid snapshot, everyday life photo, not a studio shoot, zero retouching, highly realistic, hands not visible.`;'
)

# Patch generate.ts
replace_in_file("src/server/routes/generate.ts",
    'Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI to generate a candid, unretouched portrait with a specific hairstyle. CRITICAL: The image MUST look like a casual everyday photo, with natural lighting, real skin texture (pores, slight imperfections), and NO studio lighting. Avoid CGI or plastic look. DO NOT include hands or phones in the frame.',
    'Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI to generate a candid, unretouched photograph with a specific hairstyle. CRITICAL: The image MUST look like a casual everyday snapshot taken on 35mm film, with natural lighting, raw skin texture (pores, slight imperfections), and NO studio lighting. Avoid CGI or plastic look. DO NOT include hands, phones, or cameras in the frame.'
)

replace_in_file("src/server/routes/generate.ts",
    'promptEng = `Candid front-facing portrait photo of a person. Age: ${ageRange || "unknown"}, Gender: ${gender || "unknown"}. New Hairstyle: ${mappedKw} - ${description || ""}. Desired Hair Color: ${finalColor || "original"}. Natural window light, real skin texture with visible pores and slight imperfections, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look, hands not visible, no phone in frame.`;',
    'promptEng = `Raw, unedited amateur photograph of a person. Age: ${ageRange || "unknown"}, Gender: ${gender || "unknown"}. New Hairstyle: ${mappedKw} - ${description || ""}. Desired Hair Color: ${finalColor || "original"}. Captured on 35mm film, natural uneven skin texture, visible pores, slight skin imperfections, candid snapshot, everyday life photo, not a studio shoot, zero retouching, highly realistic, hands not visible.`;'
)

