'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getOrders, updateOrderTracking } from '@/app/actions/orderActions';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Package, ExternalLink, CheckCircle2, Truck } from 'lucide-react';

// Replace with your actual admin wallet address
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET || '0x0000000000000000000000000000000000000000';

export default function AdminOrdersPage() {
  const { address, isConnected } = useAccount();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState<{ [key: string]: string }>({});

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_WALLET.toLowerCase();

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  async function loadOrders() {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  }

  async function handleUpdateTracking(orderId: string) {
    const tracking = trackingInput[orderId];
    if (!tracking) return;

    const result = await updateOrderTracking(orderId, tracking);
    if (result.success) {
      alert('Tracking updated and email sent!');
      loadOrders();
    } else {
      alert('Failed to update tracking.');
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-neon-pink mb-4" />
        <h1 className="text-3xl font-serif mb-2">Restricted Access</h1>
        <p className="text-white/50 mb-8">Please connect your authorized wallet to continue.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-serif mb-2">Unauthorized</h1>
        <p className="text-white/50 mb-4">Your wallet address is not on the admin whitelist.</p>
        <p className="font-mono text-xs text-white/20">{address}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2 text-white">Fulfillment Hub</h1>
            <p className="text-white/40 font-light italic">Sequence Management Dashboard</p>
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-acid-green animate-pulse" />
            <span className="text-xs font-mono text-white/50">Admin: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.length === 0 ? (
              <div className="text-center py-24 glass rounded-3xl border border-white/5">
                <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30">No orders found in the temporal stream.</p>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-6 md:p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col lg:flex-row gap-8"
                >
                  {/* Order Meta */}
                  <div className="lg:w-1/4">
                    <div className="text-xs font-mono text-white/30 mb-1">ORDER ID</div>
                    <div className="text-lg font-mono text-white mb-4">#{order.id.slice(0, 8)}</div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                      order.status === 'PENDING' ? 'bg-acid-green/10 text-acid-green' : 'bg-electric-blue/10 text-electric-blue'
                    }`}>
                      {order.status === 'PENDING' ? <CheckCircle2 className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                      {order.status}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="lg:w-1/4">
                    <div className="text-xs font-mono text-white/30 mb-2">SHIPPING TO</div>
                    <div className="text-white font-medium">{order.shippingName}</div>
                    <div className="text-white/60 text-sm leading-relaxed">
                      {order.address}<br />
                      {order.city}, {order.stateProvince} {order.postalCode}<br />
                      {order.country}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="lg:w-1/4">
                    <div className="text-xs font-mono text-white/30 mb-2">ITEMS</div>
                    <div className="space-y-1">
                      {JSON.parse(order.items).map((item: any, idx: number) => (
                        <div key={idx} className="text-sm text-white/80 flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-white font-mono font-bold">${order.totalUsd} USDC</div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-1/4 flex flex-col justify-end">
                    {order.status === 'PENDING' ? (
                      <div className="space-y-3">
                        <input 
                          placeholder="Tracking # (e.g. UPS-123...)"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-neon-pink transition-colors"
                          value={trackingInput[order.id] || ''}
                          onChange={(e) => setTrackingInput({ ...trackingInput, [order.id]: e.target.value })}
                        />
                        <button 
                          onClick={() => handleUpdateTracking(order.id)}
                          className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
                        >
                          Ship Order
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] font-mono text-white/30 mb-1 uppercase">TRACKING NUMBER</div>
                        <div className="text-white font-mono text-xs">{order.trackingNumber}</div>
                        <div className="text-[10px] font-mono text-white/20 mt-2">SHIPPED AT: {new Date(order.shippedAt!).toLocaleDateString()}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
