import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { UploadZone } from "../components/UploadZone";
import { ImageEditorModal } from "../components/ImageEditorModal";
import { exportToPDF } from "../utils/pdfExport";
import { useCamera } from "../hooks/useCamera";
import { useImageUpload } from "../hooks/useImageUpload";
import { useAnalysis } from "../hooks/useAnalysis";
import { usePhotoHandlers } from "../hooks/usePhotoHandlers";
import { useAnalysisContext } from "../context/AnalysisContext";
import { useUser } from "../context/UserContext";
import { useUI } from "../context/UIContext";
import { ImageSlider } from "../components/ImageSlider";
import { PresetsCarousel } from "../components/PresetsCarousel";

const LoadingFallback = ({ isLightMode }: { isLightMode: boolean }) => (
  <div className={`flex items-center justify-center p-8 ${isLightMode ? 'text-blue-500' : 'text-blue-400'}`}>
    <Loader2 className="animate-spin w-8 h-8" />
  </div>
);

const AnalysisResults = React.lazy(() => import("../components/AnalysisResults").then(m => ({ default: m.AnalysisResults })));
const BarberBlueprintModal = React.lazy(() => import("../components/BarberBlueprintModal"));
const CameraModal = React.lazy(() => import("../components/CameraModal").then(m => ({ default: m.CameraModal })));
const StylistChat = React.lazy(() => import("../components/StylistChat").then(m => ({ default: m.StylistChat })));

import { Skeleton } from "../components/Skeleton";

interface HomePageProps {
  isInitializing?: boolean;
  generationsLeft: number | null;
  userId: string | null;
  initError: string | null;
  checkLimits: () => Promise<boolean>;
  consumeToken: () => Promise<boolean>;
  setShowBuyModal: (show: boolean) => void;
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  processPayment: (packageId: string, starsAmount: number, generationsCount: number) => void;
  history: any[];
  telegramInitData: string;
  isLightMode: boolean;
  isDeveloper: boolean;
  resultImage?: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  isInitializing,
  generationsLeft,
  userId,
  initError,
  checkLimits,
  consumeToken,
  setShowBuyModal,
  setHistory,
  processPayment,
  history,
  telegramInitData,
  isLightMode,
  isDeveloper,
  resultImage
}) => {
  const { consentGiven, setConsentGiven, consentError, setConsentError, userRole, salonName } = useUser();
  const { addToast, chatStyleName, setChatStyleName, isChatOpen, setIsChatOpen } = useUI();
  const { tryOnStyle, setTryOnStyle, preferredStyle, setPreferredStyle } = useAnalysisContext();

  const {
    imageBase64,
    setImageBase64,
    imageUrl,
    setImageUrl,
    mimeType,
    isUploadingImage,
    error: uploadError,
    setError,
    fileInputRef,
    cameraInputRef,
    handleFileUpload: originalHandleFileUpload,
    resetImageState,
    isCompressing,
    rawImageBase64,
    setRawImageBase64,
    processFinalImage
  } = useImageUpload();

  const {
      isAnalyzing,
      results,
      setResults,
      loadingARStyles,
      arGeneratedImageUrl,
      setArGeneratedImageUrl,
      teaserUrl,
      teaserRecName,
      isGeneratingTeaser,
      styleConsultations,
      arError,
      setArError,
      loadingVTONStyles,
      vtonResultUrl,
      setVtonResultUrl,
      isTeaserResult,
      vtonError,
      setVtonError,
      customHairColor,
      setCustomHairColor,
      vtonStrength,
      setVtonStrength,
      isLoadingMore,
      analyzeImage,
      generateARPreview,
      generateVirtualTryOn,
      loadMoreRecommendations
  } = useAnalysis({
      imageBase64,
      imageUrl,
      mimeType,
      preferredStyle,
      telegramInitData,
      userId,
      initError,
      generationsLeft,
      isDeveloper,
      checkLimits,
      consumeToken,
      setShowBuyModal,
      setHistory,
      setError,
      addToast
  });

  const handleFileUploadWrapper = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      originalHandleFileUpload(e, () => {
          setResults(null);
          setArGeneratedImageUrl({});
          setTryOnStyle(null);
      });
  }, [originalHandleFileUpload, setResults, setArGeneratedImageUrl, setTryOnStyle]);

  useEffect(() => {
    const handleSelectStyle = (e: any) => {
      setTryOnStyle(e.detail);
      // scroll to top or smoothly to the try-on section if desired
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('select-style', handleSelectStyle);
    return () => window.removeEventListener('select-style', handleSelectStyle);
  }, [setTryOnStyle]);

  useEffect(() => {
    setVtonResultUrl(null);
    setVtonError(null);
    setCustomHairColor(null);
  }, [tryOnStyle, setVtonResultUrl, setVtonError, setCustomHairColor, vtonStrength]);

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const handleExportPDF = async (elementIdOrEvent?: string | React.MouseEvent, filename?: string, images?: { before?: string, reference?: string, after?: string }) => {
    setIsExportingPDF(true);
    await exportToPDF(elementIdOrEvent, filename, images);
    setIsExportingPDF(false);
  };

  const resetApp = () => {
    resetImageState();
    setResults(null);
    setArError(null);
    setArGeneratedImageUrl({});
  };

  const {
    isCameraModalOpen,
    cameraStream,
    facingMode,
    customVideoRef,
    startCameraLocal,
    stopCamera,
    capturePhoto,
  } = useCamera((file: File) => {
    const fakeEvent = {
        target: { files: [file], value: '' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileUploadWrapper(fakeEvent);
  });

  const {
    triggerFileInput,
    triggerCameraInput,
    handleTelegramUploadClick
  } = usePhotoHandlers({
    consentGiven,
    setConsentError,
    fileInputRef,
    cameraInputRef,
    startCameraLocal,
    handleFileUploadWrapper
  });

  return (
    <>
      <ImageEditorModal
        isOpen={!!rawImageBase64}
        onClose={() => setRawImageBase64(null)}
        originalBase64={rawImageBase64 || ''}
        mimeType={mimeType}
        onSave={(finalBase64) => {
          setRawImageBase64(null);
          processFinalImage(finalBase64);
        }}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Intro */}
        {!imageBase64 && (
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className={`font-serif text-2xl sm:text-3xl md:text-5xl lg:text-5xl mb-4 md:mb-6 leading-tight tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>
              Какая стрижка подойдет <br />{" "}
              <span className={`italic ${isLightMode ? 'text-gray-500' : 'text-white/60'}`}>именно вам?</span>
            </h2>
            
            <div className="flex justify-center mb-6 w-full max-w-[400px] mx-auto">
              <ImageSlider isLightMode={isLightMode} resultImage={resultImage} history={history} />
            </div>

            <p className={`leading-relaxed max-w-lg mx-auto font-light text-sm sm:text-base px-2 ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
              Загрузите селфи, и наш умный эксперт определит форму вашего лица
              для подбора стрижек, которые подчеркнут ваши лучшие черты.
            </p>
          </div>
        )}

        {/* History Link */}
        {!imageBase64 && history && history.length > 0 && (
          <div className="flex justify-center mb-8 fade-in">
             <button 
              onClick={() => window.location.hash = "#/history"}
              className={`px-6 py-3 rounded-full text-sm font-medium border transition-colors ${isLightMode ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
             >
               Посмотреть историю генераций ({history.length})
             </button>
          </div>
        )}

        {!imageBase64 && (
          <div className="fade-in">
            <PresetsCarousel 
              isLightMode={isLightMode} 
              onSelectPreset={(presetName) => {
                setPreferredStyle(presetName);
                triggerFileInput({ stopPropagation: () => {} } as React.MouseEvent);
              }} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left / Top: Upload Zone */}
          {isInitializing ? (
            <div className="col-span-1 lg:col-span-8 lg:col-start-3">
              <Skeleton className="w-full h-[500px] rounded-[1.5rem]" isLightMode={isLightMode} />
            </div>
          ) : (
            <UploadZone
              imageBase64={imageBase64}
              imageUrl={imageUrl}
              mimeType={mimeType}
              isAnalyzing={isAnalyzing}
              isUploadingImage={isUploadingImage || isCompressing}
              error={uploadError}
              results={results}
              consentGiven={consentGiven}
              setConsentGiven={setConsentGiven}
              consentError={consentError}
              setConsentError={setConsentError}
              fileInputRef={fileInputRef}
              cameraInputRef={cameraInputRef}
              handleFileUpload={handleFileUploadWrapper}
              handleTelegramUploadClick={handleTelegramUploadClick}
              resetApp={resetApp}
              preferredStyle={preferredStyle}
              setPreferredStyle={setPreferredStyle}
              analyzeImage={analyzeImage}
              isLightMode={isLightMode}
            />
          )}

          {/* Right: Results */}
          {!isInitializing && (
            <React.Suspense fallback={<LoadingFallback isLightMode={isLightMode} />}>
              <AnalysisResults
              isAnalyzing={isAnalyzing}
              results={results}
              generationsLeft={generationsLeft}
              teaserUrl={teaserUrl}
              isGeneratingTeaser={isGeneratingTeaser}
              setShowBuyModal={setShowBuyModal}
              setTryOnStyle={setTryOnStyle}
              loadMoreRecommendations={loadMoreRecommendations}
              isLoadingMore={isLoadingMore}
              isLightMode={isLightMode}
              exportToPDF={handleExportPDF}
              isExportingPDF={isExportingPDF}
              imageUrl={imageUrl}
              imageBase64={imageBase64}
              mimeType={mimeType}
              generateVirtualTryOn={generateVirtualTryOn}
              vtonResultUrl={vtonResultUrl}
              loadingVTONStyles={loadingVTONStyles}
              vtonError={vtonError}
              onGenerationSuccess={() => {
                // Token consumption is handled internally by useAnalysis on success.
              }}
            />
          </React.Suspense>
          )}
        </div>
      </main>

      <React.Suspense fallback={<LoadingFallback isLightMode={isLightMode} />}>
        <BarberBlueprintModal
          tryOnStyle={tryOnStyle}
          setTryOnStyle={setTryOnStyle}
          results={results}
          imageUrl={imageUrl}
          mimeType={mimeType}
          imageBase64={imageBase64}
          styleConsultations={styleConsultations}
          loadingARStyles={loadingARStyles}
          arError={arError}
          vtonResultUrl={vtonResultUrl}
          isTeaserResult={isTeaserResult}
          processPayment={processPayment}
          customHairColor={customHairColor}
          setCustomHairColor={setCustomHairColor}
          vtonStrength={vtonStrength}
          setVtonStrength={setVtonStrength}
          generateARPreview={generateARPreview}
          exportToPDF={handleExportPDF}
          isExportingPDF={isExportingPDF}
          userRole={userRole}
          salonName={salonName}
          setChatStyleName={setChatStyleName}
          setIsChatOpen={setIsChatOpen}
          loadingVTONStyles={loadingVTONStyles}
          generateVirtualTryOn={generateVirtualTryOn}
          vtonError={vtonError}
          isLightMode={isLightMode}
        />

        <CameraModal
          isCameraModalOpen={isCameraModalOpen} cameraStream={cameraStream}
          customVideoRef={customVideoRef}
          facingMode={facingMode}
          stopCamera={stopCamera}
          capturePhoto={capturePhoto}
          startCameraLocal={startCameraLocal}
        />

        {isChatOpen && results && (
            <StylistChat 
               onClose={() => setIsChatOpen(false)}
               features={results}
               styleName={chatStyleName}
               isLightMode={isLightMode}
            />
        )}
      </React.Suspense>
    </>
  );
};
