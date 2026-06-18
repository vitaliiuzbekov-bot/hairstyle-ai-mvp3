import React, { useEffect } from "react";
import { Camera, Upload, X, Sparkles, AlertCircle, RefreshCw, BookOpen, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";

interface UploadZoneProps {
  imageBase64: string | null;
  imageUrl: string | null;
  mimeType: string | null;
  isAnalyzing: boolean;
  isUploadingImage: boolean;
  error: string | null;
  errorString?: string | null;
  results: any;
  consentGiven: boolean;
  setConsentGiven: (val: boolean) => void;
  consentError: boolean;
  setConsentError: (val: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTelegramUploadClick: (isCamera: boolean, e: React.MouseEvent) => void;
  resetApp: () => void;
  preferredStyle: string;
  setPreferredStyle: (val: string) => void;
  analyzeImage: () => void;
  isLightMode: boolean;
}

const UploadZoneComponent: React.FC<UploadZoneProps> = ({
  imageBase64,
  imageUrl,
  mimeType,
  isAnalyzing,
  isUploadingImage,
  error,
  results,
  consentGiven,
  setConsentGiven,
  consentError,
  setConsentError,
  fileInputRef,
  cameraInputRef,
  handleFileUpload,
  handleTelegramUploadClick,
  resetApp,
  preferredStyle,
  setPreferredStyle,
  analyzeImage,
  isLightMode,
}) => {
  const { tg } = useTelegram();
  const [isDragging, setIsDragging] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tg?.MainButton) {
      if (!results && !error && imageBase64 && !isAnalyzing && !isUploadingImage) {
        tg.MainButton.text = "Запустить ИИ-Анализ 🚀";
        tg.MainButton.show();
        tg.MainButton.onClick(analyzeImage);
      } else {
        tg.MainButton.hide();
        tg.MainButton.offClick(analyzeImage);
      }
      
      if (isAnalyzing || isUploadingImage) {
         tg.MainButton.text = isUploadingImage ? "Обработка фото..." : "Нейросеть в работе...";
         tg.MainButton.show();
         tg.MainButton.disable();
      } else {
         tg.MainButton.enable();
      }
    }
    
    return () => {
      if (tg?.MainButton) {
        tg.MainButton.hide();
        tg.MainButton.offClick(analyzeImage);
      }
    }
  }, [tg, results, error, imageBase64, isAnalyzing, isUploadingImage, analyzeImage]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (consentGiven) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!consentGiven) {
      setConsentError(true);
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a fake event to pass to handleFileUpload
      const file = e.dataTransfer.files[0];
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      const fakeEvent = {
        target: { files: dataTransfer.files }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileUpload(fakeEvent);
    }
  };

  return (
    <div
      className={`col-span-1 lg:col-span-5 transition-all duration-700 ${imageBase64 ? "" : "lg:col-span-8 lg:col-start-3"}`}
    >
      <div className="relative group">
        <div className={`relative rounded-[1.5rem] border overflow-hidden transition-all duration-500 flex flex-col ${isLightMode ? 'bg-white text-gray-900 border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'bg-[#0a0a0a]/80 backdrop-blur-xl text-white/90 border-white/5 shadow-2xl'}`}>
          {/* Header of the card */}
          <div className={`px-6 py-5 border-b flex justify-between items-center ${isLightMode ? 'bg-gray-50/50 border-gray-100' : 'border-white/5 bg-white/[0.02]'}`}>
            <h3 className={`font-medium text-sm tracking-widest uppercase flex items-center gap-2 ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
              <Camera size={14} /> ФОТО ПРОФИЛЯ
            </h3>
            {imageBase64 && !isAnalyzing && (
              <button
                onClick={resetApp}
                aria-label="Удалить фото и начать заново"
                className={`p-1.5 rounded-full transition-colors ${isLightMode ? 'text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200' : 'text-white/60 hover:text-white/90 bg-white/5 hover:bg-white/10'}`}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="p-2 sm:p-4 pb-6">
            {!imageBase64 ? (
              <div className="flex flex-col items-center w-full">
                
                {/* User Guide Block */}
                <div className={`w-full max-w-[400px] mb-6 p-4 rounded-xl border flex items-start gap-3 text-left ${isLightMode ? 'bg-blue-50/50 border-blue-100' : 'bg-blue-500/5 border-blue-500/20'}`}>
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isLightMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'}`}>
                    <Camera size={18} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isLightMode ? 'text-blue-900' : 'text-blue-100'}`}>Как получить лучший результат</h4>
                    <p className={`text-xs leading-relaxed ${isLightMode ? 'text-blue-800' : 'text-blue-200/70'}`}>
                      Для идеальной примерки стрижки, сделайте селфи <strong>днем лицом к окну</strong>. Смотрите прямо, уберите волосы с лица и снимите очки.
                    </p>
                  </div>
                </div>

                <div
                  className={`w-full rounded-[1.25rem] flex flex-col items-center justify-center min-h-[360px] md:min-h-[440px] relative transition-all duration-300 ${
                    consentError 
                      ? isLightMode ? "border-2 border-dashed border-red-400 bg-red-50/50" : "border-2 border-dashed border-red-500/50 bg-red-500/5" 
                      : isUploadingImage
                        ? isLightMode ? "border border-gray-200 bg-gray-50 animate-pulse" : "border border-white/5 bg-white/5 animate-pulse"
                      : isDragging
                        ? isLightMode ? "border-2 border-dashed border-blue-400 bg-blue-50/50 scale-[1.02]" : "border-2 border-dashed border-blue-500/50 bg-blue-500/10 scale-[1.02]"
                        : isLightMode ? "border border-dashed border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-100/50" : "border border-dashed border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center justify-center">
                       <RefreshCw size={36} className={`animate-spin mb-4 ${isLightMode ? 'text-blue-500' : 'text-white/80'}`} />
                       <h4 className={`text-lg font-medium mb-2 pr-2 pl-2 ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>Подготовка фото...</h4>
                       <div className={`w-32 h-1.5 rounded-full overflow-hidden ${isLightMode ? 'bg-gray-200' : 'bg-white/10'}`}>
                         <div className="w-full h-full bg-blue-500 origin-left animate-[scale-x_2s_ease-in-out_infinite]"></div>
                       </div>
                    </div>
                  ) : (
                    <>
                      {consentError && (
                        <div className="absolute top-4 left-0 right-0 flex justify-center animate-pulse">
                          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${isLightMode ? 'bg-red-100 text-red-700 border-red-200' : 'bg-red-500/20 text-red-100 border-red-500/30'}`}>
                            Необходимо согласие на обработку данных
                          </span>
                        </div>
                      )}
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border transition-all duration-500 ${
                          consentGiven 
                            ? (isLightMode ? "text-gray-700 bg-white border-gray-200 hover:scale-105 shadow-md" : "text-white/90 border-white/10 bg-transparent hover:scale-105") 
                            : (isLightMode ? "text-gray-300 border-gray-200 bg-gray-100 grayscale" : "text-white/40 border-white/10 bg-transparent grayscale")
                        }`}
                      >
                        <Upload size={28} strokeWidth={1.5} />
                      </div>
                      <h4 className={`text-xl sm:text-2xl font-serif mb-2 tracking-tight text-center ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>
                        Загрузите селфи
                      </h4>
                      <p className={`text-sm max-w-[320px] text-center mb-8 font-light leading-relaxed px-4 ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
                        Сделайте фото камерой, выберите из галереи или перетащите файл сюда. Лицо должно быть хорошо освещено.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 w-full px-6 max-w-[400px]">
                        <button
                          onClick={(e) => handleTelegramUploadClick(true, e)}
                          className={`flex-1 border py-3 sm:py-3.5 rounded-full text-[13px] sm:text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${
                            consentGiven 
                              ? (isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm active:scale-95" : "glass-button text-white/90 hover:bg-white/10 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-95") 
                              : (isLightMode ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "glass-button opacity-50 border-white/10 text-white/90 grayscale cursor-not-allowed")
                          }`}
                        >
                          <Camera size={16} />
                          Сделать фото
                        </button>
                        <button
                          onClick={(e) => handleTelegramUploadClick(false, e)}
                          className={`flex-1 border py-3 sm:py-3.5 rounded-full text-[13px] sm:text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${
                            consentGiven 
                              ? (isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm active:scale-95" : "glass-button text-white/90 hover:bg-white/10 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-95") 
                              : (isLightMode ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "glass-button opacity-50 border-white/10 text-white/90 grayscale cursor-not-allowed")
                          }`}
                        >
                          <ImageIcon size={16} />
                          Галерея
                        </button>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="absolute w-px h-px p-0 m-0 border-0 overflow-hidden opacity-0 z-[-1]"
                        onChange={handleFileUpload}
                        tabIndex={-1}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={cameraInputRef}
                        capture="user"
                        className="absolute w-px h-px p-0 m-0 border-0 overflow-hidden opacity-0 z-[-1]"
                        onChange={handleFileUpload}
                        tabIndex={-1}
                      />
                    </>
                  )}
                </div>
                <div
                  className={`mt-6 p-3 rounded-xl border flex items-start gap-3 w-full max-w-[340px] cursor-pointer transition-all ${
                    consentError 
                      ? (isLightMode ? "bg-red-50 border-red-300" : "bg-red-500/10 border-red-500/30")
                      : (isLightMode ? "bg-gray-50/50 border-gray-200 hover:bg-gray-100" : "bg-white/5 border-white/10 hover:bg-white/10")
                  }`}
                  onClick={() => {
                    setConsentGiven(!consentGiven);
                    if (!consentGiven) setConsentError(false);
                  }}
                >
                  <div className={`mt-0.5 w-[18px] h-[18px] rounded border flex items-center justify-center transition-colors shrink-0 ${
                    consentGiven 
                      ? 'bg-blue-500 border-blue-500' 
                      : (consentError 
                          ? 'border-red-400 bg-red-50/50' 
                          : isLightMode ? 'border-gray-300 bg-white' : 'border-white/30 bg-transparent')
                  }`}>
                    {consentGiven && <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-white"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <label
                    className={`text-[11px] sm:text-xs leading-relaxed cursor-pointer select-none pointer-events-none transition-colors ${
                      consentError 
                        ? (isLightMode ? "text-red-700 font-medium" : "text-red-400 font-medium")
                        : (isLightMode ? 'text-gray-600' : 'text-white/60')
                    }`}
                  >
                    Я даю согласие на обработку моих персональных
                    (биометрических) данных в соответствии с ФЗ-152. Фото не хранится на
                    сервере.
                  </label>
                </div>

                <div className="mt-6 w-full max-w-[340px]">
                  <button 
                    onClick={() => navigate('/faq')}
                    className={`w-full flex items-center p-4 rounded-xl border transition-all text-left group ${isLightMode ? 'bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white' : 'glass-panel border-white/10 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isLightMode ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-white/5 group-hover:bg-white/10'}`}>
                        <BookOpen size={18} className={isLightMode ? 'text-blue-600' : 'text-white/70'} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium mb-0.5 ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>Гайд по использованию</h4>
                        <p className={`text-xs ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Как сделать фото и как работают подписки</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Preview */}
                <div className={`relative rounded-xl overflow-hidden aspect-[3/4] flex items-center justify-center max-h-[500px] ring-1 ${isLightMode ? 'bg-gray-100 ring-gray-200' : 'glass-panel ring-white/10'}`}>
                  <img
                    src={imageUrl || (imageBase64 ? (imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`) : undefined)}
                    alt="Ваше фото"
                    className={`max-w-full max-h-full object-contain w-full h-full transition-all duration-1000 ${isAnalyzing ? "scale-105 blur-sm opacity-50 grayscale hover:grayscale-0" : "scale-100"}`}
                  />

                  {/* Scanning Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                      <div className={`absolute inset-0 opacity-20 mix-blend-overlay ${isLightMode ? 'bg-black/10' : 'bg-white/10'}`}></div>
                      <div className={`w-full h-1 opacity-50 absolute top-[-50%] animate-[scan_2.5s_ease-in-out_infinite_alternate] ${isLightMode ? 'bg-blue-400 shadow-[0_0_20px_#3b82f6]' : 'glass-button shadow-[0_0_20px_#fff]'}`}></div>
                      <div className={`relative z-20 flex flex-col items-center backdrop-blur-md p-6 rounded-2xl border ${isLightMode ? 'bg-white/80 border-gray-200 shadow-xl' : 'bg-white/5 border-white/10'}`}>
                        <Sparkles
                          className={`animate-pulse mb-4 ${isLightMode ? 'text-blue-500' : 'text-white/90'}`}
                          size={32}
                          strokeWidth={1.5}
                        />
                        <span className={`font-serif italic text-xl tracking-wide ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>
                          Анализ геометрии...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  error.includes("Не удалось проанализировать") ? (
                    <div className={isLightMode ? "bg-orange-50 border border-orange-200 p-5 rounded-2xl text-left mt-2 shadow-md" : "bg-[#111] border border-orange-500/20 p-5 rounded-2xl text-left mt-2 shadow-lg"}>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="text-orange-500" size={20} />
                        <h3 className="font-semibold text-orange-500 text-sm">Не удалось проанализировать фото</h3>
                      </div>
                      <div className={isLightMode ? "text-gray-700 space-y-3 text-sm leading-relaxed mb-5" : "text-white/80 space-y-3 text-sm leading-relaxed mb-5"}>
                       <p>Нейросеть не смогла точно определить форму твоего лица. Скорее всего, проблема в освещении или ракурсе.</p>
                       <p>Пожалуйста, попробуй ещё раз:</p>
                       <ul className={isLightMode ? "space-y-1.5 pl-1.5 text-gray-600" : "space-y-1.5 pl-1.5 text-white/70"}>
                         <li>• Сделай фото при дневном свете, лицом к окну</li>
                         <li>• Смотри прямо в камеру, не наклоняй голову</li>
                         <li>• Убери волосы от лица и сними очки</li>
                       </ul>
                       <p className={isLightMode ? "pt-2 text-xs font-medium text-gray-500" : "pt-2 text-xs font-medium text-white/60"}>📌 Твоя генерация не была списана — ты можешь загрузить новое фото бесплатно.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                         <button onClick={resetApp} className={isLightMode ? "flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 shadow-sm py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2" : "flex-1 bg-white/10 hover:bg-white/15 border border-white/10 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"}>
                           <RefreshCw size={16} />
                           Загрузить новое фото
                         </button>
                         <button onClick={() => navigate('/faq')} className={isLightMode ? "flex-1 bg-transparent hover:bg-gray-100 border border-transparent text-gray-700 py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2" : "flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"}>
                           <BookOpen size={16} />
                           Гайд по съёмке
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`border p-4 rounded-xl text-sm flex items-start gap-3 mt-2 ${isLightMode ? 'bg-red-50 text-red-600 border-red-100' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      <AlertCircle
                        size={18}
                        className="shrink-0 mt-0.5 opacity-80"
                      />
                      <p className="leading-relaxed whitespace-pre-line">{error}</p>
                    </div>
                  )
                )}

                {/* Style Selection */}
                {!results &&
                  !error &&
                  !isAnalyzing &&
                  !isUploadingImage && (
                    <div className="mb-4">
                      <label className={`block text-[11px] font-semibold uppercase tracking-widest mb-3 text-center sm:text-left ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
                        Выберите стиль или настроение:
                      </label>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 max-h-[140px] overflow-y-auto hide-scrollbar sm:max-h-none sm:overflow-visible pr-1 sm:pr-0">
                        {[
                          "Любой",
                          "Деловой",
                          "Романтичный",
                          "Креативный",
                          "Кэжуал",
                          "Спортивный",
                          "Дерзкий",
                          "Элегантный",
                        ].map((styleOpt) => (
                          <button
                            key={styleOpt}
                            onClick={() => setPreferredStyle(styleOpt)}
                            className={`px-4 py-2.5 rounded-2xl text-[13px] transition-all font-medium border ${
                              preferredStyle === styleOpt
                                ? (isLightMode ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white text-gray-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]")
                                : (isLightMode ? "bg-white hover:bg-gray-50 text-gray-700 border-gray-200" : "glass-button hover:bg-white/10 text-white/80 border-white/10")
                            }`}
                          >
                            {styleOpt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Action Button */}
                {!results && !error && (
                  <>
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing || isUploadingImage || !imageBase64}
                    className={`${tg?.initDataUnsafe?.user ? 'hidden' : 'flex'} relative w-full font-bold py-4 sm:py-5 px-6 items-center justify-center gap-3 transition-all duration-500 text-sm sm:text-base rounded-[1.25rem] overflow-hidden group focus:ring-4 focus:ring-blue-500/50 ${
                      isAnalyzing || isUploadingImage || !imageBase64
                        ? (isLightMode ? "bg-gray-100 text-gray-400 border border-transparent cursor-not-allowed" : "bg-white/5 text-white/40 border-transparent cursor-not-allowed")
                        : (isLightMode ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-[0.98]" : "bg-white text-black hover:bg-gray-100 shadow-md active:scale-[0.98]")
                    }`}
                  >
                    {!isAnalyzing && !isUploadingImage && imageBase64 && (
                       <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {isUploadingImage
                        ? "Обработка фото..."
                        : isAnalyzing
                          ? "Нейросеть в работе..."
                          : "Запустить ИИ-Анализ 🚀"}
                    </span>
                  </button>
                  {/* Telegram WebApp Integration for MainButton is handled via hook, but we keep an invisible/fallback button for non-TG env */}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const UploadZone = React.memo(UploadZoneComponent);
