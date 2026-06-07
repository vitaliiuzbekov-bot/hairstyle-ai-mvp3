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

           const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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
       <div className={`w-full sm:w-[450px] sm:rounded-2xl h-[85vh] sm:h-[600px] flex flex-col shadow-2xl relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 ${isLightMode ? 'bg-white border-gray-200 border' : 'bg-[#111] border border-white/10'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-4 border-b sm:rounded-t-2xl ${isLightMode ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-black/40'}`}>
             <div className={`flex items-center gap-2 font-medium ${isLightMode ? 'text-gray-800' : 'text-white/90'}`}>
                <Sparkles size={18} className="text-emerald-500" />
                <span>Чат со Стилистом</span>
             </div>
             <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isLightMode ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-200' : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'}`}>
                <X size={18} />
             </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
             {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {m.role === 'assistant' && (
                     <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Sparkles size={14} />
                     </div>
                   )}
                   <div 
                      className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                        m.role === 'user' 
                        ? 'bg-blue-600 border border-blue-500/30 text-white rounded-tr-sm' 
                        : (isLightMode ? 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-sm chat-html' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-sm chat-html')
                      }`}
                      dangerouslySetInnerHTML={m.role === 'assistant' ? { __html: m.text } : undefined}
                   >
                     {m.role === 'user' ? m.text : undefined}
                   </div>
                </div>
             ))}
             {isLoading && (
               <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <Sparkles size={14} />
                  </div>
                  <div className={`border rounded-2xl rounded-tl-sm p-3 flex items-center h-[42px] px-4 ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
                     <Loader2 size={16} className="animate-spin text-emerald-500" />
                  </div>
               </div>
             )}
             <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t sm:rounded-b-2xl ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-black/40 border-white/10'}`}>
             {micError && (
               <div className="mb-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-2 px-3 flex justify-between items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
                 <span>{micError}</span>
                 <button type="button" onClick={() => setMicError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm">×</button>
               </div>
             )}
             <form 
               onSubmit={(e) => { e.preventDefault(); handleSend(); }}
               className="flex items-center gap-2"
             >
                <div className="flex-1 relative">
                  <input 
                     type="text"
                     value={isRecording ? "🎙️ Запись..." : inputVal}
                     onChange={e => setInputVal(e.target.value)}
                     disabled={isLoading || isRecording}
                     placeholder="Спроси, подойдет ли стрижка..."
                     className={`w-full rounded-full pl-5 pr-12 py-3 outline-none text-sm transition-colors disabled:opacity-70 ${isLightMode ? 'bg-white focus:bg-white border border-gray-300 focus:border-blue-400 text-gray-900 shadow-sm' : 'bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/20 text-white'}`}
                  />
                  {isRecording ? (
                     <button
                       type="button"
                       onClick={stopRecording}
                       className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors animate-pulse"
                     >
                       <Square size={16} className="fill-current" />
                     </button>
                  ) : (
                     <button
                       type="button"
                       onClick={startRecording}
                       disabled={isLoading}
                       className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isLightMode ? 'text-gray-400 hover:text-blue-500 hover:bg-blue-50' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                     >
                       <Mic size={18} />
                     </button>
                  )}
                </div>
                <button
                   type="submit"
                   disabled={!inputVal.trim() || isLoading || isRecording}
                   className="w-[46px] h-[46px] shrink-0 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 flex items-center justify-center text-white transition-colors shadow-sm shadow-emerald-500/20"
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
