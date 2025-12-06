-- Create Admin User for CipherVault
-- Run this in your Supabase SQL Editor to create an admin account

-- Insert admin user
INSERT INTO users (
  idnum,
  name,
  "userName",
  email,
  password,
  "phoneNumber",
  country,
  city,
  address,
  balance,
  bonus,
  "referralCount",
  "referralCode",
  role,
  created_at
) VALUES (
  'USR' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
  'Admin User',
  'admin',
  'admin@ciphervault.com',
  '$2b$10$vs15pXQ888HJjriQjzGGZ.Hj7NlARZ2tsSKrg6rylkTbowgXgSgZu', -- Hashed password for 'Admin123!'
  '+1234567890',
  'United States',
  'New York',
  '123 Admin Street',
  10000.00,
  500.00,
  0,
  'REF' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
  'admin',
  NOW()
);

-- Verify the user was created
SELECT idnum, name, "userName", email, balance, role
FROM users
WHERE email = 'admin@ciphervault.com';