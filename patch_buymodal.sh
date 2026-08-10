#!/bin/bash
sed -i 's|import { useModalBackButton } from "../hooks/useTelegramBackButton";|import { useModalBackButton } from "../hooks/useTelegramBackButton";\nimport { useAnalysisContext } from "../hooks/useAnalysis";|g' src/components/BuyModal.tsx

sed -i 's|useModalBackButton(showBuyModal, () => setShowBuyModal(false));|useModalBackButton(showBuyModal, () => setShowBuyModal(false));\n  const { isProMode } = useAnalysisContext();|g' src/components/BuyModal.tsx

sed -i 's|<p className={`text-\[12px\] mt-4 font-medium px-2 leading-relaxed ${isLightMode ? '\''text-gray-700'\'' : '\''text-white/80'\''}`}>|<p className={`text-[12px] mt-4 font-medium px-2 leading-relaxed ${isLightMode ? '\''text-gray-700'\'' : '\''text-white/80'\''}`}>\n            {isProMode ? "С невероятной точностью. Получите детальный PDF-гайд со схемами, параметрами окрашивания и подробным мудбордом для вашего клиента." : "Магия трансформации! Выбирайте новые стили, смотрите как они выглядят на вас, и сохраняйте лучшие варианты."}\n          </p>\n          {/*|g' src/components/BuyModal.tsx

