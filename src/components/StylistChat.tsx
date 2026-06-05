import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Loader2, X } from 'lucide-react';

interface StylistChatProps {
  onClose: () => void;
  features: any;
  styleName?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const StylistChat: React.FC<StylistChatProps> = ({ onClose, features, styleName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: `Привет! Я твой ИИ-стилист. ${styleName ? `У нас выбрана стрижка "${styleName}". ` : ''}Готов ответить на любые вопросы о твоих волосах и стиле.` }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputVal.trim() || isLoading) return;
    
    const userMessage = inputVal.trim();
    setInputVal("");
    
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Create api message history
      const apiMessages = newMessages
        .filter(m => m.role === 'user' || m.text.startsWith('<')) // Skip initial text conceptually or just send
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch("/api/chat-stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          features,
          styleName
        })
      });

      if (!res.ok) {
         let err = await res.text();
         try {
            const data = JSON.parse(err);
            err = data.error || err;
         } catch(e) {}
         throw new Error(err);
      }

      const { replyHtml } = await res.json();
      setMessages([...newMessages, { role: 'assistant', text: replyHtml }]);
    } catch (e: any) {
      console.error(e);
      setMessages([...newMessages, { role: 'assistant', text: `<p class="text-red-400">Ошибка: ${e.message}</p>` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/60 sm:bg-white/10 sm:backdrop-blur-md animate-in fade-in duration-300">
       <div className="w-full sm:w-[450px] bg-[#111] sm:rounded-2xl h-[85vh] sm:h-[600px] flex flex-col border border-white/10 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-black/40 sm:rounded-t-2xl">
             <div className="flex items-center gap-2 text-white/90 font-medium">
                <Sparkles size={18} className="text-emerald-400" />
                <span>Чат со Стилистом</span>
             </div>
             <button onClick={onClose} className="p-2 text-white/50 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X size={18} />
             </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {m.role === 'assistant' && (
                     <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <Sparkles size={14} />
                     </div>
                   )}
                   <div 
                      className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                        m.role === 'user' 
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 rounded-tr-sm' 
                        : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-sm chat-html'
                      }`}
                      dangerouslySetInnerHTML={m.role === 'assistant' ? { __html: m.text } : undefined}
                   >
                     {m.role === 'user' ? m.text : undefined}
                   </div>
                </div>
             ))}
             {isLoading && (
               <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <Sparkles size={14} />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-3 flex items-center h-[42px] px-4">
                     <Loader2 size={16} className="animate-spin text-emerald-400" />
                  </div>
               </div>
             )}
             <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/40 border-t border-white/10 sm:rounded-b-2xl">
             <form 
               onSubmit={(e) => { e.preventDefault(); handleSend(); }}
               className="flex items-center gap-2"
             >
                <input 
                   type="text"
                   value={inputVal}
                   onChange={e => setInputVal(e.target.value)}
                   disabled={isLoading}
                   placeholder="Спроси, подойдет ли стрижка..."
                   className="flex-1 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/20 rounded-full px-5 py-3 outline-none text-white text-sm transition-colors"
                />
                <button
                   type="submit"
                   disabled={!inputVal.trim() || isLoading}
                   className="w-[46px] h-[46px] shrink-0 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center text-white transition-colors"
                >
                   <Send size={18} className="translate-x-[1px]" />
                </button>
             </form>
          </div>
       </div>
       <style>{`
         .chat-html p { margin-bottom: 0.5rem; }
         .chat-html p:last-child { margin-bottom: 0; }
         .chat-html ul { list-style: disc; margin-left: 1rem; margin-bottom: 0.5rem; }
         .chat-html li { margin-bottom: 0.25rem; }
       `}</style>
    </div>
  );
};
