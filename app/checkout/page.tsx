'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Wallet, Truck, Package, Info, CheckCircle2, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { getShippingRates, createOrder } from '@/app/actions/orderActions';
import { validateDiscount } from '@/app/actions/discountActions';
import AddressAutocomplete from '@/components/AddressAutocomplete';

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET || '0x0000000000000000000000000000000000000000';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart, getCartTotalUSDC } = useCartStore();
  
  
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Success
  const [isLoading, setIsLoading] = useState(false);
  const [shippingRate, setShippingRate] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CRYPTO' | 'E-TRANSFER'>('CRYPTO');
  const [isProcessing, setIsProcessing] = useState(false);

  // Discount state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const [formData, setFormData] = useState({
    shippingName: '',
    email: '',
    address: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'CA',
    transactionHash: '', // v7.0 Manual Hash
  });

  const subtotal = getCartTotal();
  const isFreeShipping = subtotal >= 150;
  const shippingCharge = isFreeShipping ? 0 : (shippingRate ? parseFloat(shippingRate.amount) : 0);
  
  const discountAmount = appliedDiscount ? parseFloat(appliedDiscount.amount) : 0;
  const totalCad = Math.max(0, subtotal + shippingCharge - discountAmount);
  // Estimation for display
  const totalUsdc = totalCad * 0.73; // v7.0 current market approx

  const handleAddressSelected = (addressData: any) => {
    setFormData((prev) => ({
      ...prev,
      address: addressData.address,
      city: addressData.city,
      stateProvince: addressData.stateProvince,
      postalCode: addressData.postalCode,
      country: addressData.country
    }));
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setIsValidatingDiscount(true);
    setDiscountError('');
    
    try {
      const result = await validateDiscount(discountCode, subtotal);
      if (result.success) {
        setAppliedDiscount(result.discount);
        setDiscountCode('');
      } else {
        setDiscountError(result.error || 'Invalid code');
      }
    } catch (err) {
      setDiscountError('Validation failed.');
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const unitCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      const result = await getShippingRates(formData, unitCount);
      
      if (result.success && result.rate) {
        setShippingRate(result.rate);
        setStep(2);
      } else {
        alert(result.error || 'Could not calculate shipping. Please check your address.');
      }
    } catch (error) {
      console.error(error);
      alert('Error calculating shipping.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessOrder = async () => {
    if (paymentMethod === 'CRYPTO' && !formData.transactionHash) {
      alert('Please enter your transaction hash to verify payment.');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await createOrder({
        ...formData,
        paymentMethod,
        totalAmount: totalCad.toFixed(2),
        shippingCost: shippingCharge.toFixed(2),
        shippingService: shippingRate ? shippingRate.servicelevel.name : 'Canada Post Expedited Parcel',
        items: items, 
        walletAddress: null, // No longer collecting user wallet for privacy
        transactionHash: formData.transactionHash || null,
        discountCode: appliedDiscount?.code || null,
        discountAmount: discountAmount.toFixed(2),
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
              <form className="space-y-4" onSubmit={handleContinueToPayment}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Full Name" value={formData.shippingName} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, shippingName: e.target.value})} />
                  <input required type="email" placeholder="Email Address" value={formData.email} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                
                <AddressAutocomplete 
                  apiKey="660bbb1dddbf4c0b9bc552fed57864f9"
                  onAddressSelected={handleAddressSelected}
                  placeholder="Street Address (Autocomplete)"
                  value={formData.address}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input required placeholder="City" value={formData.city} className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, city: e.target.value})} />
                  <input required placeholder="State / Prov" value={formData.stateProvince} className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, stateProvince: e.target.value})} />
                  <input required placeholder="ZIP / Postal" value={formData.postalCode} className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                </div>
                <input required placeholder="Country" value={formData.country} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors" onChange={e => setFormData({...formData, country: e.target.value})} />
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mt-6 bg-white text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Continue to Payment'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
              <h2 className="text-xl font-medium mb-6 flex items-center gap-2"><Wallet className="w-5 h-5 text-neon-pink" /> 2. Choose Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button onClick={() => setPaymentMethod('CRYPTO')} className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'CRYPTO' ? 'bg-white/10 border-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.2)]' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
                  <span className="text-2xl">🌐</span>
                  <span className="font-bold">Crypto Transfer</span>
                  <span className="text-xs text-white/50">Manual Wallet-to-Wallet</span>
                </button>
                <button onClick={() => setPaymentMethod('E-TRANSFER')} className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'E-TRANSFER' ? 'bg-white/10 border-acid-green shadow-[0_0_15px_rgba(191,255,0,0.2)]' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
                  <span className="text-2xl">🏦</span>
                  <span className="font-bold">E-Transfer</span>
                  <span className="text-xs text-white/50">Safe Canadian Banking</span>
                </button>
              </div>

              {paymentMethod === 'CRYPTO' && (
                <div className="space-y-6 mb-8">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Wallet className="w-12 h-12" />
                    </div>
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-2">Recipient Wallet Address (ERC-20/ETH)</label>
                    <div className="flex items-center gap-3">
                      <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-acid-green flex-1 break-all overflow-hidden border border-white/5">
                        {ADMIN_WALLET}
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(ADMIN_WALLET);
                          alert('Address copied to clipboard!');
                        }}
                        className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg transition-all"
                      >
                         <Info className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-[10px] text-white/40 italic">Please send exactly the amount shown in the total summary.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">Past Transaction Hash (Required)</label>
                    <input 
                      required
                      placeholder="0x..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors font-mono text-sm"
                      value={formData.transactionHash}
                      onChange={(e) => setFormData({...formData, transactionHash: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'E-TRANSFER' && (
                <div className="bg-acid-green/10 border border-acid-green/20 p-6 rounded-xl mb-8">
                  <h3 className="text-acid-green font-bold mb-2">E-Transfer Instructions</h3>
                  <p className="text-sm text-white/70">Please send exactly <strong>${totalCad.toFixed(2)} CAD</strong> to <strong>pay@whiterabbitsociety.xyz</strong>. Include your email address in the transfer notes. Your order will ship once the deposit is manually verified.</p>
                </div>
              )}

              <button 
                onClick={handleProcessOrder}
                disabled={isProcessing}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Confirm Order • $${totalCad.toFixed(2)} CAD`}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 rounded-3xl text-center flex flex-col items-center">
              <CheckCircle2 className="w-20 h-20 text-acid-green mb-6" />
              <h2 className="text-4xl font-serif mb-4">Sequence Initiated</h2>
              <p className="text-white/60 mb-8 max-w-md">
                {paymentMethod === 'CRYPTO' 
                  ? "Your transaction hash has been recorded. Our technicians will verify the block and begin fulfillment shortly." 
                  : "Your order is reserved. Please complete the e-transfer to whiterabbitsociety@outlook.com to finalize production."}
              </p>
              <Link href="/"><button className="bg-white/10 hover:bg-white hover:text-black border border-white/20 px-8 py-3 rounded-full font-bold transition-all">Return to Home</button></Link>
            </motion.div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:w-1/3">
          <div className="glass p-8 rounded-3xl sticky top-24">
            <h3 className="text-xl font-serif mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">{item.quantity}</span>
                    <span className="text-white/80">{item.name}</span>
                  </div>
                  <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mb-6 space-y-2">
              <div className="flex gap-2">
                <input 
                  placeholder="Discount Code" 
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-neon-pink transition-colors"
                />
                <button 
                  onClick={handleApplyDiscount}
                  disabled={isValidatingDiscount || !discountCode}
                  className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isValidatingDiscount ? '...' : 'Apply'}
                </button>
              </div>
              {discountError && <p className="text-[10px] text-red-500 font-mono">{discountError}</p>}
              {appliedDiscount && (
                <div className="flex justify-between items-center bg-acid-green/10 border border-acid-green/20 px-3 py-2 rounded-lg">
                  <span className="text-[10px] font-mono text-acid-green font-bold uppercase">{appliedDiscount.code} APPLIED</span>
                  <button onClick={() => setAppliedDiscount(null)} className="text-acid-green hover:text-white transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-acid-green">
                  <span>Discount</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white/50">
                <span>Shipping</span>
                <span className="font-mono">
                  {isFreeShipping && shippingRate ? (
                    <>
                      <span className="text-red-500 line-through mr-2">${shippingRate.amount}</span>
                      <span className="text-acid-green">$0.00</span>
                    </>
                  ) : (
                    shippingRate ? `$${shippingRate.amount}` : 'Calculated next step'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Taxes</span>
                <span className="font-mono">$0.00</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-end">
              <span className="font-bold pb-1">Total</span>
              <div className="text-right">
                <div className="text-2xl font-mono leading-none mb-1">${totalCad.toFixed(2)} <span className="text-xs text-white/30 font-sans">CAD</span></div>
                <div className="text-sm font-mono text-white/40 italic">~${totalUsdc.toFixed(2)} USDC</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
