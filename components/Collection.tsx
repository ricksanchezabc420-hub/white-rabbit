'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';

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

export default function Collection() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section id="collection" className="py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,255,255,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.2em] text-vibrant-purple uppercase mb-4">The Collection</h2>
          <h3 className="text-5xl md:text-6xl font-serif">Enter the Rabbit Hole</h3>
          <p className="mt-4 text-white/50 font-light max-w-xl mx-auto">
            3000MG Precision Dosing. Select your flavor and pay seamlessly with Web3 crypto.
          </p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`glass flex flex-col p-6 rounded-3xl transition-all duration-500 group ${product.bgHover}`}
            >
              {/* Product Image/Video Container */}
              <div className="w-full aspect-[3/4] rounded-2xl bg-black/50 mb-6 overflow-hidden relative border border-white/5">
                {/* High-fidelity product bottle image with screen blending for black backgrounds */}
                <img 
                  src={`/${product.imageFile}`}
                  alt={`${product.name} Bottle`}
                  className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-screen group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-auto">
                <h4 className={`text-2xl font-serif mb-2 ${product.theme} tracking-wide`}>{product.name}</h4>
                <p className="text-sm text-white/50 font-light mb-6 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg group-hover:text-white transition-colors text-white/80">$45 <span className="text-xs text-white/40">USDC</span></span>
                  
                  {/* Web3 CTA */}
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addItem({ id: product.id, name: product.name, price: 45, theme: product.theme })}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white text-white hover:text-black transition-all ${product.glow}`}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
