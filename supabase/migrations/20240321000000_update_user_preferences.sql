-- Add missing columns to user_preferences table
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS work_preference TEXT CHECK (work_preference IN ('remote', 'hybrid', 'onsite')),
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS salary_range TEXT; 