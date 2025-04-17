-- Add foreign key to job_apllications table
ALTER TABLE job_apllications
ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE CASCADE;

-- Insert sample jobs
INSERT INTO jobs (
    job_title,
    company,
    job_description,
    requirements,
    location,
    salary_range,
    job_type,
    work_preference,
    industry
) VALUES
(
    'Senior Software Engineer',
    'TechCorp Inc.',
    'We are looking for a Senior Software Engineer to join our team. You will be responsible for developing and maintaining our core products.',
    '5+ years of experience in software development\nStrong knowledge of TypeScript and React\nExperience with cloud platforms (AWS/GCP)\nExcellent problem-solving skills',
    'San Francisco, CA',
    '$120,000 - $150,000',
    'full-time',
    'hybrid',
    'Technology'
),
(
    'Frontend Developer',
    'WebSolutions Ltd.',
    'Join our frontend team to build beautiful and responsive web applications.',
    '3+ years of frontend development experience\nProficiency in React and TypeScript\nExperience with CSS frameworks\nStrong UI/UX skills',
    'Remote',
    '$90,000 - $110,000',
    'full-time',
    'remote',
    'Technology'
),
(
    'Data Scientist',
    'DataInsights Co.',
    'Help us analyze complex data sets and build machine learning models.',
    'Masters in Computer Science or related field\nExperience with Python and ML libraries\nStrong statistical background\nExperience with big data tools',
    'New York, NY',
    '$130,000 - $160,000',
    'full-time',
    'onsite',
    'Data Science'
),
(
    'Product Manager',
    'ProductVision Inc.',
    'Lead product development and work with cross-functional teams.',
    '5+ years of product management experience\nStrong analytical skills\nExcellent communication abilities\nExperience with agile methodologies',
    'Seattle, WA',
    '$140,000 - $170,000',
    'full-time',
    'hybrid',
    'Product Management'
),
(
    'DevOps Engineer',
    'CloudTech Solutions',
    'Help us build and maintain our cloud infrastructure.',
    'Experience with Kubernetes and Docker\nKnowledge of CI/CD pipelines\nCloud platform experience (AWS/Azure)\nStrong scripting skills',
    'Remote',
    '$110,000 - $110,000',
    'full-time',
    'remote',
    'DevOps'
); 