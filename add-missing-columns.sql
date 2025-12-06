-- ================================================
-- ADD MISSING COLUMNS TO USERS TABLE
-- ================================================
-- Run this script in your Supabase SQL Editor to add missing columns
-- to an existing users table

-- Add phoneNumber column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phoneNumber'
    ) THEN
        ALTER TABLE users ADD COLUMN "phoneNumber" TEXT;
    END IF;
END $$;

-- Add country column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'country'
    ) THEN
        ALTER TABLE users ADD COLUMN country TEXT;
    END IF;
END $$;

-- Add city column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'city'
    ) THEN
        ALTER TABLE users ADD COLUMN city TEXT;
    END IF;
END $$;

-- Add address column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'address'
    ) THEN
        ALTER TABLE users ADD COLUMN address TEXT;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('phoneNumber', 'country', 'city', 'address')
ORDER BY column_name;
