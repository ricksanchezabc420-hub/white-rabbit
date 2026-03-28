const postgres = require('postgres');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  connect_timeout: 10,
});

async function test() {
  console.log('Connecting to database...');
  try {
    const result = await sql`SELECT 1 as connected`;
    console.log('Success:', result);

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables:', tables.map(t => t.table_name));

    if (tables.some(t => t.table_name === 'orders')) {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'orders'
      `;
      console.log('Columns in "orders":', columns.map(c => `${c.column_name} (${c.data_type})`));
    } else {
      console.log('Table "orders" does not exist!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
