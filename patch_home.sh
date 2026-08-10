#!/bin/bash
sed -i '226s/{!imageBase64 && (/{!imageBase64 \&\& !isProMode \&\& (/g' src/components/HomePage.tsx
sed -i '260s/{!imageBase64 && (/{!imageBase64 \&\& !isProMode \&\& (/g' src/components/HomePage.tsx
