
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log('Running orders table migration (v4.15)...');
  
  try {
    // Check current columns
    const cols = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `;
    console.log('Current columns:', cols.map((c: any) => c.column_name));

    // Add payment_method if missing
    const hasPaymentMethod = cols.some((c: any) => c.column_name === 'payment_method');
    if (!hasPaymentMethod) {
      await sql`ALTER TABLE orders ADD COLUMN payment_method VARCHAR(20) NOT NULL DEFAULT 'CRYPTO'`;
      console.log('✓ Added payment_method column');
    } else {
      console.log('- payment_method already exists');
    }

    // Add wallet_address if missing
    const hasWalletAddress = cols.some((c: any) => c.column_name === 'wallet_address');
    if (!hasWalletAddress) {
      await sql`ALTER TABLE orders ADD COLUMN wallet_address VARCHAR(42)`;
      console.log('✓ Added wallet_address column');
    } else {
      console.log('- wallet_address already exists');
    }

    // Add transaction_hash if missing
    const hasTransactionHash = cols.some((c: any) => c.column_name === 'transaction_hash');
    if (!hasTransactionHash) {
      await sql`ALTER TABLE orders ADD COLUMN transaction_hash VARCHAR(66)`;
      // Add unique constraint separately so nulls are allowed (multiple null values ok in Postgres)
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS orders_transaction_hash_unique ON orders(transaction_hash) WHERE transaction_hash IS NOT NULL`;
      console.log('✓ Added transaction_hash column with partial unique index');
    } else {
      console.log('- transaction_hash already exists');
    }

    // Verify final state
    const finalCols = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `;
    console.log('\n✅ Migration complete. Final columns:', finalCols.map((c: any) => c.column_name));
  } catch (e) {
    console.error('Migration error:', e);
    process.exit(1);
  }
}

migrate();
