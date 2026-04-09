import { db } from './db';
import { sql } from 'drizzle-orm';

async function fixSchemaMaps() {
  console.log('🚀 Harita koordinat alanları veritabanına ekleniyor...');
  try {
    // latitude ve longitude kolonlarını manuel olarak ekliyoruz
    await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS latitude TEXT;`);
    await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS longitude TEXT;`);
    console.log('✅ Harita alanları başarıyla eklendi!');
  } catch (error) {
    console.error('❌ Hata oluştu:', error);
  } finally {
    process.exit();
  }
}

fixSchemaMaps();
