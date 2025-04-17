-- Split full_name into first_name and last_name
ALTER TABLE user_profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Copy existing full_name data into first_name (as a temporary solution)
UPDATE user_profiles 
SET first_name = SPLIT_PART(full_name, ' ', 1),
    last_name = SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1);

-- Drop the full_name column
ALTER TABLE user_profiles DROP COLUMN full_name; 