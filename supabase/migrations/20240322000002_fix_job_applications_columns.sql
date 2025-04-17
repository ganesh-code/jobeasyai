-- Check if columns exist and add them if they don't
DO $$ 
BEGIN 
    -- Add job_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'job_id'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN job_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;

    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL;
    END IF;

    -- Add other required columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'company_name'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN company_name TEXT NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'job_title'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN job_title TEXT NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'job_url'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN job_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN status TEXT CHECK (status IN ('applied', 'reviewing', 'rejected', 'accepted')) DEFAULT 'applied';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN notes TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'applied_date'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'next_follow_up'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN next_follow_up TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE job_applications 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

END $$; 