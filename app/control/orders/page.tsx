'use client';

// Diagnostic: Trigger version 2.1 deployment for fulfillment hub
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders, updateOrderTracking, generateShippingLabel } from '@/app/actions/orderActions';
import { isAdmin, logout } from '@/app/actions/authActions';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Package, Truck, CheckCircle2, LogOut, RefreshCw, Mail, MapPin, FileText, ExternalLink } from 'lucide-react';

export default function FulfillmentPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingLabel, setIsProcessingLabel] = useState<number | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [trackingInput, setTrackingInput] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const auth = await isAdmin();
    if (!auth) {
      router.push('/control/login');
    } else {
      setIsAuthorized(true);
      loadOrders();
    }
  }

  async function loadOrders() {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  }

  async function handleUpdateTracking(orderId: number) {
    const tracking = trackingInput[orderId];
    if (!tracking) return;

    const result = await updateOrderTracking(orderId, tracking);
    if (result.success) {
      loadOrders();
    } else {
      alert('Failed to update tracking.');
    }
  }

  async function handleGenerateLabel(orderId: number) {
    setIsProcessingLabel(orderId);
    try {
      const result = await generateShippingLabel(orderId);
      if (result.success && result.labelUrl) {
        window.open(result.labelUrl, '_blank');
        await loadOrders();
      } else {
        alert(result.error || 'Failed to generate label.');
      }
    } catch (err) {
      alert('Transmission error during label generation.');
    } finally {
      setIsProcessingLabel(null);
    }
  }

  if (isAuthorized === null) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif tracking-tight mb-2">Fulfillment Hub</h1>
            <p className="text-white/40 text-sm font-light uppercase tracking-widest">Temporal Logistics & Control</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={loadOrders}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => logout()}
              className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass p-6 rounded-3xl border border-white/5">
            <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Incoming</div>
            <div className="text-2xl font-mono">{orders.filter(o => o.status === 'PENDING').length}</div>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5">
            <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Shipped</div>
            <div className="text-2xl font-mono">{orders.filter(o => o.status === 'SHIPPED').length}</div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading && orders.length === 0 ? (
            <div className="py-24 flex justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-24 text-center glass rounded-3xl border border-white/5">
              <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 font-light">The sequence is empty.</p>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 md:p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Meta & Status */}
                  <div className="lg:w-1/4">
                    <div className="text-[10px] font-mono text-white/30 uppercase mb-1">Order Ref</div>
                    <div className="text-lg font-mono mb-4 text-white">WR{order.id}</div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                      order.status === 'PENDING' ? 'bg-acid-green/10 text-acid-green' : 'bg-electric-blue/10 text-electric-blue'
                    }`}>
                      {order.status === 'PENDING' ? <Box className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                      {order.status}
                    </div>
                    <div className="mt-4 text-[10px] text-white/30 font-mono">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="lg:w-1/3">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-white/5 rounded-lg"><Mail className="w-4 h-4 text-white/40" /></div>
                      <div>
                        <div className="text-sm font-medium text-white">{order.shippingName}</div>
                        <div className="text-xs text-white/40">{order.email}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/5 rounded-lg"><MapPin className="w-4 h-4 text-white/40" /></div>
                      <div className="text-xs text-white/60 leading-relaxed">
                        {order.address}<br />
                        {order.city}, {order.stateProvince} {order.postalCode}<br />
                        {order.country}
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="lg:w-1/4">
                    <div className="text-[10px] font-mono text-white/30 uppercase mb-3">Contents</div>
                    <div className="space-y-2">
                      {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-white/80">{item.name} <span className="text-white/30">x{item.quantity}</span></span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center overflow-hidden">
                      <span className="text-[10px] font-mono text-white/30 uppercase">Revenue</span>
                      <span className="text-lg font-mono text-white">${order.totalUsd} <span className="text-[10px] text-white/30">USDC</span></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-1/4 flex flex-col justify-center">
                    {order.status === 'PENDING' ? (
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleGenerateLabel(order.id)}
                          disabled={isProcessingLabel === order.id}
                          className="w-full bg-electric-blue text-black py-3 rounded-xl font-bold text-sm tracking-widest hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <FileText className="w-4 h-4" />
                          {isProcessingLabel === order.id ? 'PRINTING...' : 'BUY & PRINT LABEL'}
                        </button>
                        
                        <div className="relative flex items-center py-2">
                          <div className="flex-grow border-t border-white/5"></div>
                          <span className="flex-shrink mx-4 text-[8px] text-white/20 uppercase tracking-widest">or manual</span>
                          <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        <input 
                          placeholder="Manual Tracking Code"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] outline-none focus:border-neon-pink transition-all font-light"
                          value={trackingInput[order.id] || ''}
                          onChange={(e) => setTrackingInput({ ...trackingInput, [order.id]: e.target.value })}
                        />
                        <button 
                          onClick={() => handleUpdateTracking(order.id)}
                          className="w-full bg-white/5 border border-white/10 text-white/40 py-2 rounded-xl font-bold text-[10px] tracking-widest hover:text-white transition-all uppercase"
                        >
                          Manual Ship
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[9px] font-mono text-white/30 uppercase mb-1">Tracking Out</div>
                        <div className="text-white font-mono text-xs truncate mb-2">{order.trackingNumber}</div>
                        
                        {order.labelUrl && (
                          <a 
                            href={order.labelUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-acid-green text-[10px] font-bold uppercase tracking-wider hover:underline mb-3"
                          >
                            <ExternalLink className="w-3 h-3" /> Re-print Label
                          </a>
                        )}

                        <div className="text-[9px] font-mono text-white/20 uppercase">
                          Shipped: {order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
