-- Drop existing table if it exists
DROP TABLE IF EXISTS user_preferences;

-- Create user_preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    location TEXT NOT NULL,
    remote BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;

-- Create policy to allow users to read their own preferences
CREATE POLICY "Users can read their own preferences"
    ON user_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own preferences
CREATE POLICY "Users can insert their own preferences"
    ON user_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own preferences
CREATE POLICY "Users can update their own preferences"
    ON user_preferences
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON user_preferences TO service_role; 