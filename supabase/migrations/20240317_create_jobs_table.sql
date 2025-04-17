-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('LinkedIn', 'Indeed', 'Naukri', 'Glassdoor')),
    location TEXT NOT NULL,
    remote BOOLEAN DEFAULT false,
    recruiter_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert dummy data
INSERT INTO jobs (job_title, company, platform, location, remote, recruiter_email) VALUES
('Senior React Developer', 'TechCorp', 'LinkedIn', 'San Francisco, CA', true, 'recruiter1@techcorp.com'),
('Python Backend Engineer', 'DataSystems', 'Indeed', 'New York, NY', true, 'hr@datasystems.com'),
('Frontend Developer', 'WebSolutions', 'Glassdoor', 'Austin, TX', false, 'careers@websolutions.com'),
('Full Stack Developer', 'CloudTech', 'LinkedIn', 'Seattle, WA', true, 'talent@cloudtech.com'),
('Software Engineer', 'InnovateCo', 'Naukri', 'Bangalore, India', false, 'jobs@innovateco.com'),
('React Native Developer', 'MobileApps', 'Indeed', 'Boston, MA', true, NULL),
('DevOps Engineer', 'InfraTech', 'Glassdoor', 'Chicago, IL', false, NULL),
('UI/UX Developer', 'DesignHub', 'LinkedIn', 'Los Angeles, CA', true, NULL),
('Node.js Developer', 'ServerStack', 'Naukri', 'Mumbai, India', false, NULL),
('JavaScript Engineer', 'WebTech', 'Indeed', 'Denver, CO', true, NULL); 