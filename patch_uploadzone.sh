#!/bin/bash
sed -i 's/interface UploadZoneProps {/interface UploadZoneProps {\n  isProMode?: boolean;/g' src/components/UploadZone.tsx
sed -i 's/const UploadZoneComponent: React.FC<UploadZoneProps> = ({/const UploadZoneComponent: React.FC<UploadZoneProps> = ({\n  isProMode,/g' src/components/UploadZone.tsx
sed -i 's/{!results &&/{\!isProMode \&\& \!results \&\&/g' src/components/UploadZone.tsx
sed -i 's/{!isProMode \&\& \!results \&\& \!error \&\& (/{!results \&\& \!error \&\& (/g' src/components/UploadZone.tsx
sed -i 's/isAnalyzing\n                          ? "Нейросеть в работе..."\n                          : "Подобрать стрижку"/isAnalyzing\n                          ? "Нейросеть в работе..."\n                          : isProMode ? "Подобрать стрижку (PRO)" : "Подобрать стрижку"/g' src/components/UploadZone.tsx
