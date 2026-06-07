import React from "react";
import { Scissors, X, Zap, Sparkles, FileDown, Send, Download, ShoppingBag } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { downloadImage } from "../utils/downloadImage";
import { shareResult } from "../utils/shareResult";
import { generateCollage } from "../utils/collage";
import { AnalysisResult } from "../types";
import { RotatingFactsLoader } from "./RotatingFactsLoader";

const COLOR_BRANDS: Record<string, {name: string, shade: string}[]> = {
  "Блонд": [{name: "L'Oreal Professionnel", shade: "Majirel 10.1"}, {name: "Wella Koleston", shade: "10/16"}],
  "Русый": [{name: "Matrix Socolor", shade: "7A"}, {name: "Redken Shades EQ", shade: "07N"}],
  "Каштановый": [{name: "L'Oreal Professionnel", shade: "Majirel 5.0"}, {name: "Wella Koleston", shade: "5/0"}],
  "Черный": [{name: "Wella Koleston", shade: "2/0"}, {name: "Matrix Socolor", shade: "1A"}],
  "Рыжий": [{name: "Matrix Socolor", shade: "7C"}, {name: "L'Oreal Professionnel", shade: "Majirel 7.4"}],
  "Седой": [{name: "L'Oreal Professionnel", shade: "Silver"}, {name: "Redken Shades EQ", shade: "09T"}]
};

interface BarberBlueprintModalProps {
  tryOnStyle: any;
  setTryOnStyle: (val: any) => void;
  results: AnalysisResult | null;
  imageUrl: string | null;
  mimeType: string | null;
  imageBase64: string | null;
  styleConsultations: Record<string, string>;
  loadingARStyles: Record<string, boolean>;
  arError: string | null;
  vtonResultUrl?: string | null;
  isTeaserResult?: boolean;
  processPayment: (s: string, v: number, v2: number) => void;
  customHairColor: string | null;
  setCustomHairColor: (val: string | null) => void;
  vtonStrength: number;
  setVtonStrength: (val: number) => void;
  generateARPreview: (kw: string, name: string) => void;
  exportToPDF: () => void;
  isExportingPDF: boolean;
  userRole?: string | null;
  salonName?: string;
  setChatStyleName: (val: string) => void;
  setIsChatOpen: (val: boolean) => void;
  loadingVTONStyles: Record<string, boolean>;
  generateVirtualTryOn: (kw: string, name: string, desc: string, customColor: string | null, imgUrl?: string) => void;
  vtonError: string | null;
  isLightMode?: boolean;
}

export const BarberBlueprintModal: React.FC<BarberBlueprintModalProps> = ({
  tryOnStyle,
  setTryOnStyle,
  results,
  imageUrl,
  mimeType,
  imageBase64,
  styleConsultations,
  loadingARStyles,
  arError,
  vtonResultUrl,
  isTeaserResult,
  processPayment,
  customHairColor,
  setCustomHairColor,
  vtonStrength,
  setVtonStrength,
  generateARPreview,
  exportToPDF,
  isExportingPDF,
  userRole,
  salonName,
  setChatStyleName,
  setIsChatOpen,
  loadingVTONStyles,
  generateVirtualTryOn,
  vtonError,
  isLightMode,
}) => {
  const [loadedReferenceUrl, setLoadedReferenceUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoadedReferenceUrl(null);
  }, [tryOnStyle]);

  if (!tryOnStyle) return null;
  return (
    <div className={`fixed inset-0 z-[100] flex sm:items-center sm:justify-center animate-in fade-in duration-300 ${isLightMode ? 'bg-black/20 sm:bg-white/40' : 'bg-black/60 sm:bg-white/10'} sm:backdrop-blur-md`}>
      <div className={`sm:glass-panel border-t sm:border sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] flex flex-col shadow-2xl relative ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
        <div className={`p-4 sm:p-6 border-b flex justify-between items-center sm:bg-transparent sticky top-0 z-50 ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
          <h3 className={`font-serif text-xl sm:text-2xl flex items-center gap-3 tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
            <Scissors className={isLightMode ? 'text-gray-500' : 'text-white/60'} size={24} />
            Детальный гайд для парикмахера
          </h3>
          <button
            onClick={() => setTryOnStyle(null)}
            aria-label="Закрыть гайд"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLightMode ? 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900' : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto custom-scrollbar">
          {/* Technical Details */}
          <div className="lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <h4 className={`text-2xl font-serif mb-2 tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
                {tryOnStyle.name}
              </h4>
              <p className={`text-sm font-light leading-relaxed mb-6 ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
                Покажите этот экран вашему мастеру для точного воплощения
                задуманного образа. Эта стрижка подобрана с учетом вашей
                геометрии лица и текущей структуры волос.
              </p>
            </div>

            <div className="space-y-4">
              <div className={`bg-transparent border rounded-xl p-5 ${isLightMode ? 'border-gray-200 text-gray-800' : 'border-white/10 text-white/90'}`}>
                <h5 className={`text-[10px] uppercase tracking-widest mb-3 font-medium flex items-center gap-2 ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
                  <Zap size={14} /> Ключевые зоны
                </h5>
                <ul className="space-y-3 text-sm font-light">
                  <li className="flex gap-2">
                    <span className={isLightMode ? 'text-gray-400' : 'text-white/60'}>•</span>
                    <span>
                      <strong>Структура волос:</strong> {results?.hairType},{" "}
                      {results?.hairDensity?.toLowerCase()}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isLightMode ? 'text-gray-400' : 'text-white/60'}>•</span>
                    <span>
                      <strong>Верхняя зона:</strong> Оставить длину для
                      текстуры, профилировать по необходимости.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isLightMode ? 'text-gray-400' : 'text-white/60'}>•</span>
                    <span>
                      <strong>Бока и затылок:</strong> Плавный переход
                      (fade) или укорачивание, чтобы подчеркнуть форму лица
                      ({results?.faceShape?.toLowerCase()}).
                    </span>
                  </li>
                </ul>
              </div>

              <div className={`bg-transparent border rounded-xl p-5 ${isLightMode ? 'border-gray-200 text-gray-800' : 'border-white/10 text-white/90'}`}>
                <h5 className={`text-[10px] uppercase tracking-widest mb-3 font-medium flex items-center gap-2 ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
                  <Sparkles size={14} /> Стайлинг (для мастера)
                </h5>
                <p className="text-sm font-light leading-relaxed">
                  {tryOnStyle.stylingTips}
                </p>
              </div>
            </div>

            <div className={`mt-auto pt-6 border-t ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
              <button
                onClick={() => setTryOnStyle(null)}
                className={`w-full font-medium py-4 px-6 rounded-full transition-colors active:scale-95 text-base ${isLightMode ? 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80' : 'bg-white/5 text-white/90 hover:bg-white/10'}`}
              >
                ✕ Вернуться к вариантам
              </button>
            </div>
          </div>

          {/* Visual References */}
          <div className={`flex-1 lg:pl-8 lg:border-l order-1 lg:order-2 ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
            <h4 className={`text-sm uppercase tracking-widest font-medium mb-6 flex justify-between items-center ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
              <span>Side-by-side визуализация</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-auto">
              {/* Original Input */}
              <div className={`relative glass-panel rounded-2xl overflow-hidden border group aspect-[4/5] sm:aspect-auto sm:h-[400px] lg:h-[500px] flex items-center justify-center shadow-sm ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-white/10'}`}>
                <img
                  src={imageUrl || (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`)}
                  alt="Ваша база"
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-[10px] sm:text-xs text-white uppercase tracking-wider font-medium drop-shadow-md">
                    Ваша база
                  </span>
                  <p className="text-[9px] sm:text-[10px] text-white mt-0.5 sm:mt-1 hidden sm:block drop-shadow-md">
                    Отправная точка стрижки
                  </p>
                </div>
              </div>

              {/* Reference Output */}
              <div className={`relative glass-panel rounded-2xl overflow-hidden border shadow-sm group aspect-[4/5] sm:aspect-auto sm:h-[400px] lg:h-[500px] flex items-center justify-center ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-white/10'}`}>
                <LazyImage
                  keyword={tryOnStyle.imageKeyword}
                  gender={results?.gender || ""}
                  uniqueName={tryOnStyle.name}
                  description={tryOnStyle.description}
                  autoLoad={true}
                  results={results || undefined}
                  className={`absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105`}
                  onImageLoaded={setLoadedReferenceUrl}
                />

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-[10px] sm:text-xs text-white uppercase tracking-wider font-medium drop-shadow-md">
                    Целевой стиль
                  </span>
                  <p className="text-[9px] sm:text-[10px] text-white mt-0.5 sm:mt-1 hidden sm:block drop-shadow-md">
                    Референс результата
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {styleConsultations[tryOnStyle.imageKeyword] && (
                <div
                  id="hairdresser-guide-content"
                  className={`mb-4 border rounded-2xl p-5 relative ${isLightMode ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-white/5 border-white/10 text-white/90'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h4 className={`flex items-center gap-2 font-medium text-sm uppercase tracking-widest ${isLightMode ? 'text-gray-500' : 'text-white/80'}`}>
                      <Sparkles size={16} className={isLightMode ? 'text-blue-500' : ''} /> Персональный гайд (AI)
                    </h4>
                    <button
                      onClick={exportToPDF}
                      disabled={isExportingPDF}
                      className={`flex items-center justify-center gap-1.5 text-[11px] font-semibold border px-3.5 py-2 rounded-full transition-all active:scale-[0.98] w-full sm:w-auto ${isLightMode ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/90'}`}
                      title="Скачать гайд в PDF формате для печати"
                    >
                      <FileDown size={14} />
                      {isExportingPDF
                        ? "Подготовка PDF..."
                        : "Экспорт в PDF"}
                    </button>
                  </div>
                  <div
                    className={`text-sm font-light leading-relaxed space-y-4 font-sans
                               [&>strong]:font-medium [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 ${isLightMode ? '[&>strong]:text-gray-900 text-gray-700' : '[&>strong]:text-white text-white/90'}`}
                    dangerouslySetInnerHTML={{
                      __html: styleConsultations[tryOnStyle.imageKeyword],
                    }}
                  />
                </div>
              )}
              <button
                onClick={() =>
                  generateARPreview(
                    tryOnStyle.imageKeyword,
                    tryOnStyle.name,
                  )
                }
                disabled={loadingARStyles[tryOnStyle.imageKeyword]}
                className={`w-full font-medium py-4 px-6 rounded-full transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border text-sm sm:text-base ${isLightMode ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300' : 'glass-button hover:bg-white/10 text-white/90 border-white/20'}`}
              >
                <Sparkles size={18} className={isLightMode ? 'text-blue-500' : ''} />
                {loadingARStyles[tryOnStyle.imageKeyword]
                  ? "Генерация..."
                  : styleConsultations[tryOnStyle.imageKeyword]
                    ? "🔄 Обновить персональный гайд"
                    : "📝 Сгенерировать персональный гайд"}
              </button>
              {arError && (
                <p className="text-xs text-orange-200/90 bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-lg text-center leading-relaxed">
                  {arError}
                </p>
              )}

              {/* Virtual Try-On Section */}
              <div className={`mt-4 pt-4 border-t flex flex-col gap-3 ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
                {vtonResultUrl && !isTeaserResult && (
                  <div className={`mb-4 border rounded-2xl p-3 sm:p-4 relative group ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
                    <BeforeAfterSlider 
                      beforeImage={imageUrl || (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`)}
                      afterImage={vtonResultUrl}
                    />
                    <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareResult(vtonResultUrl);
                        }}
                        className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-black/70 shadow-xl"
                        title="Поделиться результатом"
                      >
                        <Send size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(vtonResultUrl, "ai_result.jpg");
                        }}
                        className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-black/70 shadow-xl"
                        title="Сохранить результат"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
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
                          <span>Скачать коллаж</span>
                       </button>
                    </div>
                  </div>
                )}

                {vtonResultUrl && isTeaserResult && (
                  <div className={`mb-4 relative rounded-2xl overflow-hidden border ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-white/10'}`}>
                     <div className="relative aspect-[3/4] w-full flex items-center justify-center">
                        <img src={vtonResultUrl} alt="Blurred Result" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-70 scale-110 pointer-events-none" />
                        
                        {/* Watermark overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                           <span className="text-white/60 font-bold text-xl sm:text-2xl rotate-[-15deg] uppercase tracking-wider drop-shadow-xl select-none">
                             https://t.me/neirostilist_bot
                           </span>
                        </div>
                        
                        {/* Unlock Button overlay */}
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
                
                {vtonResultUrl && (customHairColor || results?.hairColor) && COLOR_BRANDS[customHairColor || results?.hairColor || ""] && !isTeaserResult && (
                  <div className={`mb-4 border rounded-2xl p-4 ${isLightMode ? 'bg-purple-50/50 border-purple-200' : 'bg-purple-500/10 border-purple-500/20'}`}>
                    <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${isLightMode ? 'text-purple-700' : 'text-purple-200'}`}>
                      <ShoppingBag size={16} /> Формула цвета: {customHairColor || results?.hairColor}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COLOR_BRANDS[customHairColor || results?.hairColor || ""].map((brand, bIdx) => (
                        <div key={bIdx} className={`border rounded-xl p-3 flex justify-between items-center ${isLightMode ? 'bg-white/80 border-purple-100' : 'bg-white/5 border-white/10'}`}>
                          <span className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-white/80'}`}>{brand.name}</span>
                          <span className={`text-sm font-mono px-2 py-1 rounded-md ${isLightMode ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-300'}`}>{brand.shade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pb-3 justify-center mb-3">
                  {[
                    "Блонд",
                    "Русый",
                    "Каштановый",
                    "Черный",
                    "Рыжий",
                    "Седой",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomHairColor(color)}
                      className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all border ${
                        customHairColor === color
                          ? "bg-blue-500 text-white border-blue-400 shadow-sm"
                          : (isLightMode ? "bg-white text-gray-600 border-gray-300 hover:bg-gray-50" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10")
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                  {customHairColor && (
                    <button
                      onClick={() => setCustomHairColor(null)}
                      className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all border ${isLightMode ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-red-500/20 text-red-200 border-red-500/30 hover:bg-red-500/30'}`}
                    >
                      Сбросить
                    </button>
                  )}
                </div>

                {/* Slider for transformation strength */}
                <div className="mb-4">
                  <div className={`flex justify-between items-center mb-1 text-xs ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                    <span>Уровень вмешательства ИИ:</span>
                    <span className="font-semibold">{vtonStrength}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={vtonStrength}
                    onChange={(e) =>
                      setVtonStrength(Number(e.target.value))
                    }
                    className={`w-full accent-blue-500 rounded-lg appearance-none h-1.5 cursor-pointer ${isLightMode ? 'bg-gray-200' : 'bg-white/10'}`}
                  />
                  <div className={`flex justify-between text-[10px] mt-1 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="max-w-[100px] text-left leading-tight">
                      Сохранять моё лицо как есть (рекомендуется 15-20%)
                    </span>
                    <span className="max-w-[100px] text-right leading-tight">
                      Подгонять под референс
                    </span>
                  </div>
                </div>

                {loadingVTONStyles[tryOnStyle.imageKeyword] ? (
                  <RotatingFactsLoader isLightMode={isLightMode} title="Примерка стиля (около 15-30 сек)..." />
                ) : (
                  <button
                    onClick={() =>
                      generateVirtualTryOn(
                        tryOnStyle.imageKeyword,
                        tryOnStyle.name,
                        tryOnStyle.description,
                        customHairColor,
                        loadedReferenceUrl || tryOnStyle.imageUrl,
                      )
                    }
                    style={{ color: "#ffffff" }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-medium py-4 px-6 rounded-full transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-[0.98] flex justify-center items-center gap-2 border border-white/10 text-sm sm:text-base vton-generate-btn"
                  >
                    <Sparkles size={18} fill="currentColor" />
                    📸 Виртуальная примерка (Beta)
                  </button>
                )}
                {vtonError && (
                  <p className="text-xs text-orange-200/90 bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-lg text-center leading-relaxed">
                    {vtonError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
