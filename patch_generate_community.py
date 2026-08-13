import re

with open("src/server/routes/generate.ts", "r") as f:
    content = f.read()

old_save = '''                finalImageUrl = uploadedUrl;
                customBlueprintCache.set(blueprintCacheKey, uploadedUrl);'''

new_save = '''                finalImageUrl = uploadedUrl;
                customBlueprintCache.set(blueprintCacheKey, uploadedUrl);
                
                // Save to community library for others to see
                if (adminDb && keyword && keyword.length > 2 && fluxStrength > 0.05) {
                    adminDb.collection("community_library").add({
                        keyword: keyword,
                        gender: gender || "female",
                        imageUrl: uploadedUrl,
                        createdAt: Date.now()
                    }).catch(e => console.error("Failed to save to community library", e));
                }'''

content = content.replace(old_save, new_save)

with open("src/server/routes/generate.ts", "w") as f:
    f.write(content)
