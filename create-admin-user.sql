-- Create Admin User for CipherVault
-- Run this in your Supabase SQL Editor to create an admin account

-- Insert admin user
INSERT INTO users (
  idnum,
  name,
  username,
  email,
  password,
  balance,
  bonus,
  referral_count,
  referral_code,
  admin,
  created_at
) VALUES (
  'USR' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
  'Admin User',
  'admin',
  'admin@ciphervault.com',
  '$2a$10$YourHashedPasswordHere', -- You'll need to hash 'Admin123!' with bcrypt
  10000.00,
  500.00,
  0,
  'REF' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
  true,
  NOW()
);

-- Verify the user was created
SELECT idnum, name, username, email, balance, admin 
FROM users 
WHERE email = 'admin@ciphervault.com';
