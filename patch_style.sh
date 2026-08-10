#!/bin/bash
sed -i '/{\/\* Style Selection \*\//,/{\/\* Action Button \*\//d' src/components/UploadZone.tsx
