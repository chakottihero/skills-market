-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  title_zh TEXT,
  short_description TEXT NOT NULL,
  short_description_en TEXT,
  short_description_zh TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price_type TEXT NOT NULL CHECK (price_type IN ('free', 'paid')),
  price INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  compatible_tools TEXT[] DEFAULT '{}',
  skill_file_path TEXT,
  seller_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  seller_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID REFERENCES skills(id),
  buyer_id TEXT NOT NULL,
  buyer_email TEXT,
  stripe_session_id TEXT,
  price INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID REFERENCES skills(id),
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert skills" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Sellers can update own skills" ON skills FOR UPDATE USING (seller_id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Anyone can view purchases" ON purchases FOR SELECT USING (true);
CREATE POLICY "Anyone can insert purchases" ON purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view downloads" ON downloads FOR SELECT USING (true);
CREATE POLICY "Anyone can insert downloads" ON downloads FOR INSERT WITH CHECK (true);
