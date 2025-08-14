-- Camp Ownership Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    email VARCHAR(255),
    xp_points INTEGER DEFAULT 0,
    monthly_credits INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE IF NOT EXISTS public.items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    serial_number VARCHAR(255),
    estimated_value DECIMAL(12,2),
    artifact_id VARCHAR(255), -- For blockchain reference
    image_url TEXT, -- IPFS URL for item image
    image_hash VARCHAR(255), -- IPFS hash for item image
    metadata_url TEXT, -- IPFS URL for NFT metadata
    metadata_hash VARCHAR(255), -- IPFS hash for NFT metadata
    bill_url TEXT, -- IPFS URL for bill/receipt document
    bill_hash VARCHAR(255), -- IPFS hash for bill/receipt document
    id_url TEXT, -- IPFS URL for ID document
    id_hash VARCHAR(255), -- IPFS hash for ID document
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    notifications_email BOOLEAN DEFAULT true,
    notifications_sms BOOLEAN DEFAULT false,
    privacy_public_profile BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Co-owners table (for shared ownership)
CREATE TABLE IF NOT EXISTS public.co_owners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    co_owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'viewer', -- 'primary', 'secondary', 'viewer'
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, co_owner_id)
);

-- Transactions table (for tracking ownership transfers)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    from_owner_id UUID REFERENCES public.users(id),
    to_owner_id UUID REFERENCES public.users(id),
    transaction_hash VARCHAR(66), -- Blockchain tx hash
    transaction_type VARCHAR(50) DEFAULT 'transfer', -- 'mint', 'transfer', 'burn'
    gas_fee DECIMAL(18,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- XP logs table (for gamification)
CREATE TABLE IF NOT EXISTS public.xp_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON public.items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_serial_number ON public.items(serial_number);
CREATE INDEX IF NOT EXISTS idx_co_owners_item_id ON public.co_owners(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_item_id ON public.transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_xp_logs_user_id ON public.xp_logs(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (true);

-- Items policies
CREATE POLICY "Anyone can view items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Users can insert items" ON public.items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE USING (true);

-- Settings policies
CREATE POLICY "Users can manage own settings" ON public.settings FOR ALL USING (true);

-- Co-owners policies
CREATE POLICY "Anyone can view co-owners" ON public.co_owners FOR SELECT USING (true);
CREATE POLICY "Users can manage co-owners" ON public.co_owners FOR ALL USING (true);

-- Transactions policies
CREATE POLICY "Anyone can view transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Users can insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);

-- XP logs policies
CREATE POLICY "Anyone can view xp logs" ON public.xp_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert xp logs" ON public.xp_logs FOR INSERT WITH CHECK (true);

-- Utility functions
CREATE OR REPLACE FUNCTION upsert_user(
    wallet_addr VARCHAR(42),
    display_name_param VARCHAR(100) DEFAULT NULL,
    email_param VARCHAR(255) DEFAULT NULL
) RETURNS public.users AS $$
DECLARE
    result_user public.users;
BEGIN
    INSERT INTO public.users (wallet_address, display_name, email, xp_points, monthly_credits)
    VALUES (wallet_addr, display_name_param, email_param, 0, 10)
    ON CONFLICT (wallet_address) 
    DO UPDATE SET 
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        email = COALESCE(EXCLUDED.email, users.email),
        updated_at = NOW()
    RETURNING * INTO result_user;
    
    -- Create default settings for new users
    INSERT INTO public.settings (user_id)
    VALUES (result_user.id)
    ON CONFLICT DO NOTHING;
    
    RETURN result_user;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_stats(wallet_addr VARCHAR(42))
RETURNS TABLE(
    total_items BIGINT,
    total_xp INTEGER,
    monthly_credits INTEGER,
    rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.items i 
         JOIN public.users u ON i.owner_id = u.id 
         WHERE u.wallet_address = wallet_addr) as total_items,
        COALESCE(u.xp_points, 0) as total_xp,
        COALESCE(u.monthly_credits, 10) as monthly_credits,
        1 as rank -- Simplified ranking
    FROM public.users u
    WHERE u.wallet_address = wallet_addr;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_user_xp(
    user_wallet VARCHAR(42),
    xp_amount INTEGER,
    reason VARCHAR(255),
    item_uuid UUID DEFAULT NULL
) RETURNS void AS $$
DECLARE
    user_id_var UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id_var FROM public.users WHERE wallet_address = user_wallet;
    
    IF user_id_var IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Add XP to user
    UPDATE public.users 
    SET xp_points = xp_points + xp_amount 
    WHERE id = user_id_var;
    
    -- Log XP addition
    INSERT INTO public.xp_logs (user_id, item_id, amount, reason)
    VALUES (user_id_var, item_uuid, xp_amount, reason);
END;
$$ LANGUAGE plpgsql;