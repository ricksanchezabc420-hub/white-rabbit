'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] md:min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-32 pb-16 md:py-0">
      {/* Background Video (Muted, Autoplay, Loop) */}
      <div className="absolute inset-0 z-[-1] bg-black">
        <video 
          src="/videos/hero.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="w-full h-full object-contain scale-[1.25] md:scale-100 md:object-cover opacity-60"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
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
          className="md:absolute md:bottom-12 bg-neon-pink text-black px-8 py-3 rounded-full font-bold text-sm hover:shadow-[0_0_40px_rgba(255,0,255,0.6)] transition-shadow duration-300"
        >
          Explore the Collection
        </motion.button>
      </motion.div>
    </section>
  );
}
