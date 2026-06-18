import React, { useState, useMemo } from "react";
import { ChevronLeft, HelpCircle, RefreshCw, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FaqPageProps {
  faqData: { q: string; a: string }[];
  isLightMode?: boolean;
}

export const FaqPage: React.FC<FaqPageProps> = ({ faqData, isLightMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const filteredFaq = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    const lowerQuery = searchQuery.toLowerCase();
    return faqData.filter(
      (item) => item.q.toLowerCase().includes(lowerQuery) || item.a.toLowerCase().includes(lowerQuery)
    );
  }, [faqData, searchQuery]);

  return (
    <div className={`min-h-screen p-6 animate-in fade-in slide-in-from-right-8 ${isLightMode ? 'bg-gray-50' : 'bg-[#050508]'}`}>
      <div className={`max-w-xl mx-auto border rounded-3xl p-6 relative shadow-xl backdrop-blur-md mt-8 flex flex-col ${isLightMode ? 'bg-white border-gray-200' : 'bg-white/10 border-white/10 text-white'}`}>
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-6 left-6 p-2 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-100 bg-gray-50' : 'hover:bg-white/20 bg-white/10'}`}
        >
          <ChevronLeft size={20} className={isLightMode ? 'text-gray-500' : 'text-white/60'} />
        </button>
        <div className="flex flex-col items-center gap-3 mb-6 shrink-0 mt-2">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <HelpCircle size={24} />
          </div>
          <h2 className={`text-2xl font-serif font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Вопросы и ответы</h2>
        </div>
        
        <div className="mb-6 relative shrink-0">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLightMode ? 'text-gray-400' : 'text-white/40'}`} />
          <input
            type="text"
            placeholder="Поиск по вопросам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-2xl outline-none transition-all ${isLightMode ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500/50 focus:bg-white border' : 'bg-white/5 border border-white/10 text-white focus:border-white/20 focus:bg-white/10'}`}
          />
        </div>
        
        <div className="space-y-3 pr-2 custom-scrollbar flex-1 pb-10">
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
