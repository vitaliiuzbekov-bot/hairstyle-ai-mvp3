#!/bin/bash
sed -i 's/<\/p>\n          <\/div>/<\/p>\n          <\/div>}/g' src/components/Header.tsx
# The issue is {false && <div ...> </div>
