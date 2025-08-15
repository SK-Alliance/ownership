-- Execute these SQL commands in your Supabase dashboard in order:
-- 1. First create users table
-- 2. Then create items tables  
-- 3. Finally create minted NFTs table

-- Step 1: Create users table
-- Copy and paste the content from sql/create-users-table.sql

-- Step 2: Create items tables
-- Copy and paste the content from sql/create-items-tables.sql

-- Step 3: Create minted NFTs table
-- Copy and paste the content from sql/create-minted-nfts-table.sql

-- After running all scripts, verify tables exist:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- This should show: users, items, co_owners, transactions, minted_nfts tables
