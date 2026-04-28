-- Storage bucket for SKILL.md files (run after supabase-setup.sql)
INSERT INTO storage.buckets (id, name, public)
VALUES ('skill-files', 'skill-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'skill-files');

CREATE POLICY "Authenticated can download" ON storage.objects
  FOR SELECT USING (bucket_id = 'skill-files');
