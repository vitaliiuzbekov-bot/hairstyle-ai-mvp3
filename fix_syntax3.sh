#!/bin/bash
sed -i 's/parsedResults.recommendations = lib.slice(0, 4).map(h => ({ name: h.name, imageKeyword: h.imageKeyword, description: h.description, matchScore: 90 }));/parsedResults.recommendations = lib.slice(0, 4).map(h => ({ name: h.name, imageKeyword: h.name, description: h.description, stylingTips: h.stylingTips }));/g' src/hooks/useAnalysis.ts
