import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { useModalBackButton } from "../hooks/useTelegramBackButton";

interface FeedbackModalProps {
  userId: string | null;
  isLightMode: boolean;
  onClose: () => void;
  telegramInitData?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ userId, isLightMode, onClose, telegramInitData }) => {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useModalBackButton(true, onClose);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tgUserId, name, text })
      });
      if (window.Telegram?.WebApp?.showAlert) {
         window.Telegram.WebApp.showAlert("Спасибо за ваш отзыв!");
      } else {
         alert("Спасибо за ваш отзыв!");
      }
      onClose();
    } catch (e) {
      console.error(e);
      if (window.Telegram?.WebApp?.showAlert) {
         window.Telegram.WebApp.showAlert("Ошибка отправки.");
      } else {
         alert("Ошибка отправки.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isLightMode ? 'bg-white text-gray-900' : 'bg-[#18181b] text-white border border-white/10'}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/10 text-gray-500'}`}>
          <X size={18} />
        </button>
        <h3 className="text-xl font-bold mb-4">Обратная связь</h3>
        <p className={`text-sm mb-4 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
          Есть вопросы или предложения? Напишите нам, и мы ответим вам!
        </p>
        <input 
          placeholder="Ваше имя (необязательно)"
          value={name}
          onChange={e => setName(e.target.value)}
          className={`w-full p-3 rounded-xl mb-3 outline-none border transition-colors ${isLightMode ? 'bg-gray-50 border-gray-200 focus:border-blue-500' : 'bg-black/20 border-white/10 focus:border-blue-500 text-white'}`}
        />
        <textarea 
          placeholder="Ваш вопрос или отзыв..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          className={`w-full p-3 rounded-xl mb-4 outline-none border transition-colors resize-none ${isLightMode ? 'bg-gray-50 border-gray-200 focus:border-blue-500' : 'bg-black/20 border-white/10 focus:border-blue-500 text-white'}`}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Отправка..." : "Отправить"} <Send size={16} />
        </button>
      </div>
    </div>
  );
};
