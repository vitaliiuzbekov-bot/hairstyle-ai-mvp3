#!/bin/bash
sed -i '/{\/\* Vitals \*\//,/{\/\* Recommendations \*\//c\
          {/* Recommendations */}' src/components/AnalysisResults.tsx
