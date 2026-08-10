#!/bin/bash
sed -i 's/<UploadZone/<UploadZone isProMode={isProMode}/g' src/components/HomePage.tsx
