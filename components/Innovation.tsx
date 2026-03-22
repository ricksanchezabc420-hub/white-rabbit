'use client';

import { motion } from 'framer-motion';

export default function Innovation() {
  return (
    <section id="innovations" className="relative min-h-[60vh] md:min-h-screen flex flex-col md:flex-row items-center justify-between border-t border-white/5 py-12 md:py-0">
      {/* Text Content */}
      <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm tracking-[0.2em] text-neon-pink uppercase mb-4">The Science</h2>
          <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Biomass Removal vs. <br/> Traditional Methods
          </h3>
          <p className="text-white/60 text-lg mb-8 max-w-lg font-light leading-relaxed">
            By completely stripping the raw organic matter, we extract purely stabilized psilocin. 
            This revolutionary process eliminates the nausea associated with traditional consumption, 
            allowing for a pristine, rapid 15-minute onset.
          </p>
        </motion.div>
      </div>

      {/* Video Content */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden">
        <video 
          src="/videos/science.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
        />
        {/* Gradient wash corresponding to our dark mode UI */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent hidden md:block" />
        {/* Bottom fade for all devices */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
    </section>
  );
}
