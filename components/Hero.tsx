'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Video (Muted, Autoplay, Loop) */}
      <div className="absolute inset-0 z-[-1] bg-black">
        <video 
          src="/videos/hero.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-contain md:object-cover opacity-60"
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
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif tracking-tighter mb-4 leading-none">
          PSILOCYBIN <br />
          <span className="neon-glow-pink italic block mt-2">REIMAGINED</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl lg:text-2xl font-light text-white/70 mb-10 text-balance">
          Fast-acting, flavourful, and formulated for the modern mind.
        </p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-neon-pink text-black px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(255,0,255,0.6)] transition-shadow duration-300"
        >
          Explore the Collection
        </motion.button>
      </motion.div>
    </section>
  );
}
