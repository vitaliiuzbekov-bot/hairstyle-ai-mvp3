#!/bin/bash
awk '
BEGIN { skip=0 }
/{\/\*/ { skip=1 }
/<\/p>/ && skip==1 { skip=0; next }
/<\/div>/ && skip==0 { print; next }
{ if(!skip) print }
' src/components/BuyModal.tsx > tmp.tsx && mv tmp.tsx src/components/BuyModal.tsx
