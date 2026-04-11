'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function FreeShippingBanner() {
  const isEntered = useUIStore((state) => state.isEntered);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isEntered) {
      setIsVisible(true);
    }
  }, [isEntered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-0 right-0 z-40 flex justify-center pointer-events-none"
        >
          <motion.div
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98],
              textShadow: [
                "0 0 5px rgba(255,255,255,0.2)",
                "0 0 15px rgba(0,255,255,0.5)",
                "0 0 5px rgba(255,255,255,0.2)"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] py-2 px-6 rounded-full"
          >
            FREE SHIPPING ON ORDERS OVER $130
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
