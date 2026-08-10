#!/bin/bash
sed -i 's/const BarberBlueprintModal: React.FC<BarberBlueprintModalProps> = ({/const BarberBlueprintModal: React.FC<BarberBlueprintModalProps> = ({\n/g' src/components/BarberBlueprintModal.tsx
