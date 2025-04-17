-- Drop existing table if it exists
DROP TABLE IF EXISTS jobs;

-- Create jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'glassdoor', 'indeed', 'naukri', 'google')),
    location TEXT NOT NULL,
    remote BOOLEAN DEFAULT false,
    match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    salary_range TEXT,
    recruiter_email TEXT,
    job_description TEXT,
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read jobs
CREATE POLICY "Allow authenticated users to read jobs"
    ON jobs
    FOR SELECT
    TO authenticated
    USING (true);

-- Grant necessary permissions
GRANT ALL ON jobs TO service_role;
GRANT SELECT ON jobs TO authenticated; 