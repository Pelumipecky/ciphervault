import bcrypt from 'bcryptjs';

const testPassword = async () => {
  const password = 'AdminPass123!';
  const hash = '$2b$10$DQY.kGcr5NRz/'; // Use the full hash from verifier

  const isValid = await bcrypt.compare(password, hash);
  console.log('Password match:', isValid);
};

testPassword();