'use server';

import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import nodemailer from 'nodemailer';
const shippo = require('shippo')(process.env.SHIPPO_API_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function getShippingRates(addressData: any, unitCount: number) {
  try {
    const weight = (unitCount * 175) + (unitCount <= 3 ? 50 : 100); // g
    const dimensions = unitCount <= 3 
      ? { length: 26, width: 19, height: 6 } 
      : unitCount <= 8 
        ? { length: 38, width: 26, height: 6 } 
        : { length: 40, width: 30, height: 15 };

    const shipment = await shippo.shipment.create({
      address_from: {
        name: 'White Rabbit Warehouse',
        street1: '190 Northfield Dr West',
        city: 'Waterloo',
        state: 'ON',
        zip: 'N2L 0A6', // General Waterloo N2L area
        country: 'CA',
      },
      address_to: {
        name: addressData.shippingName || 'Customer',
        street1: addressData.address,
        city: addressData.city,
        state: addressData.stateProvince,
        zip: addressData.postalCode,
        country: addressData.country || 'CA',
      },
      parcels: [{
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        distance_unit: 'cm',
        weight: weight,
        mass_unit: 'g',
      }],
      async: false,
    });

    // Filter for Canada Post Expedited Parcel
    const rates = shipment.rates.filter((r: any) => 
      r.servicelevel.token === 'canadapost_expedited_parcel'
    );

    if (rates.length === 0) {
      // Fallback to the cheapest tracked option if expedited isn't available
      return { success: true, rate: shipment.rates[0] };
    }

    return { success: true, rate: rates[0] };
  } catch (error) {
    console.error('Shippo error:', error);
    return { success: false, error: 'Failed to calculate shipping.' };
  }
}

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
    console.log('Initiating order creation for:', orderData.email);
    
    let newOrder;
    try {
      const [insertedOrder] = await db.insert(orders).values({
        ...orderData,
        status: 'PENDING',
        shippingCost: orderData.shippingCost || '0.00',
        shippingService: orderData.shippingService || 'Canada Post Expedited Parcel',
      }).returning();
      newOrder = insertedOrder;
      console.log('Order persisted to database:', newOrder.id);
    } catch (dbError) {
      console.error('Database insertion failed:', dbError);
      return { success: false, error: 'Database persistence error.' };
    }

    // Send Confirmation Emails via Gmail
    try {
      const mailOptions = {
        from: `"White Rabbit" <${process.env.GMAIL_USER}>`,
        to: [newOrder.email, process.env.GMAIL_USER || ''], // Send to customer AND admin
        subject: `Order Received #${newOrder.id.slice(0, 8)} - White Rabbit`,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #000; color: #fff; border: 1px solid #333; border-radius: 30px;">
            <h1 style="text-align: center; letter-spacing: 5px; color: #fff; margin-bottom: 40px;">WHITE RABBIT</h1>
            <p style="font-style: italic; color: #888; text-align: center; margin-bottom: 40px;">A new sequence has been initiated.</p>
            <div style="border-top: 1px solid #222; padding-top: 30px; line-height: 1.6;">
              <p>Order ID: <span style="font-family: monospace; color: #00ffff;">#${newOrder.id.slice(0, 8)}</span></p>
              <p>Name: <strong>${newOrder.shippingName}</strong></p>
              <p>Total: <strong>$${newOrder.totalUsd} USDC</strong></p>
              <p>Status: <span style="color: #bfff00;">Awaiting Fulfillment</span></p>
              ${newOrder.paymentMethod === 'E-TRANSFER' ? '<p style="color: #ff3e3e; font-weight: bold; border: 1px solid #ff3e3e; padding: 10px; border-radius: 10px; margin-top: 20px;">* ACTION REQUIRED: Please complete your E-transfer to pay@whiterabbit.com to begin production.</p>' : ''}
            </div>
            <div style="margin-top: 40px; padding: 20px; background: #111; border-radius: 15px;">
              <p style="font-size: 12px; color: #666; margin: 0;">Shipping to: ${newOrder.shippingName}, ${newOrder.address}, ${newOrder.city}</p>
            </div>
            <p style="margin-top: 60px; text-align: center; font-size: 10px; color: #444; letter-spacing: 2px;">FOLLOW THE RABBIT</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Confirmation emails sent via Gmail');
    } catch (mailError) {
      console.error('Nodemailer failed:', mailError);
      // We don't fail the whole order if just the email fails, 
      // but we log it. However, if the user sees 'Order failed', 
      // it might be because the catch block returned it.
    }

    return { success: true, orderId: newOrder.id };
  } catch (error: any) {
    console.error('Fatal order creation error:', error);
    return { success: false, error: error.message || 'Sequence interrupted.' };
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

    // Send Shipping Confirmation via Gmail
    const mailOptions = {
      from: `"White Rabbit" <${process.env.GMAIL_USER}>`,
      to: updatedOrder.email,
      subject: `Order Shipped #${updatedOrder.id.slice(0, 8)} - White Rabbit`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #000; color: #fff; border: 1px solid #333; border-radius: 30px;">
          <h1 style="text-align: center; letter-spacing: 5px; color: #fff; margin-bottom: 40px;">WHITE RABBIT</h1>
          <p style="font-style: italic; color: #00ffff; text-align: center; margin-bottom: 40px;">The rabbit is on the move.</p>
          <div style="border-top: 1px solid #222; padding-top: 30px; line-height: 1.6;">
            <p>Your artifacts have been dispatched.</p>
            <p>Tracking Code: <span style="font-family: monospace; color: #bfff00; font-size: 20px; letter-spacing: 2px;">${trackingNumber}</span></p>
          </div>
          <div style="margin-top: 40px; text-align: center;">
             <p style="color: #666; font-size: 11px;">Track your package via your preferred carrier with the code above.</p>
          </div>
          <p style="margin-top: 60px; text-align: center; font-size: 10px; color: #444; letter-spacing: 2px;">THE SEQUENCE COMPLETES SOON</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error('Tracking update failed:', error);
    return { success: false, error: 'Fulfillment error.' };
  }
}
