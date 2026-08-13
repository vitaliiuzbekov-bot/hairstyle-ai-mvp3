import os

with open("src/server/routes/reference.ts", "r") as f:
    ref_content = f.read()

# Add adminDb import if not exists
if 'adminDb' not in ref_content:
    ref_content = ref_content.replace('import { Router, Request, Response } from "express";', 'import { Router, Request, Response } from "express";\nimport { adminDb } from "../firebase";')

# Save to community_library when generating new reference
old_save = '      const imageUrl = await generateReference(prompt);\n      await setCachedValue(cacheKey, imageUrl, 30 * 24 * 60 * 60);\n      return imageUrl;'
new_save = '''      const imageUrl = await generateReference(prompt);
      await setCachedValue(cacheKey, imageUrl, 30 * 24 * 60 * 60);
      
      // Save to community library
      if (!isLibrary && adminDb) {
        try {
          await adminDb.collection("community_library").add({
            keyword: keyword || "Кастомная стрижка",
            gender: gender || "female",
            imageUrl: imageUrl,
            createdAt: Date.now()
          });
        } catch (e) {
          console.error("Failed to save to community library", e);
        }
      }
      
      return imageUrl;'''

ref_content = ref_content.replace(old_save, new_save)

# Add new GET endpoint for community library
if 'referenceRouter.get("/community"' not in ref_content:
    community_endpoint = '''
referenceRouter.get("/community", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!adminDb) {
      res.json([]);
      return;
    }
    const snapshot = await adminDb.collection("community_library")
      .orderBy("createdAt", "desc")
      .limit(30)
      .get();
      
    const styles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter duplicates by keyword
    const uniqueStyles = [];
    const seenKeywords = new Set();
    for (const style of styles) {
      if (!seenKeywords.has(style.keyword.toLowerCase())) {
        seenKeywords.add(style.keyword.toLowerCase());
        uniqueStyles.push(style);
      }
    }
    res.json(uniqueStyles);
  } catch (err) {
    console.error("Error fetching community library:", err);
    res.status(500).json({ error: "Ошибка загрузки библиотеки сообщества" });
  }
});
'''
    ref_content += community_endpoint

with open("src/server/routes/reference.ts", "w") as f:
    f.write(ref_content)
