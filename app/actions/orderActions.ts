'use server';

import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getOrders() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function createOrder(orderData: any) {
  try {
    const [newOrder] = await db.insert(orders).values({
      ...orderData,
      status: 'PENDING',
    }).returning();

    // Send Confirmation Email
    if (newOrder.email) {
      try {
        await resend.emails.send({
          from: 'White Rabbit <orders@whiterabbit.com>',
          to: newOrder.email,
          subject: 'Order Received - White Rabbit',
          html: `<div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #333; border-radius: 20px; background: #000; color: #fff;">
            <h1 style="color: #fff; text-align: center; letter-spacing: 2px;">WHITE RABBIT</h1>
            <p style="color: #666; font-style: italic;">We've received your order.</p>
            <hr style="border-color: #333;">
            <div style="margin-top: 20px;">
              <p>Hello <strong>${newOrder.shippingName}</strong>,</p>
              <p>Your order <strong>#${newOrder.id.slice(0, 8)}</strong> has been received and is being prepared for fulfillment.</p>
              <p>Total: <strong>$${newOrder.totalUsd} USDC</strong></p>
              ${newOrder.paymentMethod === 'E-TRANSFER' ? '<p style="color: #bfff00; font-weight: bold;">Reminder: Please complete your E-transfer to finalize production.</p>' : ''}
              <p style="margin-top: 40px; color: #666; font-size: 12px;">The sequence has begun. Follow the rabbit.</p>
            </div>
          </div>`,
        });
      } catch (emailError) {
        console.error('Email failed:', emailError);
      }
    }

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error('Order creation failed:', error);
    return { success: false, error: 'Database submission failed' };
  }
}

export async function updateOrderTracking(orderId: string, trackingNumber: string) {
  try {
    const [updatedOrder] = await db.update(orders)
      .set({ 
        trackingNumber, 
        shippedAt: new Date(), 
        status: 'SHIPPED' 
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Send Shipping Email
    if (updatedOrder.email) {
      try {
        await resend.emails.send({
          from: 'White Rabbit <orders@whiterabbit.com>',
          to: updatedOrder.email,
          subject: 'Order Shipped - White Rabbit',
          html: `<div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #333; border-radius: 20px; background: #000; color: #fff;">
            <h1 style="color: #fff; text-align: center; letter-spacing: 2px;">WHITE RABBIT</h1>
            <p style="color: #666; font-style: italic;">The rabbit is on the move.</p>
            <hr style="border-color: #333;">
            <div style="margin-top: 20px;">
              <p>Order <strong>#${updatedOrder.id.slice(0, 8)}</strong> has been shipped.</p>
              <p>Tracking Number: <span style="font-family: monospace; color: #00ffff;">${trackingNumber}</span></p>
              <p style="margin-top: 40px; color: #666; font-size: 12px;">Your artifacts will arrive shortly.</p>
            </div>
          </div>`,
        });
      } catch (emailError) {
        console.error('Email failed:', emailError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Tracking update failed:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}
