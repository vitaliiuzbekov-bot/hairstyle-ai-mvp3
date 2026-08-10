#!/bin/bash
sed -i 's/{isProMode && <FaceShapeCard results={results} isLightMode={isLightMode} \/>}/{\!isProMode \&\& <FaceShapeCard results={results} isLightMode={isLightMode} \/>}/g' src/components/AnalysisResults.tsx
sed -i 's/{isProMode && <TrichologyCard results={results} isLightMode={isLightMode} \/>}//g' src/components/AnalysisResults.tsx
