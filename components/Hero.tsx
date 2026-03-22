'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isEntered } = useUIStore();

  useEffect(() => {
    if (isEntered && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.error("Video play failed:", err));
    }
  }, [isEntered]);

  return (
    <section className="relative mt-20 md:mt-0 min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Video (Muted, Loop) */}
      <div className="absolute inset-0 z-[-1] bg-black">
        <video 
          ref={videoRef}
          src="/videos/hero.mp4"
          loop 
          muted 
          playsInline
          preload="auto"
          className="w-full h-full object-cover scale-[1.1] md:scale-100 opacity-60"
        />
        {/* Mobile top and bottom black fade for better video blending */}
        <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-black via-black/80 to-transparent md:hidden pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-black via-black/80 to-transparent md:hidden pointer-events-none" />
        
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tighter mb-4 leading-none">
          PSILOCYBIN <br />
          <span className="neon-glow-pink italic block mt-2">REIMAGINED</span>
        </h1>
        
        <p className="max-w-xl text-sm md:text-base lg:text-lg font-light text-white/70 mb-20 md:mb-32 text-balance">
          Fast-acting, flavourful, and formulated for the modern mind.
        </p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-16 md:bottom-10 bg-neon-pink text-black px-4 py-2 rounded-full font-serif font-bold text-xs hover:shadow-[0_0_40px_rgba(255,0,255,0.6)] transition-shadow duration-300"
        >
          Explore the Collection
        </motion.button>
      </motion.div>
    </section>
  );
}
