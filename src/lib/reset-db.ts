import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function resetDB() {
  console.log('Resetting database tables...');
  try {
    await sql`DROP TABLE IF EXISTS "bot_rules" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "products" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "templates" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "users" CASCADE;`;
    console.log('Successfully dropped all tables.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  }
}

resetDB();
