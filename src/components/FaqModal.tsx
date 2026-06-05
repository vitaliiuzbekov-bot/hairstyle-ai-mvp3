import React from "react";
import { X, HelpCircle, RefreshCw } from "lucide-react";

interface FaqModalProps {
  isFaqOpen: boolean;
  setIsFaqOpen: (open: boolean) => void;
  faqData: { q: string; a: string }[];
  isLightMode?: boolean;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isFaqOpen, setIsFaqOpen, faqData, isLightMode }) => {
  if (!isFaqOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 ${isLightMode ? 'bg-black/40' : 'bg-black/80'}`}>
      <div className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl relative ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#111] border-white/10'}`}>
        <button
          onClick={() => setIsFaqOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
        >
          <X size={20} className={isLightMode ? 'text-gray-500' : 'text-white/60'} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <HelpCircle size={20} />
          </div>
          <h2 className={`text-xl font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Гайд по использованию и Частые вопросы</h2>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {faqData.length > 0 ? (
            faqData.map((item, index) => (
              <div key={index} className={`p-4 rounded-2xl border ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/5'}`}>
                <h3 className={`font-medium mb-2 ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>{item.q}</h3>
                <p className={`text-sm leading-relaxed whitespace-pre-line ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>{item.a}</p>
              </div>
            ))
          ) : (
            <div className={`text-center py-6 ${isLightMode ? 'text-gray-400' : 'text-white/40'}`}>
              <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
              <p>Загрузка вопросов...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
