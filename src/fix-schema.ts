import { db } from './db';
import { sql } from 'drizzle-orm';

async function fixSchema() {
  console.log('🚀 Veritabanı şeması manuel olarak güncelleniyor...');
  try {
    // extra_images kolonunu manuel olarak ekliyoruz
    await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS extra_images TEXT;`);
    console.log('✅ "extra_images" kolonu başarıyla eklendi!');
  } catch (error) {
    console.error('❌ Hata oluştu:', error);
  } finally {
    process.exit();
  }
}

fixSchema();
