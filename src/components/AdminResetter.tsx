import { supabaseDb } from '@/lib/supabaseUtils';
import bcrypt from 'bcryptjs';
import React, { useState } from 'react';

export default function AdminResetter() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleReset = async () => {
    setStatus('loading');
    setError('');
    try {
      const email = 'admin@ciphervault.com';
      const newPassword = 'AdminPass123!'; // Change after login
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const admin = await supabaseDb.getUserByEmail(email);
      if (!admin) {
        setStatus('notfound');
        return;
      }
      await supabaseDb.updateUser(admin.idnum, { password: hashedPassword });
      setStatus('success');
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: 24, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, margin: 24 }}>
      <h2>Admin Password Resetter</h2>
      <p>This will reset the admin password to <b>AdminPass123!</b> for <b>admin@ciphervault.com</b>.<br/>Remove this component after use.</p>
      <button onClick={handleReset} disabled={status === 'loading' || status === 'success'} style={{ padding: '8px 16px', background: '#faad14', color: '#222', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
        {status === 'loading' ? 'Resetting...' : status === 'success' ? 'Password Reset' : status === 'notfound' ? 'Admin Not Found' : 'Reset Admin Password'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {status === 'success' && <div style={{ color: 'green', marginTop: 8 }}>Password reset! Remove this component now.</div>}
      {status === 'notfound' && <div style={{ color: '#faad14', marginTop: 8 }}>Admin not found.</div>}
    </div>
  );
}
