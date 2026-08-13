import re

with open("src/server/routes/generate.ts", "r") as f:
    content = f.read()

# Bust cache for generate
content = content.replace('"v3_force_update_" + getCacheKey', '"v4_realism_" + getCacheKey')

old_system = 'Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI (e.g., Flux) to change a person\'s hairstyle in an image.'
new_system = 'Your task is to write a highly detailed, photorealistic prompt for a text-to-image AI to generate an amateur, unretouched smartphone selfie with a specific hairstyle. CRITICAL: The image MUST look like a casual iPhone photo, with natural lighting, real skin texture (pores, slight imperfections), and NO studio lighting. Avoid CGI or plastic look.'
content = content.replace(old_system, new_system)

old_fallback = 'promptEng = `A photorealistic portrait of a person. Age: ${ageRange || "unknown"}, Gender: ${gender || "unknown"}. New Hairstyle: ${mappedKw} - ${description || ""}. Desired Hair Color: ${finalColor || "original"}. The face features must remain exactly the same.`;'
new_fallback = 'promptEng = `Amateur smartphone selfie photo of a person. Age: ${ageRange || "unknown"}, Gender: ${gender || "unknown"}. New Hairstyle: ${mappedKw} - ${description || ""}. Desired Hair Color: ${finalColor || "original"}. Shot on iPhone 12, natural window light, real skin texture with visible pores and slight imperfections, candid photography, unretouched, highly realistic, everyday life photo, not a studio shoot, avoiding plastic look.`;'
content = content.replace(old_fallback, new_fallback)

with open("src/server/routes/generate.ts", "w") as f:
    f.write(content)
