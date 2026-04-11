'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import Image from 'next/image';

const products = [
  {
    id: 'grape',
    name: "GRAPE",
    theme: "text-vibrant-purple",
    glow: "shadow-[0_0_20px_rgba(157,0,255,0.4)]",
    bgHover: "hover:border-vibrant-purple/50",
    description: "Deep, rich flavor masked by neon purple aesthetics.",
    imageFile: "purple-bottle.png"
  },
  {
    id: 'blue-raspberry',
    name: "BLUE RASPBERRY",
    theme: "text-electric-blue",
    glow: "shadow-[0_0_20px_rgba(0,255,255,0.4)]",
    bgHover: "hover:border-electric-blue/50",
    description: "Sharp, electrifying finish perfectly balanced.",
    imageFile: "blue-bottle.png"
  },
  {
    id: 'lemon-lime',
    name: "LEMON LIME",
    theme: "text-acid-green",
    glow: "shadow-[0_0_20px_rgba(191,255,0,0.4)]",
    bgHover: "hover:border-acid-green/50",
    description: "A bright, refreshing citrus wave.",
    imageFile: "green-bottle.png"
  },
  {
    id: 'watermelon',
    name: "WATERMELON",
    theme: "text-neon-pink",
    glow: "shadow-[0_0_20px_rgba(255,0,255,0.4)]",
    bgHover: "hover:border-neon-pink/50",
    description: "Smooth, sweet hydration and pure neon.",
    imageFile: "red-bottle.png"
  }
];

const comboPack = {
  id: 'combo-pack',
  name: "THE COMBO PACK",
  theme: "text-white",
  glow: "shadow-[0_0_40px_rgba(255,255,255,0.2)]",
  bgHover: "hover:border-white/50",
  description: "One of each signature 3000MG flavor. The ultimate sequence.",
  imageFile: "combo-pack.png",
  price: 130
};

export default function Collection() {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  return (
    <section id="collection" className="py-12 md:py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,255,255,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.2em] text-vibrant-purple uppercase mb-4">The Collection</h2>
          <h3 className="text-5xl md:text-6xl font-serif">DRINK DIFFERENT</h3>
          <p className="mt-4 text-white/50 font-light max-w-xl mx-auto">
            3000MG Precision Dosing. Select your flavor or enter the rabbit hole with the full collection.
          </p>
        </div>

        {/* 4-column Grid for individual bottles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`glass flex flex-col p-4 sm:p-6 rounded-3xl transition-all duration-500 group ${product.bgHover}`}
            >
              <div className="w-full aspect-[3/4] rounded-2xl bg-black/50 mb-6 overflow-hidden relative border border-white/5">
                <Image 
                  src={`/${product.imageFile}`}
                  alt={`${product.name} Bottle`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-contain p-4 mix-blend-screen group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-auto flex flex-col items-center text-center">
                <h4 className={`text-lg sm:text-2xl font-serif mb-1 sm:mb-2 ${product.theme} tracking-wide text-center`}>{product.name}</h4>
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 sm:gap-0">
                  <span className="font-mono text-base sm:text-lg group-hover:text-white transition-colors text-white/80">$35 <span className="text-[10px] sm:text-xs text-white/40">CAD</span></span>
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: 35, theme: product.theme });
                      setCartOpen(true);
                    }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white text-white hover:text-black transition-all ${product.glow}`}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Combo Pack Below */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`col-span-1 md:col-span-4 glass flex flex-col md:flex-row p-6 md:p-10 rounded-[40px] transition-all duration-700 group border border-white/10 hover:border-white/40 relative overflow-hidden ${comboPack.glow}`}
          >
            {/* Animated Gradient Border for "Pop" */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-full md:w-3/5 aspect-video md:aspect-auto md:h-96 rounded-3xl bg-black/40 mb-6 md:mb-0 md:mr-10 overflow-hidden relative border border-white/5">
              <Image 
                src={`/${comboPack.imageFile}`}
                alt={comboPack.name}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain p-6 md:p-8 mix-blend-screen group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-[10px] md:text-xs font-bold tracking-[0.2em] text-acid-green mb-6 border border-acid-green/20">PREMIUM SEQUENCE</div>
              <h4 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-wide uppercase leading-tight">{comboPack.name}</h4>
              <p className="text-white/50 text-sm md:text-base font-light mb-8 leading-relaxed max-w-md">
                {comboPack.description}
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-mono text-2xl text-white">$130 <span className="text-xs text-white/30">CAD</span></span>
                  <span className="text-[10px] text-acid-green font-bold uppercase tracking-widest">Free Shipping</span>
                </div>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    addItem({ id: comboPack.id, name: comboPack.name, price: 130, theme: comboPack.theme });
                    setCartOpen(true);
                  }}
                  className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
                >
                  Get the Pack
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
