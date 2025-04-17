-- Create storage bucket for custom documents if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('custom_documents', 'custom_documents', false)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own custom documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can insert their own custom documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own custom documents" ON storage.objects;

-- Create new policies
CREATE POLICY "Users can read their own custom documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'custom_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can insert their own custom documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'custom_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own custom documents"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'custom_documents' AND auth.uid()::text = (storage.foldername(name))[1]); 