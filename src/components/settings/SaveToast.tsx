import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SaveToastProps {
  show: boolean;
  message?: string;
}

export const SaveToast: React.FC<SaveToastProps> = ({ 
  show, 
  message = "Settings saved successfully!" 
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50 bg-green text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
    >
      <Check className="w-4 h-4" />
      {message}
    </motion.div>
  );
};
