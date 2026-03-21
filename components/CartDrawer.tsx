'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, getCartTotal } = useCartStore();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-serif flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-neon-pink" /> CART</h2>
              <button onClick={() => toggleCart(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-light">Your cart is empty.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className={`w-16 h-16 rounded-xl bg-black border ${item.theme.replace('text-', 'border-')} flex flex-col items-center justify-center`}>
                      <span className={`text-[10px] tracking-widest font-bold ${item.theme}`}>RX</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${item.theme}`}>{item.name}</h3>
                      <p className="text-sm font-mono text-white/50">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/50 rounded-full border border-white/10 px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-neon-pink transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-acid-green transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/50 font-light">Subtotal</span>
                  <span className="text-2xl font-mono">${getCartTotal().toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => {
                    toggleCart(false);
                    router.push('/checkout');
                  }}
                  className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                >
                  SECURE CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
