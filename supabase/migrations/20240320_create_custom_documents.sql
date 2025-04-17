-- Create custom_documents table
CREATE TABLE custom_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    resume_path TEXT,
    cover_letter_path TEXT,
    keywords_used TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, job_id)
);

-- Enable RLS
ALTER TABLE custom_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own custom documents"
    ON custom_documents
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom documents"
    ON custom_documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom documents"
    ON custom_documents
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON custom_documents TO authenticated;
GRANT ALL ON custom_documents TO service_role;

-- Create storage bucket for custom documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('custom_documents', 'custom_documents', false);

-- Enable RLS on the bucket
CREATE POLICY "Users can read their own custom documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'custom_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can insert their own custom documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'custom_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own custom documents"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'custom_documents' AND auth.uid()::text = (storage.foldername(name))[1]); 