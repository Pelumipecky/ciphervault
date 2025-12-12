
// Use relative imports for compatibility with ts-node
import { supabaseDb } from './lib/supabaseUtils';
import bcrypt from 'bcryptjs';

async function addAdmin() {
  const email = 'admin@ciphervault.com';
  const password = 'AdminPass123!'; // Change this after first login
  const userName = 'admin';
  const name = 'Admin User';

  if (process.env.NODE_ENV === 'production') {
    console.error('This script should NOT be run in production!');
    process.exit(1);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if admin already exists
  const existing = await supabaseDb.getUserByEmail(email);
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    return;
  }

  // Create admin user
  const adminUser = await supabaseDb.createUser({
    email,
    password: hashedPassword,
    userName,
    name,
    role: 'admin',
    balance: 0,
    bonus: 0,
    investmentCount: 0,
    referralCount: 0,
    authStatus: 'approved',
  });
  console.log('Admin user created:', adminUser.email);
  console.warn('IMPORTANT: Change the default admin password after first login!');
}

addAdmin().catch(console.error);
