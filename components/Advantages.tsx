'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Beaker, Clock } from 'lucide-react';

const advantages = [
  {
    title: "15-20 Min Onset",
    description: "Rapid absorption bypassing standard digestion delay.",
    icon: <Zap className="w-6 h-6 text-electric-blue" />,
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "No Nausea",
    description: "Stripped of organic biomass, leaving only pure active compounds.",
    icon: <ShieldCheck className="w-6 h-6 text-neon-pink" />,
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "Shelf Stability",
    description: "Formulated to retain maximum potency over extended time.",
    icon: <Clock className="w-6 h-6 text-acid-green" />,
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "Precision Dosing",
    description: "Exactly 500mg per 10mL for consistent, reliable experiences.",
    icon: <Beaker className="w-6 h-6 text-vibrant-purple" />,
    className: "md:col-span-1 md:row-span-1"
  }
];

export default function Advantages() {
  return (
    <section id="science" className="py-12 md:py-24 px-6 md:px-12 lg:px-24 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.2em] text-electric-blue uppercase mb-4">Core Advantages</h2>
          <h3 className="text-4xl md:text-5xl font-serif">Designed For Different Surroundings</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6">
          {advantages.map((adv, index) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass p-4 sm:p-8 rounded-2xl group hover:border-white/20 transition-all flex flex-col items-center text-center ${adv.className}`}
            >
              <div className="bg-white/5 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                {adv.icon}
              </div>
              <h4 className="text-base sm:text-xl font-medium mb-2 sm:mb-3">{adv.title}</h4>
              <p className="text-[11px] sm:text-sm md:text-base text-white/60 font-light leading-snug sm:leading-relaxed">{adv.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
