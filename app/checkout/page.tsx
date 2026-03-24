'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { createOrder } from '@/app/actions/orderActions';

export default function CheckoutPage() {
  const { items, getCartTotal, getCartTotalCAD, clearCart } = useCartStore();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<'CRYPTO' | 'E-TRANSFER'>('CRYPTO');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    shippingName: '', email: '', address: '', city: '', stateProvince: '', postalCode: '', country: ''
  });

  const total = getCartTotal();

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
        <Link href="/"><button className="bg-white text-black px-8 py-3 rounded-full font-bold">Return Home</button></Link>
      </div>
    );
  }

  const handleProcessOrder = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'CRYPTO') {
        if (!isConnected) {
          alert('Please connect your Web3 wallet first.');
          setIsProcessing(false);
          return;
        }
        // Mocking a USDC/ETH transaction for demonstration (0.001 ETH roughly maps to a test transaction)
        await sendTransactionAsync({
          to: '0x0000000000000000000000000000000000000000', // Dead address for demo
          value: parseEther('0.001'),
        });
      }

      // Save to Database
      const result = await createOrder({
        ...formData,
        paymentMethod,
        totalUsd: total.toString(),
        items: items, // Pass as object for the JSON column
        walletAddress: isConnected ? 'CONNECTED' : null, // Simplified for now
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      
      clearCart();
      setStep(3);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Order failed: ${error.message || 'Transmission interrupted.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Flow */}
        <div className="lg:w-2/3">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>

          <h1 className="text-4xl md:text-5xl font-serif mb-8">Secure Checkout</h1>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
              <h2 className="text-xl font-medium mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-neon-pink" /> 1. Shipping Details</h2>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, shippingName: e.target.value})} />
                  <input required type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <input required placeholder="Street Address" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, address: e.target.value})} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input required placeholder="City" className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, city: e.target.value})} />
                  <input required placeholder="State / Prov" className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, stateProvince: e.target.value})} />
                  <input required placeholder="ZIP / Postal" className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                </div>
                <input required placeholder="Country" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, country: e.target.value})} />
                <button type="submit" className="w-full mt-6 bg-white text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">Continue to Payment</button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
              <h2 className="text-xl font-medium mb-6 flex items-center gap-2"><Wallet className="w-5 h-5 text-electric-blue" /> 2. Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button onClick={() => setPaymentMethod('CRYPTO')} className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'CRYPTO' ? 'bg-white/10 border-electric-blue shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
                  <span className="text-2xl">🌐</span>
                  <span className="font-bold">Web3 Crypto</span>
                  <span className="text-xs text-white/50">Instant on-chain settlement</span>
                </button>
                <button onClick={() => setPaymentMethod('E-TRANSFER')} className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'E-TRANSFER' ? 'bg-white/10 border-acid-green shadow-[0_0_15px_rgba(191,255,0,0.2)]' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
                  <span className="text-2xl">🏦</span>
                  <span className="font-bold">E-Transfer</span>
                  <span className="text-xs text-white/50">Manual bank transfer verification</span>
                </button>
              </div>

              {paymentMethod === 'E-TRANSFER' && (
                <div className="bg-acid-green/10 border border-acid-green/20 p-6 rounded-xl mb-8">
                  <h3 className="text-acid-green font-bold mb-2">E-Transfer Instructions</h3>
                  <p className="text-sm text-white/70">Please send exactly <strong>${total.toFixed(2)} USD</strong> (~${getCartTotalCAD().toFixed(2)} CAD) to <strong>pay@whiterabbit.com</strong>. Include your email address in the transfer notes. Your order will ship once the deposit is manually verified.</p>
                </div>
              )}

              <button 
                onClick={handleProcessOrder}
                disabled={isProcessing}
                className="w-full bg-neon-pink text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)} USDC`}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 rounded-3xl text-center flex flex-col items-center">
              <CheckCircle2 className="w-20 h-20 text-acid-green mb-6" />
              <h2 className="text-4xl font-serif mb-4">Order Confirmed</h2>
              <p className="text-white/60 mb-8 max-w-md">
                {paymentMethod === 'CRYPTO' 
                  ? "Your Web3 transaction was successfully verified on-chain. Generating shipping manifest." 
                  : "Your order is reserved. Please complete the e-transfer to finalize production and shipping."}
              </p>
              <Link href="/"><button className="bg-white/10 hover:bg-white hover:text-black border border-white/20 px-8 py-3 rounded-full font-bold transition-all">Return to Storefront</button></Link>
            </motion.div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:w-1/3">
          <div className="glass p-8 rounded-3xl sticky top-24">
            <h3 className="text-xl font-serif mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">{item.quantity}</span>
                    <span className="text-white/80">{item.name}</span>
                  </div>
                  <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Shipping</span>
                <span className="font-mono">Calculated at dispatch</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Taxes</span>
                <span className="font-mono">$0.00</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-end">
              <span className="font-bold pb-1">Total</span>
              <div className="text-right">
                <div className="text-2xl font-mono leading-none mb-1">${total.toFixed(2)} <span className="text-xs text-white/30 font-sans">USDC</span></div>
                <div className="text-sm font-mono text-white/40 italic">~${getCartTotalCAD().toFixed(2)} CAD</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
