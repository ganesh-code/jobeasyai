-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    job_description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    location TEXT,
    salary_range TEXT,
    job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
    work_preference TEXT CHECK (work_preference IN ('remote', 'hybrid', 'onsite')),
    industry TEXT,
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active jobs
CREATE POLICY "Anyone can read active jobs"
    ON jobs FOR SELECT
    USING (is_active = true);

-- Allow authenticated users to read all jobs
CREATE POLICY "Authenticated users can read all jobs"
    ON jobs FOR SELECT
    TO authenticated
    USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_jobs_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_jobs_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_work_preference ON jobs(work_preference);
CREATE INDEX idx_jobs_industry ON jobs(industry); 