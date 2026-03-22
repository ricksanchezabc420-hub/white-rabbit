'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [entered, setEntered] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    // Lock scrolling while the splash screen is active
    if (!entered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup on unmount just in case
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [entered]);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Subtle background ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.08)_0%,transparent_50%)] pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="flex flex-col items-center relative z-10"
          >
            <AnimatePresence mode="wait">
              {!showAgeVerification ? (
                <motion.div
                  key="initial-content"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative w-48 h-48 mb-8">
                    <motion.img 
                      src="/logo.png" 
                      alt="White Rabbit Neon Logo" 
                      initial={{ opacity: 0, filter: "brightness(0.1) drop-shadow(0 0 0px rgba(255,0,255,0))" }}
                      animate={{ 
                        opacity: [0, 1, 0, 1, 0.5, 1, 0.8, 1],
                        filter: [
                          "brightness(0.1) drop-shadow(0 0 0px rgba(255,0,255,0))",
                          "brightness(1.2) drop-shadow(0 0 20px rgba(255,0,255,0.8))",
                          "brightness(0.1) drop-shadow(0 0 0px rgba(255,0,255,0))",
                          "brightness(1.2) drop-shadow(0 0 20px rgba(255,0,255,0.8))",
                          "brightness(0.5) drop-shadow(0 0 10px rgba(255,0,255,0.4))",
                          "brightness(1.2) drop-shadow(0 0 20px rgba(255,0,255,0.8))",
                          "brightness(0.8) drop-shadow(0 0 15px rgba(255,0,255,0.6))",
                          "brightness(1) drop-shadow(0 0 20px rgba(255,0,255,0.6))"
                        ]
                      }}
                      transition={{ 
                        duration: 3.5,
                        delay: 0.8,
                        times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1],
                        ease: "easeInOut"
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-serif tracking-[0.1em] text-white mb-16 select-none">
                    WHITE RABBIT
                  </h1>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAgeVerification(true)}
                    className="px-10 py-5 bg-transparent border border-white/20 hover:border-white/80 text-white rounded-full tracking-[0.2em] text-sm md:text-base uppercase transition-all duration-300"
                  >
                    Enter the Rabbit Hole
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="age-verification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center text-center p-8 glass rounded-3xl border border-white/10"
                >
                  <h2 className="text-2xl md:text-4xl font-serif mb-6 text-white tracking-widest">
                    AGE VERIFICATION
                  </h2>
                  <p className="text-white/60 mb-12 max-w-sm text-sm md:text-base font-light">
                    This site contains content relating to psilocybin products. 
                    You must be at least 19 years of age to enter.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)", color: "black" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEntered(true)}
                      className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all"
                    >
                      I am 19 or Older
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,0,0,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = 'https://google.com'}
                      className="px-8 py-4 bg-transparent border border-white/10 text-white/40 hover:text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all"
                    >
                      Exit
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
