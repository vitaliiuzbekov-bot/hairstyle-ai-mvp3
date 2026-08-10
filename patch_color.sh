#!/bin/bash
sed -i '/{\/\* Color Change Only \*\//,/^\s*\/>/d' src/components/AnalysisResults.tsx
