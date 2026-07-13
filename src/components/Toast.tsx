import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({ message, onClose, isError = false }: { message: string, onClose: () => void, isError?: boolean }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);
  
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 left-4 right-4 z-50 p-4 rounded-xl shadow-lg border ${isError ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'} backdrop-blur-md flex justify-between items-center`}
        >
          <span className="font-medium text-sm">{message}</span>
          <button onClick={onClose} className="p-1 opacity-70 hover:opacity-100">✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
