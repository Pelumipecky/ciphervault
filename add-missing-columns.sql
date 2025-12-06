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

-- Add role column if it doesn't exist (replacing old admin boolean)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin'));
    END IF;
END $$;

-- Migrate existing admin boolean to role enum
DO $$
BEGIN
    -- If admin column exists, migrate its values to role
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'admin'
    ) THEN
        -- Set role based on admin boolean (override the default 'user' value)
        UPDATE users SET role = CASE WHEN admin = true THEN 'admin' ELSE 'user' END;

        -- Drop the old admin column
        ALTER TABLE users DROP COLUMN admin;
    END IF;
END $$;

-- Verify the columns were added and migration completed
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('phoneNumber', 'country', 'city', 'address', 'role')
ORDER BY column_name;
