-- Create user_profiles table in Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT,
    email TEXT UNIQUE,
    total_xp INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Add constraints
    CONSTRAINT valid_wallet_address CHECK (
        LENGTH(wallet_address) > 0 AND 
        wallet_address ~ '^0x[a-fA-F0-9]{40}$'
    ),
    CONSTRAINT valid_username CHECK (
        username IS NULL OR (
            LENGTH(username) >= 3 AND 
            LENGTH(username) <= 50 AND
            username ~ '^[a-z0-9_]+$'
        )
    ),
    CONSTRAINT valid_email CHECK (
        email IS NULL OR 
        email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    ),
    CONSTRAINT valid_xp CHECK (total_xp >= 0)
);

-- Add total_xp column if it doesn't exist (for existing tables)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'total_xp'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN total_xp INTEGER DEFAULT 0 NOT NULL;
        ALTER TABLE user_profiles ADD CONSTRAINT valid_xp CHECK (total_xp >= 0);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Users can read all profiles (for username uniqueness checks, etc.)
CREATE POLICY "Enable read access for all users" ON user_profiles
    FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Enable insert for users" ON user_profiles
    FOR INSERT WITH CHECK (true);

-- Users can update their own profile (if you implement user authentication)
-- For now, allowing all updates since we're using wallet addresses
CREATE POLICY "Enable update for users" ON user_profiles
    FOR UPDATE USING (true);

-- Optional: Add comments for documentation
COMMENT ON TABLE user_profiles IS 'User profile information linked to wallet addresses';
COMMENT ON COLUMN user_profiles.wallet_address IS 'Ethereum wallet address (lowercase)';
COMMENT ON COLUMN user_profiles.username IS 'Unique username (lowercase, alphanumeric + underscore only)';
COMMENT ON COLUMN user_profiles.full_name IS 'User full display name';
COMMENT ON COLUMN user_profiles.email IS 'User email address (lowercase)';

-- Insert sample data (optional - remove in production)
-- INSERT INTO user_profiles (wallet_address, username, full_name, email) VALUES
-- ('0x742d35cc6cf7732ae8b738a6c6f4c6f4aff5e4b0', 'alice_crypto', 'Alice Johnson', 'alice@example.com'),
-- ('0x8ba1f109551bd432803012645hac136c00b0b3f2', 'bob_defi', 'Bob Smith', 'bob@example.com');
