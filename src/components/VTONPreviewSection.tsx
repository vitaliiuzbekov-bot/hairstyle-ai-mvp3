import React, { useState } from "react";
import { Sparkles, Send, Download, FileDown, ShoppingBag, Share2, Eraser, Video } from "lucide-react";
import { RotatingFactsLoader } from "./RotatingFactsLoader";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { CachedImage } from "./CachedImage";
import { downloadImage } from "../utils/downloadImage";
import { shareResult } from "../utils/shareResult";
import { generateCollage } from "../utils/collage";
import { generateBeforeAfterVideo } from "../utils/videoExport";
import { useUI } from "../context/UIContext";
import { MaskEditorModal } from "./MaskEditorModal";
import { Toast } from "./Toast";


interface VTONPreviewSectionProps {
  tryOnStyle: any;
  vtonResultUrl: string | null;
  loadingVTONStyles: Record<string, boolean>;
  vtonError: string | null;
  isLightMode?: boolean;
  isTeaserResult?: boolean;
  resultsHairColor?: string;
  loadedReferenceUrl: string | null;
  imageUrl: string | null;
  imageBase64: string | null;
  mimeType: string | null;
  userRole?: string | null;
  salonName?: string;
  processPayment: (s: string, v: number, v2: number) => void;
  generateVirtualTryOn: (kw: string, name: string, desc: string, imgUrl?: string) => void;
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
  resultsHairColor,
  loadedReferenceUrl,
  imageUrl,
  imageBase64,
  mimeType,
  userRole,
  salonName,
  processPayment,
  generateVirtualTryOn,
  setChatStyleName,
  setIsChatOpen,
  resultRef,
  vtonStrength,
  setVtonStrength,
}) => {
  const { openShareModal } = useUI();
  const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
  const [editedResultUrl, setEditedResultUrl] = useState<string | null>(null);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIsError, setToastIsError] = useState(false);

  // Сброс редактированного изображения при смене исходного результата
  React.useEffect(() => {
    setEditedResultUrl(null);
  }, [vtonResultUrl]);

  const displayResultUrl = editedResultUrl || vtonResultUrl;

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
            disabled={!(tryOnStyle.customImageUrl || loadedReferenceUrl || (tryOnStyle as any).imageUrl)}
            onClick={async (e) => {
                e.preventDefault();
                generateVirtualTryOn(
                  tryOnStyle.imageKeyword || tryOnStyle.name,
                  tryOnStyle.name,
                  tryOnStyle.description,
                                  tryOnStyle.customImageUrl || loadedReferenceUrl || (tryOnStyle as any).imageUrl || undefined
                );
              }
            }
            className={`relative w-full max-w-xs font-bold py-4 sm:py-5 px-6 flex items-center justify-center gap-3 transition-all duration-500 text-sm sm:text-base rounded-[1.25rem] overflow-hidden group focus:ring-4 focus:ring-blue-500/50 ${!(tryOnStyle.customImageUrl || loadedReferenceUrl || (tryOnStyle as any).imageUrl) ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white' : isLightMode ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-[0.98]' : 'bg-white text-black hover:bg-gray-100 shadow-md active:scale-[0.98]'}`}
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
          <RotatingFactsLoader isLightMode={!!isLightMode} title="Примерка стиля..." />
        </div>
      )}

      {displayResultUrl && !isTeaserResult && (
        <div className={`mb-4 border rounded-2xl p-3 sm:p-4 relative group flex flex-col items-center ${isLightMode ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
           <div className="w-full relative max-w-sm sm:max-w-md md:max-w-lg mx-auto">
             <BeforeAfterSlider 
               beforeImage={imageUrl || (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`)}
               afterImage={displayResultUrl}
               isLightMode={isLightMode}
             />
             <button
               onClick={() => setIsMaskEditorOpen(true)}
               className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur z-10 transition-colors"
               title="Убрать артефакты (Ластик)"
             >
               <Eraser size={18} />
             </button>
           </div>
          <div className="flex flex-col gap-3 mt-4 w-full">
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full">
             <button 
               onClick={async (e) => {
                  e.stopPropagation();
                  try {
                     const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`);
                     const collageDataUrl = await generateCollage(beforeSrc, displayResultUrl, userRole === 'salon' ? salonName : undefined);
                     
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
                     const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`);
                     const collageDataUrl = await generateCollage(beforeSrc, vtonResultUrl, userRole === 'salon' ? salonName : undefined);
                     downloadImage(collageDataUrl, "ai_collage.jpg");
                  } catch (err) {
                     console.error("Collage download error", err);
                  }
               }}
               className={`flex-1 py-3 px-2 sm:px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${isLightMode ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'}`}
               title="Скачать фото коллаж"
             >
                <FileDown size={16} />
                <span className="hidden sm:inline">Коллаж</span>
             </button>
             <button
               onClick={async (e) => {
                  e.stopPropagation();
                  if(isExportingVideo) return;
                  setIsExportingVideo(true);
                  try {
                     const beforeSrc = (imageUrl && !imageUrl.startsWith('blob:')) ? imageUrl : (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`);
                     const afterSrc = displayResultUrl || "";
                     
                     // Генерируем видео локально
                     

                     const tg = (window as any).Telegram?.WebApp;
                     const tgUserId = tg?.initDataUnsafe?.user?.id;
                     
                     if (tgUserId) {
                        try {
                            tg.showAlert("Генерируем видео на сервере и отправляем в чат, подождите 10-15 секунд...");
                            const res = await fetch('/api/send-to-telegram', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    tgUserId: tgUserId.toString(),
                                    type: 'video',
                                    beforeImage: beforeSrc,
                                    afterImage: afterSrc
                                })
                            });
                            if (res.ok) {
                                tg.showAlert("Готово! Видео отправлено вам в личные сообщения бота.");
                                setToastIsError(false);
                                setToastMessage(`Видео отправлено в чат!`);
                                return;
                            } else {
                                console.error("Сервер не смог сгенерировать видео", await res.text());
                                // Fallback to local generation below
                            }
                        } catch(err) {
                            console.error("Telegram send error", err);
                        }
                     }
                     
                     // Local generation fallback
                     const videoBlob = await generateBeforeAfterVideo(beforeSrc, afterSrc);
                     const videoUrl = URL.createObjectURL(videoBlob);
                     
                     const a = document.createElement('a');
                     a.href = videoUrl;
                     a.target = '_blank';
                     a.download = `style_transformation_${Date.now()}.${videoBlob.type.includes('mp4') ? 'mp4' : 'webm'}`;
                     document.body.appendChild(a);
                     a.click();
                     document.body.removeChild(a);
                     
                     setTimeout(() => URL.revokeObjectURL(videoUrl), 10000);
                     
                     setToastIsError(false);
                     setToastMessage(`Видео сохранено на ваше устройство.`);


                  } catch (err) {
                     console.error("Video export failed", err);
                     setToastIsError(true);
                     setToastMessage(`Ошибка экспорта: ${(err as Error).message}`);
                  } finally {
                     setIsExportingVideo(false);
                  }
               }}
               className={`flex-1 py-3 px-2 sm:px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${isLightMode ? 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100' : 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30'}`}
             >
                {isExportingVideo ? <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div> : <Video size={16} />}
                <span className="hidden sm:inline">Скачать Видео</span>
             </button>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     if (displayResultUrl) { openShareModal(displayResultUrl, "Посмотри, какую классную прическу и цвет волос мне подобрал ИИ в НейроСтилисте!"); }
                   }}
                   className={`flex-1 sm:w-12 py-3 sm:py-0 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                   title="Поделиться фото"
                 >
                   <Share2 size={16} />
                   <span className="hidden sm:inline">Поделиться</span>
                 </button>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     setIsMaskEditorOpen(true);
                   }}
                   className={`w-12 py-3 sm:py-0 rounded-xl font-medium border flex items-center justify-center gap-2 transition-colors ${isLightMode ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                   title="Стереть лишнее"
                 >
                   <Eraser size={16} />
                 </button>
             </div>
          </div>
        </div>
      )}
      
      {isMaskEditorOpen && displayResultUrl && (
        <MaskEditorModal
          beforeImage={imageUrl || (imageBase64?.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`) || ""}
          afterImage={displayResultUrl}
          onClose={() => setIsMaskEditorOpen(false)}
          onSave={(editedUrl) => {
            setEditedResultUrl(editedUrl);
            setIsMaskEditorOpen(false);
          }}
          isLightMode={isLightMode}
        />
      )}
      
      <Toast message={toastMessage || ""} isError={toastIsError} onClose={() => setToastMessage(null)} />
    </div>
  );
};
