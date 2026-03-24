
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function reset() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log('Resetting orders table...');
  try {
    await sql`DROP TABLE IF EXISTS orders CASCADE`;
    console.log('Table dropped.');
    
    // The next npx drizzle-kit push will recreate it with the serial ID
    console.log('Recreate via drizzle-kit push now.');
  } catch (e) {
    console.error(e);
  }
}

reset();
