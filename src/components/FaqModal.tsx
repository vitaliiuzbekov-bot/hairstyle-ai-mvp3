import React, { useState, useMemo } from "react";
import { X, HelpCircle, RefreshCw, Search, ChevronDown } from "lucide-react";

interface FaqModalProps {
  isFaqOpen: boolean;
  setIsFaqOpen: (open: boolean) => void;
  faqData: { q: string; a: string }[];
  isLightMode?: boolean;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isFaqOpen, setIsFaqOpen, faqData, isLightMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaq = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    const lowerQuery = searchQuery.toLowerCase();
    return faqData.filter(
      (item) => item.q.toLowerCase().includes(lowerQuery) || item.a.toLowerCase().includes(lowerQuery)
    );
  }, [faqData, searchQuery]);

  if (!isFaqOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 ${isLightMode ? 'bg-black/40' : 'bg-black/80'}`}>
      <div className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl relative flex flex-col max-h-[85vh] ${isLightMode ? 'bg-white border-gray-200' : 'bg-[#111] border-white/10'}`}>
        <button
          onClick={() => setIsFaqOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
        >
          <X size={20} className={isLightMode ? 'text-gray-500' : 'text-white/60'} />
        </button>
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <HelpCircle size={20} />
          </div>
          <h2 className={`text-xl font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Вопросы и ответы</h2>
        </div>
        
        <div className="mb-4 relative shrink-0">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLightMode ? 'text-gray-400' : 'text-white/40'}`} />
          <input
            type="text"
            placeholder="Поиск по вопросам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-2xl outline-none transition-all ${isLightMode ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500/50 focus:bg-white border' : 'bg-white/5 border border-white/10 text-white focus:border-white/20 focus:bg-white/10'}`}
          />
        </div>
        
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {faqData.length === 0 ? (
            <div className={`text-center py-8 ${isLightMode ? 'text-gray-400' : 'text-white/40'}`}>
              <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
              <p>Загрузка вопросов...</p>
            </div>
          ) : filteredFaq.length === 0 ? (
            <div className={`text-center py-8 ${isLightMode ? 'text-gray-500' : 'text-white/40'}`}>
              <p>Ничего не найдено по вашему запросу</p>
            </div>
          ) : (
            filteredFaq.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div 
                  key={index} 
                  className={`rounded-2xl border transition-all overflow-hidden ${isLightMode ? 'bg-white border-gray-200 hover:border-gray-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isExpanded && isLightMode ? 'bg-gray-50' : isExpanded ? 'bg-white/5' : ''}`}
                  >
                    <h3 className={`font-medium pr-4 ${isLightMode ? 'text-gray-900' : 'text-white/90'}`}>{item.q}</h3>
                    <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isLightMode ? 'text-gray-400' : 'text-white/40'}`} />
                  </button>
                  <div className={`grid transition-all duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className={`p-4 pt-0 text-sm leading-relaxed whitespace-pre-line ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
                        {item.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
