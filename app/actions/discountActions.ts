'use server';

import { db } from '@/db';
import { discounts } from '@/db/schema';
import { eq, desc, and, gte, lt } from 'drizzle-orm';

export async function getDiscounts() {
  try {
    return await db.query.discounts.findMany({
      orderBy: [desc(discounts.createdAt)],
    });
  } catch (error) {
    console.error('Failed to fetch discounts:', error);
    return [];
  }
}

export async function createDiscount(data: {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  description?: string;
  minOrderAmount?: string;
  maxUses?: number;
  expiresAt?: Date | null;
}) {
  try {
    const [newDiscount] = await db.insert(discounts).values({
      code: data.code.toUpperCase().trim(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      description: data.description,
      minOrderAmount: data.minOrderAmount || "0.00",
      maxUses: data.maxUses,
      expiresAt: data.expiresAt,
      isActive: 1,
    }).returning();
    return { success: true, discount: newDiscount };
  } catch (error: any) {
    console.error('Failed to create discount:', error);
    return { success: false, error: error.message || 'Validation failed.' };
  }
}

export async function deleteDiscount(id: number) {
  try {
    await db.delete(discounts).where(eq(discounts.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete discount:', error);
    return { success: false, error: 'Failed to delete.' };
  }
}

export async function validateDiscount(code: string, currentTotal: number) {
  try {
    const discount = await db.query.discounts.findFirst({
      where: and(
        eq(discounts.code, code.toUpperCase().trim()),
        eq(discounts.isActive, 1)
      ),
    });

    if (!discount) return { success: false, error: 'Invalid or inactive code.' };

    // Check expiration
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return { success: false, error: 'Code has expired.' };
    }

    // Check usage limit
    if (discount.maxUses && (discount.usedCount || 0) >= discount.maxUses) {
      return { success: false, error: 'Code usage limit reached.' };
    }

    // Check min order amount
    const minAmount = parseFloat(discount.minOrderAmount || "0.00");
    if (currentTotal < minAmount) {
      return { success: false, error: `Minimum order of $${minAmount.toFixed(2)} required for this code.` };
    }

    // Calculate discount amount
    let discountAmount = 0;
    const value = parseFloat(discount.discountValue);
    
    if (discount.discountType === 'percentage') {
      discountAmount = currentTotal * (value / 100);
    } else {
      discountAmount = Math.min(value, currentTotal);
    }

    return { 
      success: true, 
      discount: {
        id: discount.id,
        code: discount.code,
        type: discount.discountType,
        value: discount.discountValue,
        amount: discountAmount.toFixed(2)
      }
    };
  } catch (error) {
    console.error('Discount validation error:', error);
    return { success: false, error: 'Server error during validation.' };
  }
}
