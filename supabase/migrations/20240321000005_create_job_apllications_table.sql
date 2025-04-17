-- Create job_apllications table
CREATE TABLE IF NOT EXISTS job_apllications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('applied', 'reviewing', 'rejected', 'accepted')) DEFAULT 'applied',
    resume_url TEXT,
    cover_letter_url TEXT,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_apllications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own applications"
    ON job_apllications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
    ON job_apllications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
    ON job_apllications FOR UPDATE
    USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_job_apllications_user_id ON job_apllications(user_id);
CREATE INDEX idx_job_apllications_job_id ON job_apllications(job_id);
CREATE INDEX idx_job_apllications_status ON job_apllications(status);
CREATE INDEX idx_job_apllications_applied_date ON job_apllications(applied_date DESC);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_apllications_updated_at
    BEFORE UPDATE ON job_apllications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 