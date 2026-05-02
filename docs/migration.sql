-- =============================================================
-- Skills Market — Database Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- purchases table (user_id stored as text = GitHub login)
CREATE TABLE IF NOT EXISTS purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id text NOT NULL,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  stripe_session_id text NOT NULL UNIQUE,
  price integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  buyer_email text,
  created_at timestamp with time zone DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_skill ON purchases(skill_id);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_ratings_skill ON ratings(skill_id);

-- likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_likes_skill ON likes(skill_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);

-- bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_skill ON bookmarks(skill_id);

-- Add new columns to skills table
ALTER TABLE skills ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS avg_rating numeric DEFAULT 0;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS rating_count integer DEFAULT 0;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS like_count integer DEFAULT 0;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS bookmark_count integer DEFAULT 0;

-- downloads table (if not exists)
CREATE TABLE IF NOT EXISTS downloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
