#!/bin/bash
sed -i 's/{\!isProMode \&\& <FaceShapeCard results={results} isLightMode={isLightMode} \/>}//g' src/components/AnalysisResults.tsx
