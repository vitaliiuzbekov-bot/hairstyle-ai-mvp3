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
    // FaceAPI load deferred to component usage
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
      <div className="min-h-screen bg-[#050508] text-white/90 flex flex-col items-center justify-center p-6 text-center font-sans tracking-wide">
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6 text-blue-400">
          <Zap size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold mb-4 tracking-tight">
          Откройте через Telegram
        </h1>
        <p className="text-white/60 mb-8 max-w-sm leading-relaxed font-light">
          Бот Нейростилиста теперь доступен эксклюзивно внутри Telegram. Это
          необходимо для обеспечения безопасности данных и доступа к функциям
          оплаты.
        </p>
        <a
          href="https://t.me/neirostilist_bot"
          target="_blank"
          rel="noreferrer"
          className="px-8 py-4 bg-white text-black hover:bg-white/90 rounded-full font-medium transition-colors text-sm uppercase tracking-wider"
        >
          Перейти в Telegram
        </a>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden bg-[#050508] text-white/90 font-sans selection:bg-blue-500/30 ${isLightMode ? "light-mode" : ""}`}
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
