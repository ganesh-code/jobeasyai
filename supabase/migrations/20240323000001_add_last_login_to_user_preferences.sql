-- Add last_login column to user_preferences
ALTER TABLE user_preferences 
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE; 