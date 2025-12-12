import React, { useState } from 'react';
import { supabaseDb } from '@/lib/supabaseUtils';
import bcrypt from 'bcryptjs';

export default function AdminSeeder() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSeed = async () => {
    setStatus('loading');
    setError('');
    try {
      const email = 'admin@ciphervault.com';
      const password = 'AdminPass123!';
      const userName = 'admin';
      const name = 'Admin User';
      const hashedPassword = await bcrypt.hash(password, 10);
      const existing = await supabaseDb.getUserByEmail(email);
      if (existing) {
        setStatus('exists');
        return;
      }
      await supabaseDb.createUser({
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
      setStatus('success');
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: 24, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, margin: 24 }}>
      <h2>Admin Seeder (Danger Zone)</h2>
      <p>This will create a new admin user with email <b>admin@ciphervault.com</b> and password <b>AdminPass123!</b>.<br/>Remove this component after use.</p>
      <button onClick={handleSeed} disabled={status === 'loading' || status === 'success'} style={{ padding: '8px 16px', background: '#faad14', color: '#222', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
        {status === 'loading' ? 'Seeding...' : status === 'success' ? 'Admin Created' : status === 'exists' ? 'Admin Already Exists' : 'Create Admin'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {status === 'success' && <div style={{ color: 'green', marginTop: 8 }}>Admin created! Remove this component now.</div>}
      {status === 'exists' && <div style={{ color: '#faad14', marginTop: 8 }}>Admin already exists.</div>}
    </div>
  );
}
