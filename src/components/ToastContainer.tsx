import React from 'react';
import { useUI } from '../context/UIContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastContainerProps {
  isLightMode?: boolean;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ isLightMode }) => {
  const { toasts, removeToast } = useUI();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border backdrop-blur-md
              ${toast.type === 'error' ? isLightMode ? 'bg-red-50 border-red-200 text-red-800 shadow-red-500/10' : 'bg-red-500/10 border-red-500/30 text-red-100' : ''}
              ${toast.type === 'success' ? isLightMode ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100' : ''}
              ${toast.type === 'info' ? isLightMode ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-500/10' : 'bg-blue-500/10 border-blue-500/30 text-blue-100' : ''}
            `}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' && <AlertCircle className={isLightMode ? "text-red-500" : "text-red-400"} size={20} />}
              {toast.type === 'success' && <CheckCircle className={isLightMode ? "text-emerald-500" : "text-emerald-400"} size={20} />}
              {toast.type === 'info' && <Info className={isLightMode ? "text-blue-500" : "text-blue-400"} size={20} />}
            </div>
            <div className={`flex-1 text-sm font-medium leading-relaxed ${isLightMode ? 'text-gray-900' : ''}`} dangerouslySetInnerHTML={{ __html: toast.message }} />
            <button
              onClick={() => removeToast(toast.id)}
              className={`shrink-0 opacity-50 hover:opacity-100 transition-opacity ${isLightMode ? 'text-gray-500 hover:text-gray-900' : ''}`}
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
