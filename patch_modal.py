import re

with open("src/components/HaircutLibraryModal.tsx", "r") as f:
    content = f.read()

# Add useEffect import
if "useEffect" not in content:
    content = content.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";')

# Define state and fetch logic
fetch_logic = '''
  const [communityStyles, setCommunityStyles] = useState<any[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingCommunity(true);
      fetch("/api/community")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCommunityStyles(data);
        })
        .catch(err => console.error("Failed to load community styles", err))
        .finally(() => setIsLoadingCommunity(false));
    }
  }, [isOpen]);

  const baseLibrary = currentGender === "female" ? FEMALE_LIBRARY : MALE_LIBRARY;
  
  // Format community styles to match library schema
  const formattedCommunity = communityStyles
    .filter(style => style.gender === currentGender)
    .map(style => ({
      name: style.keyword,
      description: "Сгенерировано пользователем",
      category: "community" as HaircutCategory,
      imageKeyword: style.keyword,
      gender: style.gender,
      imageUrl: style.imageUrl
    }));
    
  const library = [...baseLibrary, ...formattedCommunity];
  
  const categories = ["short", "medium", "long", "creative", "community"] as HaircutCategory[];
  const EXTENDED_LABELS = { ...CATEGORY_LABELS, community: "Недавние (Топ)" };
'''

old_vars = '''  if (!isOpen) return null;

  const library = currentGender === "female" ? FEMALE_LIBRARY : MALE_LIBRARY;'''

content = content.replace(old_vars, fetch_logic)

# Replace the categories mapping
old_cat_map = '{(["short", "medium", "long", "creative"] as HaircutCategory[]).map(cat => ('
new_cat_map = '{categories.map(cat => ('
content = content.replace(old_cat_map, new_cat_map)

# Replace CATEGORY_LABELS with EXTENDED_LABELS
content = content.replace('{CATEGORY_LABELS[cat]}', '{EXTENDED_LABELS[cat]}')

with open("src/components/HaircutLibraryModal.tsx", "w") as f:
    f.write(content)
