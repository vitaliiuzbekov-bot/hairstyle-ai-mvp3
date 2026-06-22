import React, { useEffect } from "react";
import { Zap, Loader2 } from "lucide-react";

import { Header } from "./components/Header";
import { ErrorBoundary } from "./components/ErrorBoundary";

const FaqPage = React.lazy(() => import("./components/FaqPage").then(m => ({ default: m.FaqPage })));
const WelcomeModal = React.lazy(() => import("./components/WelcomeModal").then(m => ({ default: m.WelcomeModal })));
const DailyRewardModal = React.lazy(() => import("./components/DailyRewardModal").then(m => ({ default: m.DailyRewardModal })));
const BuyModal = React.lazy(() => import("./components/BuyModal").then(m => ({ default: m.BuyModal })));
const StylistChat = React.lazy(() => import("./components/StylistChat").then(m => ({ default: m.StylistChat })));
const ProfileModal = React.lazy(() => import("./components/ProfileModal").then(m => ({ default: m.ProfileModal })));
const QuickTutorial = React.lazy(() => import("./components/QuickTutorial").then(m => ({ default: m.QuickTutorial })));
const ShareModal = React.lazy(() => import("./components/ShareModal").then(m => ({ default: m.ShareModal })));
const PWAPrompt = React.lazy(() => import("./components/PWAPrompt").then(m => ({ default: m.PWAPrompt })));

import { useTokenManager } from "./hooks/useTokenManager";
import { useOfflineStatus } from "./hooks/useOfflineStatus";
import { ToastContainer } from "./components/ToastContainer";

import { Routes, Route, Navigate } from "react-router-dom";

import { HistoryPage } from "./components/HistoryPage";
import { useTelegramBackButton } from "./hooks/useTelegramBackButton";
import { HomePage } from "./components/HomePage";
import { useTelegram } from "./hooks/useTelegram";
import { useUser } from "./context/UserContext";
import { useUI } from "./context/UIContext";
import { useHistoryHandlers } from "./hooks/useHistoryHandlers";
import { useAnalysisContext } from "./context/AnalysisContext";

const LoadingFallback = ({ isLightMode }: { isLightMode: boolean }) => (
  <div className={`flex items-center justify-center p-8 ${isLightMode ? 'text-blue-500' : 'text-blue-400'}`}>
    <Loader2 className="animate-spin w-8 h-8" />
  </div>
);

function App() {
  const [showTutorial, setShowTutorial] = React.useState(() => {
    return localStorage.getItem('hasSeenTutorial') !== 'true';
  });

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };

  useTelegramBackButton();

  useEffect(() => {
    // Eagerly preload FaceAPI models in background so they are ready when user taps Find Styles
    setTimeout(() => {
      import("./services/fallbackAnalysis").then(m => {
        m.preloadFaceApiModels();
      }).catch(e => console.warn("Failed to preload FaceAPI module", e));
    }, 3000); // Wait 3s so it doesn't block initial interactive load
  }, []);

  const isOffline = useOfflineStatus();
  const { tg, isLightMode, setIsLightMode, telegramInitData, shareResult } = useTelegram();
  const {
    userAvatar, setUserAvatar,
    userRole, setUserRole,
    salonName, setSalonName,
    consentGiven, setConsentGiven,
  } = useUser();

  const {
    isProfileOpen, setIsProfileOpen,
    faqData, setFaqData,
    showWelcome, setShowWelcome,
    showSalonNameInput, setShowSalonNameInput,
    isChatOpen, setIsChatOpen,
    chatStyleName, setChatStyleName,
    addToast
  } = useUI();

  const {
    generationsLeft,
    setGenerationsLeft,
    history,
    setHistory,
    userId,
    initError,
    consumeToken,
    buyTokens,
    checkLimits,
    processPayment,
    isBuying,
    showBuyModal,
    setShowBuyModal,
    isTelegramEnv,
    isDeveloper,
    setIsDeveloper
  } = useTokenManager();

  const { deleteHistoryItem } = useHistoryHandlers(history, setHistory, userId);

  if (!isTelegramEnv && !isDeveloper) {
    return (
      <div className="relative min-h-screen bg-[#050508] text-white/90 flex flex-col items-center justify-center p-6 sm:p-10 text-center font-sans tracking-wide overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col items-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-8 rotate-3">
            <Zap size={36} strokeWidth={1.5} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            НейроСтилист
          </h1>
          <p className="text-white/60 mb-8 leading-relaxed font-light text-sm sm:text-base">
            Мощная платформа на базе искусственного интеллекта для подбора идеальной прически. Доступно эксклюзивно в Telegram для обеспечения безопасности и вашего комфорта. 
          </p>
          <a
            href="https://t.me/neirostilist_bot"
            target="_blank"
            rel="noreferrer"
            className="w-full relative group overflow-hidden px-8 py-4 bg-white text-black rounded-2xl font-bold transition-all sm:text-lg hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Открыть в Telegram
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <p className="mt-6 text-xs text-white/40 uppercase tracking-widest">
            Надежно. Быстро. Безопасно.
          </p>
        </div>

        {/* Footer / Credits */}
        <div className="absolute bottom-8 text-white/30 text-xs">
          © {new Date().getFullYear()} НейроСтилист AI
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full overflow-x-clip bg-[#050508] text-white/90 font-sans selection:bg-blue-500/30 ${isLightMode ? "light-mode" : ""}`}
    >
      {/* Header */}
      <Header
        generationsLeft={generationsLeft}
        isBuying={isBuying}
        buyTokens={buyTokens}
        userId={userId}
        userAvatar={userAvatar}
        isLightMode={isLightMode}
        isDeveloper={isDeveloper}
        setIsDeveloper={setIsDeveloper}
        setIsProfileOpen={setIsProfileOpen}
      />

      {isOffline && (
        <div className="bg-orange-500/10 border-b border-orange-500/20 text-orange-400 text-sm font-medium py-2 px-4 text-center fixed top-16 left-0 right-0 z-40 backdrop-blur-md">
          Отсутствует подключение к сети. Приложение работает в автономном режиме.
        </div>
      )}

      {/* Main Content */}
      <Routes>
        <Route path="/" element={
          <HomePage 
            generationsLeft={generationsLeft}
            userId={userId}
            initError={initError}
            checkLimits={checkLimits}
            setShowBuyModal={setShowBuyModal}
            setHistory={setHistory}
            processPayment={processPayment}
            history={history}
            telegramInitData={telegramInitData}
            isLightMode={isLightMode}
            isDeveloper={isDeveloper}
          />
        } />
        <Route path="/faq" element={
          <React.Suspense fallback={<LoadingFallback isLightMode={isLightMode} />}>
            <FaqPage faqData={faqData} isLightMode={isLightMode} />
          </React.Suspense>
        } />
        <Route path="/history" element={
          <HistoryPage 
             history={history} 
             imageBase64={null} 
             deleteHistoryItem={deleteHistoryItem} 
             isLightMode={isLightMode}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

        <React.Suspense fallback={<LoadingFallback isLightMode={isLightMode} />}>
          {showTutorial && (
            <QuickTutorial isLightMode={isLightMode} onComplete={handleTutorialComplete} />
          )}
          <BuyModal
            showBuyModal={showBuyModal}
            setShowBuyModal={setShowBuyModal}
            isBuying={isBuying}
            userRole={userRole}
            userId={userId}
            processPayment={processPayment}
            isLightMode={isLightMode}
          />

          <WelcomeModal
            showWelcome={showWelcome}
            setShowWelcome={setShowWelcome}
            setUserRole={setUserRole}
            salonName={salonName}
            setSalonName={setSalonName}
            showSalonNameInput={showSalonNameInput}
            setShowSalonNameInput={setShowSalonNameInput}
            isLightMode={isLightMode}
          />

          <DailyRewardModal isLightMode={isLightMode} />

          <ShareModal />
          <PWAPrompt isLightMode={isLightMode} />

          {isProfileOpen && (
            <ProfileModal
              userId={userId}
              userRole={userRole}
              userAvatar={userAvatar}
              isLightMode={isLightMode}
              setIsLightMode={setIsLightMode}
              showSalonNameInput={showSalonNameInput}
              setShowSalonNameInput={setShowSalonNameInput}
              salonName={salonName}
              setSalonName={setSalonName}
              onClose={() => setIsProfileOpen(false)}
            />
          )}
        </React.Suspense>

      {isChatOpen && (
        <React.Suspense fallback={<LoadingFallback isLightMode={isLightMode} />}>
          <StylistChat 
             onClose={() => setIsChatOpen(false)}
             features={null}
             styleName={chatStyleName}
             isLightMode={isLightMode}
          />
        </React.Suspense>
      )}

      <ToastContainer isLightMode={isLightMode} />
    </div>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
