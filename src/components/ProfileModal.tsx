import { useModalBackButton } from '../hooks/useTelegramBackButton';
import React from "react";
import { X, User, Share2, Sun, Moon, LogOut, ArrowDownToLine, Clock } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface ProfileModalProps {
  userId: string | null;
  userRole: string;
  userAvatar: string | null;
  isLightMode: boolean;
  setIsLightMode?: (val: boolean) => void;
  setShowSalonNameInput: (val: boolean) => void;
  showSalonNameInput: boolean;
  salonName: string;
  setSalonName: (val: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userId,
  userRole,
  userAvatar,
  isLightMode,
  setIsLightMode,
  onClose,
}) => {
  const { setUserRole } = useUser();
  const navigate = useNavigate();

  const handleShare = () => {
  useModalBackButton(true, onClose);

    const botLink = "https://t.me/neirostilist_bot/app?startapp=ref_" + userId;
    const text = "Подбери себе идеальную стрижку с помощью ИИ!";
    const shareUrl = "https://t.me/share/url?url=" + encodeURIComponent(botLink) + "&text=" + encodeURIComponent(text);
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <>
      <div className="fixed-viewport z-40" onClick={onClose}></div>
      <div 
        className={`absolute top-16 right-4 sm:right-6 w-64 border rounded-2xl p-3 shadow-xl flex flex-col gap-2 z-50 animate-in slide-in-from-top-2 origin-top-right ${
          isLightMode ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#18181b] border-white/10 text-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center shrink-0 ${
              isLightMode ? 'border-gray-200 bg-gray-100' : 'border-white/10 bg-white/5'
            }`}>
              {userAvatar ? (
                <img src={userAvatar || undefined} alt="Аватар" className="w-full h-full object-cover" />
              ) : (
                <User size={16} className={isLightMode ? 'text-gray-400' : 'opacity-50'} />
              )}
            </div>
            <div>
              <p className={`text-[10px] font-mono leading-none ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>ID: {userId}</p>
            </div>
          </div>
        </div>

        <div className={`h-[1px] w-full ${isLightMode ? 'bg-gray-100' : 'bg-white/10'}`}></div>

        {/* Roles menu */}
        <div className="flex flex-col gap-0.5">
          <p className={`text-[10px] px-2 font-semibold uppercase tracking-wider mb-0.5 mt-1 ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>Роль</p>
          <button 
            onClick={() => setUserRole('client')}
            className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg transition-colors ${
              userRole === 'client' 
                ? (isLightMode ? 'bg-gray-100 font-semibold' : 'bg-white/10 font-semibold')
                : (isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5')
            }`}
          >
            Для себя
            {userRole === 'client' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>}
          </button>
          <button 
            onClick={() => setUserRole('master')}
            className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg transition-colors ${
              userRole === 'master' 
                ? (isLightMode ? 'bg-gray-100 font-semibold' : 'bg-white/10 font-semibold')
                : (isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5')
            }`}
          >
            Мастер
            {userRole === 'master' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>}
          </button>
        </div>

        <div className={`h-[1px] w-full ${isLightMode ? 'bg-gray-100' : 'bg-white/10'}`}></div>

        {/* Referral Section */}
        <div className="flex flex-col gap-1 mt-1 p-2">
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`}>Реферальная ссылка</p>
          <div className="flex items-center gap-2">
            <input 
              readOnly 
              value={`https://t.me/neirostilist_bot/app?startapp=ref_${userId}`}
              className={`flex-1 text-[10px] px-2 py-1.5 rounded-md outline-none border ${isLightMode ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white/5 border-white/10 text-gray-400'}`}
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://t.me/neirostilist_bot/app?startapp=ref_${userId}`);
                if (window.Telegram?.WebApp?.showAlert) {
                  window.Telegram.WebApp.showAlert("Ссылка скопирована!");
                } else {
                  alert("Ссылка скопирована!");
                }
              }}
              className={`p-1.5 rounded-md transition-colors ${isLightMode ? 'bg-blue-50 text-blue-500 hover:bg-blue-100' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
        <div className={`h-[1px] w-full ${isLightMode ? 'bg-gray-100' : 'bg-white/10'}`}></div>
        {/* History Link */}
        <div className="flex flex-col gap-0.5 mt-1">
          <button 
             onClick={() => {
                onClose();
                navigate('/history');
             }}
             className={`w-full flex items-center gap-2 px-2 py-2 text-xs rounded-lg transition-colors ${
               isLightMode ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-white/5 text-gray-300'
             }`}
          >
             <Clock size={14} className="opacity-70" />
             История генераций
          </button>
        </div>

        <div className={`h-[1px] w-full ${isLightMode ? 'bg-gray-100' : 'bg-white/10'}`}></div>

        {/* Settings menu */}
        <div className="flex flex-col gap-0.5 mt-1">
          {setIsLightMode && (
            <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors ${
                isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'
              }`}
            >
              {isLightMode ? <Moon size={14} className="text-gray-500" /> : <Sun size={14} className="text-gray-400" />}
              {isLightMode ? "Тёмная тема" : "Светлая тема"}
            </button>
          )}

          <button 
            onClick={() => {
              window.dispatchEvent(new Event('show-pwa-prompt'));
              onClose();
            }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors ${
              isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'
            }`}
          >
            <ArrowDownToLine size={14} className="text-emerald-500" />
            Установить приложение (PWA)
          </button>

          <button 
            onClick={handleShare}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors ${
              isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'
            }`}
          >
            <Share2 size={14} className="text-blue-500" />
            Пригласить друга
          </button>
        </div>
      </div>
    </>
  );
};

