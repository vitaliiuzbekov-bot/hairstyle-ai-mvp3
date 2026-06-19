import React from "react";
import { Sparkles, Send, Download, FileDown, ShoppingBag, Share2 } from "lucide-react";
import { RotatingFactsLoader } from "./RotatingFactsLoader";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { CachedImage } from "./CachedImage";
import { downloadImage } from "../utils/downloadImage";
import { shareResult } from "../utils/shareResult";
import { generateCollage } from "../utils/collage";

const COLOR_BRANDS: Record<string, {name: string, shade: string}[]> = {
  "Блонд": [{name: "L'Oreal Professionnel", shade: "Majirel 10.1"}, {name: "Wella Koleston", shade: "10/16"}],
  "Русый": [{name: "Matrix Socolor", shade: "7A"}, {name: "Redken Shades EQ", shade: "07N"}],
  "Светло-каштановый": [{name: "L'Oreal Professionnel", shade: "Majirel 6.0"}, {name: "Wella Koleston", shade: "6/0"}],
  "Каштановый": [{name: "L'Oreal Professionnel", shade: "Majirel 5.0"}, {name: "Wella Koleston", shade: "5/0"}],
  "Черный": [{name: "Wella Koleston", shade: "2/0"}, {name: "Matrix Socolor", shade: "1A"}],
  "Рыжий": [{name: "Matrix Socolor", shade: "7C"}, {name: "L'Oreal Professionnel", shade: "Majirel 7.4"}],
  "Седой": [{name: "L'Oreal Professionnel", shade: "Silver"}, {name: "Redken Shades EQ", shade: "09T"}]
};

interface VTONPreviewSectionProps {
  tryOnStyle: any;
  vtonResultUrl: string | null;
  loadingVTONStyles: Record<string, boolean>;
  vtonError: string | null;
  isLightMode?: boolean;
  isTeaserResult?: boolean;
  customHairColor: string | null;
  resultsHairColor?: string;
  loadedReferenceUrl: string | null;
  imageUrl: string | null;
  imageBase64: string | null;
  mimeType: string | null;
  userRole?: string | null;
  salonName?: string;
  processPayment: (s: string, v: number, v2: number) => void;
  setCustomHairColor: (val: string | null) => void;
  generateVirtualTryOn: (kw: string, name: string, desc: string, customColor: string | null, imgUrl?: string) => void;
  setChatStyleName: (val: string) => void;
  setIsChatOpen: (val: boolean) => void;
  resultRef: React.RefObject<HTMLDivElement>;
  vtonStrength?: number;
  setVtonStrength?: (val: number) => void;
}

export const VTONPreviewSection: React.FC<VTONPreviewSectionProps> = ({
  tryOnStyle,
  vtonResultUrl,
  loadingVTONStyles,
  vtonError,
  isLightMode,
  isTeaserResult,
  customHairColor,
  resultsHairColor,
  loadedReferenceUrl,
  imageUrl,
  imageBase64,
  mimeType,
  userRole,
  salonName,
  processPayment,
  setCustomHairColor,
  generateVirtualTryOn,
  setChatStyleName,
  setIsChatOpen,
  resultRef,
  vtonStrength,
  setVtonStrength,
}) => {
  return (
    <div ref={resultRef} className={`flex flex-col gap-3 flex-1`}>
      {!vtonResultUrl && !loadingVTONStyles[tryOnStyle.imageKeyword || tryOnStyle.name] && (
        <div className={`flex-1 min-h-[300px] rounded-2xl border flex flex-col items-center justify-center p-8 text-center ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isLightMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'}`}>
            <Sparkles size={28} />
          </div>
          <h5 className={`font-medium mb-2 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Примерьте этот стиль</h5>
          <p className={`text-sm mb-6 max-w-sm ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>
            Сгенерируйте фотореалистичный результат с вашим лицом. Нейросеть адаптирует прическу под ваши черты.
          </p>

          <button
            type="button"
            onClick={async (e) => {
                e.preventDefault();
                generateVirtualTryOn(
                  tryOnStyle.imageKeyword || tryOnStyle.name,
                  tryOnStyle.name,
                  tryOnStyle.description,
                  customHairColor,
                  tryOnStyle.customImageUrl || loadedReferenceUrl || (tryOnStyle as any).imageUrl || undefined
                );
              }
            }
            className={`relative w-full max-w-xs font-bold py-4 sm:py-5 px-6 flex items-center justify-center gap-3 transition-all duration-500 text-sm sm:text-base rounded-[1.25rem] overflow-hidden group focus:ring-4 focus:ring-blue-500/50 ${isLightMode ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-[0.98]' : 'bg-white text-black hover:bg-gray-100 shadow-md active:scale-[0.98]'}`}
          >
             <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
             <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={18} fill="currentColor" />
                📸 Показать на мне
             </span>
          </button>
          {vtonError && (
            <p className="mt-4 text-xs text-orange-200/90 bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-lg max-w-xs">
              {vtonError}
            </p>
          )}
        </div>
      )}

      {loadingVTONStyles[tryOnStyle.imageKeyword || tryOnStyle.name] && (
        <div className={`flex-1 min-h-[300px] rounded-2xl border flex flex-col items-center justify-center p-8 ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
          <RotatingFactsLoader isLightMode={isLightMode} title="Примерка стиля..." />
        </div>
      )}

      {vtonResultUrl && !isTeaserResult && (
        <div className={`mb-4 border rounded-2xl p-3 sm:p-4 relative group flex flex-col items-center ${isLightMode ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
           <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
             <BeforeAfterSlider 
               beforeImage={imageUrl || (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`)}
               afterImage={vtonResultUrl}
             />
           </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
             <button 
               onClick={async (e) => {
                  e.stopPropagation();
                  try {
                     const beforeSrc = imageUrl || (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`);
                     const collageDataUrl = await generateCollage(beforeSrc, vtonResultUrl, userRole === 'salon' ? salonName : undefined);
                     
                     const messageText = "Привет! Смотри, какой стиль я подобрал(а) в нейросети. Хочу такую стрижку и цвет!\nСоздано в @neirostilist_bot";

                     if (navigator.share) {
                        try {
                           const res = await fetch(collageDataUrl);
                           const blob = await res.blob();
                           const file = new File([blob], "neurostylist_collage.jpg", { type: "image/jpeg" });
                           await navigator.share({
                              title: "Мой новый стиль от НейроСтилиста",
                              text: messageText,
                              files: [file]
                           });
                        } catch (e) {
                           downloadImage(collageDataUrl, "ai_collage.jpg");
                        }
                     } else {
                        downloadImage(collageDataUrl, "ai_collage.jpg");
                        const tg = window.Telegram?.WebApp;
                        if (tg && tg.openTelegramLink) {
                          tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent("https://t.me/neirostilist_bot")}&text=${encodeURIComponent(messageText)}`);
                        }
                     }
                  } catch (err) {
                     console.error("Collage error", err);
                  }
               }}
               className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100' : 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30'}`}
             >
                <Send size={16} />
                <span>Отправить мастеру</span>
             </button>
             <button 
               onClick={(e) => {
                  e.stopPropagation();
                  setChatStyleName(tryOnStyle?.name || tryOnStyle?.ru);
                  setIsChatOpen(true);
               }}
               className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'}`}
             >
                <Sparkles size={16} />
                <span>Спросить Стилиста</span>
             </button>
             <button 
               onClick={async (e) => {
                  e.stopPropagation();
                  try {
                     const beforeSrc = imageUrl || `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
                     const collageDataUrl = await generateCollage(beforeSrc, vtonResultUrl, userRole === 'salon' ? salonName : undefined);
                     downloadImage(collageDataUrl, "ai_collage.jpg");
                  } catch (err) {
                     console.error("Collage download error", err);
                  }
               }}
               className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'}`}
             >
                <FileDown size={16} />
                <span>Коллаж</span>
             </button>
             <div className="flex gap-2">
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     shareResult(vtonResultUrl);
                   }}
                   className={`flex-1 sm:w-12 py-3 sm:py-0 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                   title="Поделиться фото"
                 >
                   <Share2 size={16} className="sm:mx-auto" />
                   <span className="sm:hidden">Поделиться</span>
                 </button>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     downloadImage(vtonResultUrl, "ai_result.jpg");
                   }}
                   className={`flex-1 sm:w-12 py-3 sm:py-0 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                   title="Скачать фото"
                 >
                   <Download size={16} className="sm:mx-auto" />
                   <span className="sm:hidden">Скачать</span>
                 </button>
             </div>
          </div>
        </div>
      )}

      {vtonResultUrl && isTeaserResult && (
        <div className={`mb-4 relative rounded-2xl overflow-hidden border ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-white/10'}`}>
           <div className="relative aspect-[3/4] w-full flex items-center justify-center">
              <CachedImage src={vtonResultUrl || undefined as any} alt="Blurred Result" className="absolute inset-0 object-cover blur-xl opacity-70 scale-110 pointer-events-none" style={{ width: '100%', height: '100%' }} />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                 <span className="text-white/60 font-bold text-xl sm:text-2xl rotate-[-15deg] uppercase tracking-wider drop-shadow-xl select-none">
                   https://t.me/neirostilist_bot
                 </span>
              </div>
              
              <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
                 <button 
                   onClick={(e) => {
                      e.stopPropagation();
                      processPayment("popular", 199, 3);
                   }}
                   className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex flex-col items-center gap-1 active:scale-95 border border-white/20"
                 >
                    <span className="text-[16px] drop-shadow-md text-center">Убрать блюр и примерить ещё 2 варианта — 199 ⭐</span>
                 </button>
              </div>
           </div>
        </div>
      )}
      
      {vtonResultUrl && (customHairColor || resultsHairColor) && COLOR_BRANDS[customHairColor || resultsHairColor || ""] && !isTeaserResult && (
        <div className={`mb-4 border rounded-2xl p-4 ${isLightMode ? 'bg-purple-50/50 border-purple-200' : 'bg-purple-500/10 border-purple-500/20'}`}>
          <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${isLightMode ? 'text-purple-700' : 'text-purple-200'}`}>
            <ShoppingBag size={16} /> Формула цвета: {customHairColor || resultsHairColor}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COLOR_BRANDS[customHairColor || resultsHairColor || ""].map((brand, bIdx) => (
              <div key={bIdx} className={`border rounded-xl p-3 flex justify-between items-center ${isLightMode ? 'bg-white/80 border-purple-100' : 'bg-white/5 border-white/10'}`}>
                <span className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-white/80'}`}>{brand.name}</span>
                <span className={`text-sm font-mono px-2 py-1 rounded-md ${isLightMode ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-300'}`}>{brand.shade}</span>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};
