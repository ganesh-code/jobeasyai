-- Make non-essential fields nullable
ALTER TABLE user_preferences
ALTER COLUMN location DROP NOT NULL,
ALTER COLUMN remote DROP NOT NULL; 