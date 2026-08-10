#!/bin/bash

# Step 2 & 3: RecommendationCard & VTONPreviewSection
# Hide vtonStrength slider from normal users
sed -i 's/<div className="w-full flex items-center gap-4">/{isProMode \&\& <div className="w-full flex items-center gap-4">/g' src/components/VTONPreviewSection.tsx
sed -i 's/<span className={`w-12 text-right text-xs font-mono/<span className={`w-12 text-right text-xs font-mono/g' src/components/VTONPreviewSection.tsx
# Need a more precise replacement for vtonStrength:
