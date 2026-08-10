#!/bin/bash
sed -i 's/<FaceShapeCard results={results} isLightMode={isLightMode} \/>/{isProMode \&\& <FaceShapeCard results={results} isLightMode={isLightMode} \/>}/g' src/components/AnalysisResults.tsx
sed -i 's/<TrichologyCard results={results} isLightMode={isLightMode} \/>/{isProMode \&\& <TrichologyCard results={results} isLightMode={isLightMode} \/>}/g' src/components/AnalysisResults.tsx
