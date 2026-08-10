#!/bin/bash
sed -i 's/<BlueprintTechnicalDetails/isProMode \&\& <BlueprintTechnicalDetails/g' src/components/BarberBlueprintModal.tsx
