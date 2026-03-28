'use client';

import { useState, useEffect } from 'react';
import { getDiscounts, createDiscount, deleteDiscount } from '@/app/actions/discountActions';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, Percent, DollarSign, Calendar, Info, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminDiscountManager() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [newCode, setNewCode] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    description: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: ''
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  async function loadDiscounts() {
    setIsLoading(true);
    const data = await getDiscounts();
    setDiscounts(data);
    setIsLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.code || !newCode.discountValue) return;

    const result = await createDiscount({
      ...newCode,
      maxUses: newCode.maxUses ? parseInt(newCode.maxUses) : undefined,
      expiresAt: newCode.expiresAt ? new Date(newCode.expiresAt) : null
    });

    if (result.success) {
      setNewCode({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        description: '',
        minOrderAmount: '',
        maxUses: '',
        expiresAt: ''
      });
      setIsAdding(false);
      loadDiscounts();
    } else {
      alert(result.error || 'Failed to create discount.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    const result = await deleteDiscount(id);
    if (result.success) {
      loadDiscounts();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-white mb-1">Active Discount Sequences</h2>
          <p className="text-white/40 text-sm font-light italic">Manage cryptographic price mitigations</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Generate New Code</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreate} className="glass p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase mb-2">Discount Code</label>
                  <input 
                    required 
                    placeholder="RABBIT20"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors text-white"
                    value={newCode.code}
                    onChange={e => setNewCode({...newCode, code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase mb-2">Type</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors text-white"
                    value={newCode.discountType}
                    onChange={e => setNewCode({...newCode, discountType: e.target.value as any})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (CAD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase mb-2">Value</label>
                  <div className="relative">
                    <input 
                      required 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 20"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-10 outline-none focus:border-neon-pink transition-colors text-white"
                      value={newCode.discountValue}
                      onChange={e => setNewCode({...newCode, discountValue: e.target.value})}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      {newCode.discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase mb-2">Min Order Amount (Optional)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="e.g. 100"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors text-white"
                    value={newCode.minOrderAmount}
                    onChange={e => setNewCode({...newCode, minOrderAmount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase mb-2">Max Usage Limit (Optional)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 50"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors text-white"
                    value={newCode.maxUses}
                    onChange={e => setNewCode({...newCode, maxUses: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase mb-2">Expiry Date (Optional)</label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-neon-pink transition-colors text-white"
                    value={newCode.expiresAt}
                    onChange={e => setNewCode({...newCode, expiresAt: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  type="submit"
                  className="bg-neon-pink text-black px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all"
                >
                  Authorize Code
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-24 flex justify-center">
            <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : discounts.length === 0 ? (
          <div className="col-span-full py-24 glass rounded-3xl border border-white/5 flex flex-col items-center">
            <Tag className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white/30">No discount protocols currently active.</p>
          </div>
        ) : (
          discounts.map((discount) => (
            <motion.div 
              key={discount.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] font-mono text-white/30 uppercase mb-1">PROTO-CODE</div>
                    <div className="text-2xl font-mono text-white tracking-widest">{discount.code}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    discount.discountType === 'percentage' ? 'bg-acid-green/10 text-acid-green' : 'bg-electric-blue/10 text-electric-blue'
                  }`}>
                    {discount.discountType === 'percentage' ? `${discount.discountValue}% OFF` : `$${discount.discountValue} OFF`}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Info className="w-3.5 h-3.5" />
                    <span>Min Order: ${parseFloat(discount.minOrderAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Used: {discount.usedCount} {discount.maxUses ? `/ ${discount.maxUses}` : '(Unlimited)'}</span>
                  </div>
                  {discount.expiresAt && (
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Expires: {new Date(discount.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${discount.isActive ? 'bg-acid-green' : 'bg-red-500'}`} />
                  <span className="text-[10px] uppercase font-mono text-white/30">{discount.isActive ? 'Active' : 'Offline'}</span>
                </div>
                <button 
                  onClick={() => handleDelete(discount.id)}
                  className="p-2 hover:bg-red-500/20 text-white/30 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
