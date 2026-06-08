import React, { useState } from "react";
import { Scissors, User, Store } from "lucide-react";

interface WelcomeModalProps {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  setUserRole: (role: 'client' | 'master' | 'salon') => void;
  salonName: string;
  setSalonName: (name: string) => void;
  showSalonNameInput: boolean;
  setShowSalonNameInput: (show: boolean) => void;
  isLightMode?: boolean;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  showWelcome,
  setShowWelcome,
  setUserRole,
  salonName,
  setSalonName,
  showSalonNameInput,
  setShowSalonNameInput,
  isLightMode,
}) => {
  if (!showWelcome) return null;

  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 ${isLightMode ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}>
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#111] border border-white/10'}`}>
        <div className={`p-6 pt-8 text-center border-b ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-white/5'}`}>
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/10">
            <Scissors size={28} className={isLightMode ? 'text-gray-700' : 'text-white/80'} />
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Добро пожаловать в НейроСтилист</h2>
          <p className={`text-sm mt-3 leading-relaxed max-w-sm mx-auto ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
            Уникальная ИИ-платформа для подбора идеальной прически. Мы анализируем вашу форму лица, 
            густоту волос и структуру, чтобы создать безупречный реалистичный образ до похода в салон.
          </p>
        </div>
        
        <div className={`p-6 space-y-4 ${isLightMode ? 'bg-white' : ''}`}>
          {showSalonNameInput ? (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
              <h3 className={`text-lg font-medium text-center ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>Укажите название вашего салона</h3>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                placeholder="Например: Салон 'Красота'"
                className={`w-full p-4 rounded-xl border outline-none transition-colors text-center ${isLightMode ? 'bg-gray-50 text-gray-900 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400' : 'bg-[#1A1A1A] text-white border-white/10 focus:border-purple-500/50 placeholder:text-white/30'}`}
              />
              <button 
                onClick={() => {
                    setUserRole('salon');
                    setShowWelcome(false);
                    localStorage.setItem("userRole", "salon");
                    localStorage.setItem("welcomeShown", "true");
                    localStorage.setItem("salonName", salonName);
                }}
                disabled={!salonName.trim()}
                className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Продолжить
              </button>
              <button onClick={() => setShowSalonNameInput(false)} className={`text-sm transition-colors ${isLightMode ? 'text-gray-500 hover:text-gray-800' : 'text-white/50 hover:text-white/80'}`}>
                Назад
              </button>
            </div>
          ) : (
            <>
              <h3 className={`text-sm font-semibold mb-2 text-center uppercase tracking-wider ${isLightMode ? 'text-gray-500' : 'text-white/40'}`}>
                Кто вы?
              </h3>
              <button 
                onClick={() => {
                  setUserRole('client');
                  setShowWelcome(false);
                  localStorage.setItem("userRole", "client");
                  localStorage.setItem("welcomeShown", "true");
                }}
                className={`w-full text-left p-4 rounded-2xl border active:scale-[0.98] transition-all group flex items-center gap-4 ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform ${isLightMode ? 'bg-blue-50 border-blue-200' : 'bg-blue-500/20 border-blue-500/30'}`}>
                  <User size={24} className={isLightMode ? 'text-blue-500' : 'text-blue-400'} />
                </div>
                <div>
                  <h3 className={`font-bold ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>Ищу свой стиль</h3>
                  <p className={`text-sm mt-0.5 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Хочу подобрать идеальную стрижку и цвет волос для себя</p>
                </div>
              </button>

              <button 
                onClick={() => {
                  setUserRole('master');
                  setShowWelcome(false);
                  localStorage.setItem("userRole", "master");
                  localStorage.setItem("welcomeShown", "true");
                }}
                className={`w-full text-left p-4 rounded-2xl border active:scale-[0.98] transition-all group flex items-center gap-4 ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform ${isLightMode ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/20 border-amber-500/30'}`}>
                  <Scissors size={24} className={isLightMode ? 'text-amber-500' : 'text-amber-400'} />
                </div>
                <div>
                  <h3 className={`font-bold ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>Я стилист / мастер</h3>
                  <p className={`text-sm mt-0.5 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Буду показывать клиентам варианты до стрижки</p>
                </div>
              </button>

              <button 
                onClick={() => setShowSalonNameInput(true)}
                className={`w-full text-left p-4 rounded-2xl border active:scale-[0.98] transition-all group flex items-center gap-4 ${isLightMode ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform ${isLightMode ? 'bg-purple-50 border-purple-200' : 'bg-purple-500/20 border-purple-500/30'}`}>
                  <Store size={24} className={isLightMode ? 'text-purple-500' : 'text-purple-400'} />
                </div>
                <div>
                  <h3 className={`font-bold ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>Я владелец салона</h3>
                  <p className={`text-sm mt-0.5 ${isLightMode ? 'text-gray-500' : 'text-white/50'}`}>Хочу внедрить этот инструмент для своих мастеров</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
