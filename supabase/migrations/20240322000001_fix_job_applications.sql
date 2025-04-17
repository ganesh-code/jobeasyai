-- First, drop the dependent email_outreach table constraint
ALTER TABLE email_outreach DROP CONSTRAINT email_outreach_job_application_id_fkey;

-- Drop the table with typo
DROP TABLE IF EXISTS job_apllications;

-- Rename the existing job_applications table to preserve data
ALTER TABLE job_applications RENAME TO job_applications_old;

-- Create the new job_applications table with correct structure
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_url TEXT,
    status TEXT CHECK (status IN ('applied', 'reviewing', 'rejected', 'accepted')) DEFAULT 'applied',
    notes TEXT,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_follow_up TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copy data from old table to new table
INSERT INTO job_applications (
    id,
    user_id,
    job_id,
    company_name,
    job_title,
    job_url,
    status,
    notes,
    applied_date,
    next_follow_up,
    created_at,
    updated_at
)
SELECT 
    id,
    user_id,
    job_id,
    company_name,
    job_title,
    job_url,
    status,
    notes,
    applied_date,
    next_follow_up,
    created_at,
    updated_at
FROM job_applications_old;

-- Drop the old table
DROP TABLE job_applications_old;

-- Recreate the email_outreach foreign key constraint
ALTER TABLE email_outreach 
    ADD CONSTRAINT email_outreach_job_application_id_fkey 
    FOREIGN KEY (job_application_id) 
    REFERENCES job_applications(id) 
    ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own applications"
    ON job_applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
    ON job_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
    ON job_applications FOR UPDATE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applied_date ON job_applications(applied_date DESC);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_job_applications_updated_at(); 