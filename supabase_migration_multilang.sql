-- Çok dilli destek için products tablosuna yeni sütunlar ekleme
-- Supabase Dashboard > SQL Editor'da çalıştırın

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS title_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT,
  ADD COLUMN IF NOT EXISTS title_de TEXT,
  ADD COLUMN IF NOT EXISTS description_de TEXT,
  ADD COLUMN IF NOT EXISTS title_ja TEXT,
  ADD COLUMN IF NOT EXISTS description_ja TEXT;
