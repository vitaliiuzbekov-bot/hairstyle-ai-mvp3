import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Loader2, X, Mic, Square } from 'lucide-react';

interface StylistChatProps {
  onClose: () => void;
  features: any;
  styleName?: string;
  isLightMode?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const StylistChat: React.FC<StylistChatProps> = ({ onClose, features, styleName, isLightMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: `Привет! Я твой ИИ-стилист. ${styleName ? `У нас выбрана стрижка "${styleName}". ` : ''}Готов ответить на любые вопросы о твоих волосах и стиле.` }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

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

      const initData = (window as any).Telegram?.WebApp?.initData || "";
      const res = await fetch("/api/chat-stylist", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(initData ? { "x-telegram-init-data": initData } : {})
        },
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

  const startRecording = async () => {
    setMicError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError("Запись аудио не поддерживается этим браузером или заблокирована настройками конфиденциальности.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
      else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
           chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        setIsLoading(true);
        try {
           const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
              reader.onerror = reject;
              reader.readAsDataURL(audioBlob);
           });

           const initData = (window as any).Telegram?.WebApp?.initData || "";
           const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                ...(initData ? { "x-telegram-init-data": initData } : {})
              },
              body: JSON.stringify({ audioBase64: base64, mimeType: audioBlob.type || 'audio/webm' })
           });

           if (res.ok) {
              const data = await res.json();
              if (data.text) {
                setInputVal(prev => prev + (prev ? " " : "") + data.text);
              }
           } else {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || "Ошибка расшифровки аудио");
           }
        } catch(e: any) {
           console.error("Transcription error", e);
           setMicError(e.message || "Ошибка распознавания голоса.");
        } finally {
           setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e: any) {
      console.error("Microphone access denied or error:", e);
      setMicError("Доступ к микрофону отклонен. Одобрите доступ в настройках браузера или откройте приложение в отдельной вкладке.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[110] flex items-end sm:items-center justify-center animate-in fade-in duration-300 ${isLightMode ? 'bg-black/20 sm:bg-white/40' : 'bg-black/60 sm:bg-white/10'} sm:backdrop-blur-md`}>
                     <div className={`w-full sm:w-[450px] sm:rounded-2xl h-[90vh] sm:h-[650px] flex flex-col shadow-2xl relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 backdrop-blur-sm ${isLightMode ? 'bg-white/95 border-gray-200 border' : 'bg-[#0f0c1b]/95 border border-white/10'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b sm:rounded-t-2xl z-10 relative shadow-sm ${isLightMode ? 'border-gray-200 bg-white/80' : 'border-white/10 bg-black/40'}`}>
             <div className={`flex items-center gap-3 font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${isLightMode ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                   <Sparkles size={18} className="animate-pulse" />
                </div>
                <div className="flex flex-col">
                   <span className="leading-tight text-base font-semibold tracking-tight">ИИ-Стилист</span>
                   <span className={`text-[10px] uppercase tracking-widest ${isLightMode ? 'text-emerald-600 font-medium' : 'text-emerald-400/80'}`}>Онлайн</span>
                </div>
             </div>
             <button onClick={onClose} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors active:scale-95 ${isLightMode ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'}`}>
                <X size={18} />
             </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6 font-sans relative">
             <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
             <div className="relative z-10 space-y-6">
               {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     {m.role === 'assistant' && (
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1 ${isLightMode ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                          <Sparkles size={14} />
                       </div>
                     )}
                     <div 
                        className={`max-w-[85%] rounded-2xl p-3.5 text-[15px] leading-relaxed shadow-sm ${
                          m.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500/30 text-white rounded-tr-sm shadow-blue-500/20' 
                          : (isLightMode ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm chat-html shadow-sm' : 'bg-white/[0.04] backdrop-blur-md border border-white/10 text-white/90 rounded-tl-sm chat-html')
                        }`}
                        dangerouslySetInnerHTML={m.role === 'assistant' ? { __html: m.text } : undefined}
                     >
                       {m.role === 'user' ? m.text : undefined}
                     </div>
                  </div>
               ))}
               {isLoading && (
                 <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1 ${isLightMode ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                        <Sparkles size={14} />
                    </div>
                    <div className={`border rounded-2xl rounded-tl-sm py-3.5 px-4 flex items-center gap-1.5 shadow-sm ${isLightMode ? 'bg-white border-gray-100' : 'bg-white/[0.04] border-white/10 backdrop-blur-md'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`}></div>
                       <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`}></div>
                       <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`}></div>
                    </div>
                 </div>
               )}
               <div ref={endRef} className="h-2" />
             </div>
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t sm:rounded-b-2xl z-10 relative shadow-[0_-4px_20px_rgba(0,0,0,0.03)] ${isLightMode ? 'bg-white/80 border-gray-100 backdrop-blur-md' : 'bg-black/40 border-white/10'}`}>
             {micError && (
               <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-2.5 px-3.5 flex justify-between items-center shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
                 <span>{micError}</span>
                 <button type="button" onClick={() => setMicError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2 text-base">×</button>
               </div>
             )}
             <form 
               onSubmit={(e) => { e.preventDefault(); handleSend(); }}
               className="flex items-end gap-2"
             >
                <div className="flex-1 relative">
                  <textarea
                     value={isRecording ? "🎙️ Идет запись, говорите..." : inputVal}
                     onChange={e => setInputVal(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSend();
                       }
                     }}
                     disabled={isLoading || isRecording}
                     placeholder="Задайте вопрос стилисту..."
                     rows={Math.min(Math.max((inputVal.match(/\n/g) || []).length + 1, 1), 4)}
                     className={`w-full rounded-2xl pl-5 pr-12 py-3.5 resize-none outline-none text-[15px] transition-all disabled:opacity-70 custom-scrollbar ${isLightMode ? 'bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-400 text-gray-900 shadow-inner focus:shadow-md' : 'bg-white/5 focus:bg-white/10 border border-white/10 focus:border-blue-500/50 text-white'}`}
                     style={{ minHeight: '52px', maxHeight: '120px' }}
                  />
                  {isRecording ? (
                     <button
                       type="button"
                       onClick={stopRecording}
                       className="absolute right-2 top-[8px] w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors animate-pulse"
                     >
                       <Square size={16} className="fill-current" />
                     </button>
                  ) : (
                     <button
                       type="button"
                       onClick={startRecording}
                       disabled={isLoading}
                       className={`absolute right-2 top-[8px] w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isLightMode ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' : 'text-white/40 hover:text-blue-400 hover:bg-blue-500/10'}`}
                     >
                       <Mic size={20} />
                     </button>
                  )}
                </div>
                <button
                   type="submit"
                   disabled={!inputVal.trim() || isLoading || isRecording}
                   className={`w-[52px] h-[52px] shrink-0 rounded-2xl disabled:opacity-50 flex items-center justify-center text-white transition-all shadow-sm active:scale-95 ${
                     !inputVal.trim() || isLoading || isRecording
                       ? (isLightMode ? 'bg-gray-200 text-gray-400 shadow-none' : 'bg-white/10 text-white/30 shadow-none')
                       : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                   }`}
                >
                   <Send size={20} className="translate-x-[2px] translate-y-[-1px]" />
                </button>
             </form>
             <div className={`text-center mt-2 text-[10px] ${isLightMode ? 'text-gray-400' : 'text-white/40'}`}>
               Нажмите Enter для отправки, Shift+Enter для переноса строки
             </div>
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
