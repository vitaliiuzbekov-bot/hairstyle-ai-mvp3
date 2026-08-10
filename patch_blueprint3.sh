#!/bin/bash
sed -i 's/isProMode \&\& <BlueprintTechnicalDetails/{isProMode \&\& <BlueprintTechnicalDetails/g' src/components/BarberBlueprintModal.tsx
sed -i '141s/\/>/\/>}/' src/components/BarberBlueprintModal.tsx
