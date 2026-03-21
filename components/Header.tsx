'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ConnectKitButton } from 'connectkit';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';

export default function Header() {
  const { scrollY } = useScroll();
  const { items, toggleCart } = useCartStore();
  
  // Transition background and padding on scroll
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const py = useTransform(scrollY, [0, 50], ["1.5rem", "0.75rem"]);

  return (
    <motion.nav 
      style={{ paddingTop: py, paddingBottom: py }}
      className="fixed top-0 w-full z-50 px-6 sm:px-12 flex items-center justify-between transition-all"
    >
      <motion.div 
        style={{ opacity: headerOpacity }}
        className="absolute inset-0 z-[-1] glass pointer-events-none" 
      />
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 relative">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            fill
            sizes="40px"
            className="object-contain filter drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]"
          />
        </div>
        <span className="font-serif text-xl tracking-tighter neon-glow-pink select-none">WHITE RABBIT</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => document.getElementById('innovations')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-light hover:text-neon-pink transition-colors">Innovations</button>
        <button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-light hover:text-neon-pink transition-colors">Collection</button>
        <button onClick={() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-light hover:text-neon-pink transition-colors">Science</button>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => toggleCart()} className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
          <ShoppingCart className="w-5 h-5 text-white" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-pink text-black text-[10px] font-bold flex items-center justify-center">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          )}
        </button>

        <ConnectKitButton.Custom>
          {({ isConnected, show, truncatedAddress, ensName }) => {
            return (
              <button 
                onClick={show}
                className="glass px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
              >
                {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
              </button>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
    </motion.nav>
  );
}
