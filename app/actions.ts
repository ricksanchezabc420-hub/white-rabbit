'use server';

import { db } from '@/db';
import { products, orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createPublicClient, http } from 'viem';
import { mainnet, polygon } from 'viem/chains';

// Define the RPC client for on-chain verification
// Defaulting to Polygon for lower fees in this e-commerce context
const publicClient = createPublicClient({
  chain: polygon,
  transport: http()
});

export async function fetchInventory() {
  try {
    const inventory = await db.select().from(products);
    return { success: true, data: inventory };
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return { success: false, error: "Database connection failed" };
  }
}

export async function verifyTransaction(
  orderId: string, 
  transactionHash: `0x${string}`, 
  walletAddress: `0x${string}`,
  expectedUsd: number
) {
  try {
    // 1. Mark order as pending
    await db.insert(orders).values({
      id: orderId,
      walletAddress,
      transactionHash,
      totalUsd: expectedUsd.toString(),
      status: 'PENDING'
    });

    // 2. Wait for transaction confirmation on-chain
    const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash });

    if (receipt.status === 'success') {
      // In production, we would also verify the `to` address and the `value` transferred 
      // by decoding the transaction input or logs.

      // 3. Update order to confirmed
      await db.update(orders)
        .set({ status: 'CONFIRMED' })
        .where(eq(orders.id, orderId));

      return { success: true, message: "Transaction verified and order confirmed." };
    } else {
      await db.update(orders)
        .set({ status: 'FAILED' })
        .where(eq(orders.id, orderId));
        
      return { success: false, message: "Transaction reverted on-chain." };
    }
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: "Verification failed." };
  }
}
