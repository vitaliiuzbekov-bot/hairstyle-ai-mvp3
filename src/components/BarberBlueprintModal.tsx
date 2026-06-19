import React, { useRef, useEffect } from "react";
import { Scissors, X, Zap, Sparkles, FileDown, Send, Download, ShoppingBag, Share2 } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { CachedImage } from "./CachedImage";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { downloadImage } from "../utils/downloadImage";
import { shareResult } from "../utils/shareResult";
import { generateCollage } from "../utils/collage";
import { AnalysisResult } from "../types";
import { RotatingFactsLoader } from "./RotatingFactsLoader";
import { useScrollLock } from "../hooks/useScrollLock";
import { BlueprintTechnicalDetails } from "./BlueprintTechnicalDetails";
import { VTONPreviewSection } from "./VTONPreviewSection";
import { PersonalGuideSection } from "./PersonalGuideSection";

const COLOR_BRANDS: Record<string, {name: string, shade: string}[]> = {
  "Блонд": [{name: "L'Oreal Professionnel", shade: "Majirel 10.1"}, {name: "Wella Koleston", shade: "10/16"}],
  "Русый": [{name: "Matrix Socolor", shade: "7A"}, {name: "Redken Shades EQ", shade: "07N"}],
  "Светло-каштановый": [{name: "L'Oreal Professionnel", shade: "Majirel 6.0"}, {name: "Wella Koleston", shade: "6/0"}],
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
  const resultRef = useRef<HTMLDivElement>(null);
  const [isCollageGenerating, setIsCollageGenerating] = React.useState(false);

  useEffect(() => {
    if (vtonResultUrl && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [vtonResultUrl]);

  React.useEffect(() => {
    setLoadedReferenceUrl(null);
  }, [tryOnStyle]);

  useScrollLock(!!tryOnStyle);

  if (!tryOnStyle) return null;
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300 ${isLightMode ? 'bg-black/20 sm:bg-white/40' : 'bg-black/60 sm:bg-white/10'} sm:backdrop-blur-md`}>
      <div className={`sm:glass-panel border-t sm:border sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] flex flex-col shadow-2xl relative ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
        <div className={`p-4 sm:p-6 border-b flex justify-between items-center sm:bg-transparent sticky top-0 z-50 ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
          <h3 className={`font-serif text-xl sm:text-2xl flex items-center gap-3 tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
            <Scissors className={isLightMode ? 'text-gray-500' : 'text-white/60'} size={24} />
            Детальный гайд для парикмахера
          </h3>
          <button
            onClick={() => {
              if ((window as any).currentVtonController) {
                (window as any).currentVtonController.abort();
              }
              setTryOnStyle(null);
            }}
            aria-label="Закрыть гайд"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLightMode ? 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900' : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 flex-1 min-h-0 flex flex-col lg:flex-row gap-8 overflow-y-auto custom-scrollbar">
          {/* Technical Details */}
          <BlueprintTechnicalDetails
            tryOnStyle={tryOnStyle}
            results={results}
            isLightMode={isLightMode}
            onClose={() => {
              if ((window as any).currentVtonController) {
                (window as any).currentVtonController.abort();
              }
              setTryOnStyle(null);
            }}
          />

          {/* Visual References */}
          <div className={`flex-1 lg:pl-8 lg:border-l order-1 lg:order-2 flex flex-col ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
            <h4 className={`text-sm uppercase tracking-widest font-medium mb-6 flex justify-between items-center ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>
              <span>Референс стиля</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              {/* Original Input */}
              <div className={`relative glass-panel rounded-2xl overflow-hidden border group w-full aspect-[3/4] flex items-center justify-center shadow-sm [mask-image:-webkit-radial-gradient(white,black)] ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
                <img
                  src={imageUrl || (imageBase64 ? (imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`) : undefined)}
                  alt="Ваша база"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                  <span className="text-[10px] sm:text-xs text-white uppercase tracking-wider font-medium drop-shadow-md">
                    Ваша база
                  </span>
                </div>
              </div>

              {/* Reference Output */}
              <div className={`relative glass-panel rounded-2xl overflow-hidden border shadow-sm group w-full aspect-[3/4] flex items-center justify-center [mask-image:-webkit-radial-gradient(white,black)] ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-[#0f0c1b] border-white/10'}`}>
                {tryOnStyle.customImageUrl ? (
                  <img 
                    src={tryOnStyle.customImageUrl || undefined} 
                    alt="Свой референс"
                    onLoad={() => setLoadedReferenceUrl(tryOnStyle.customImageUrl)}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <LazyImage
                    keyword={tryOnStyle.imageKeyword || tryOnStyle.name}
                    gender={results?.gender || ""}
                    uniqueName={tryOnStyle.name}
                    description={tryOnStyle.description}
                    autoLoad={true}
                    results={results || undefined}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105`}
                    onImageLoaded={setLoadedReferenceUrl}
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                  <span className="text-[10px] sm:text-xs text-white uppercase tracking-wider font-medium drop-shadow-md">
                    Референс
                  </span>
                </div>
              </div>
            </div>

            {/* Virtual Try-On Section */}
            <VTONPreviewSection
              tryOnStyle={tryOnStyle}
              vtonResultUrl={vtonResultUrl || null}
              loadingVTONStyles={loadingVTONStyles}
              vtonError={vtonError}
              isLightMode={isLightMode}
              isTeaserResult={isTeaserResult}
              customHairColor={customHairColor}
              resultsHairColor={results?.hairColor}
              loadedReferenceUrl={loadedReferenceUrl}
              imageUrl={imageUrl}
              imageBase64={imageBase64}
              mimeType={mimeType}
              userRole={userRole}
              salonName={salonName}
              processPayment={processPayment}
              setCustomHairColor={setCustomHairColor}
              generateVirtualTryOn={generateVirtualTryOn}
              setChatStyleName={setChatStyleName}
              setIsChatOpen={setIsChatOpen}
              resultRef={resultRef}
              vtonStrength={vtonStrength}
              setVtonStrength={setVtonStrength}
            />

            <PersonalGuideSection
              tryOnStyle={tryOnStyle}
              styleConsultations={styleConsultations}
              isLightMode={isLightMode}
              exportToPDF={exportToPDF}
              isExportingPDF={isExportingPDF}
              generateARPreview={generateARPreview}
              loadingARStyles={loadingARStyles}
              arError={arError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
