import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { supabaseDb } from '@/lib/supabaseUtils';

export default function PasswordTester() {
  const [result, setResult] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const fetchHash = async () => {
      try {
        const user = await supabaseDb.getUserByEmail('admin@ciphervault.com');
        if (user?.password) {
          setHash(user.password);
        }
      } catch (e) {
        setResult(`Error fetching hash: ${(e as Error).message}`);
      }
    };
    fetchHash();
  }, []);

  const testPassword = async () => {
    if (!hash) {
      setResult('Hash not loaded yet');
      return;
    }

    const password = 'AdminPass123!';

    try {
      const isValid = await bcrypt.compare(password, hash);
      setResult(`Password 'AdminPass123!' matches hash: ${isValid}`);
    } catch (e) {
      setResult(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <div style={{padding:24,background:'#e6fffb',border:'1px solid #87e8de',borderRadius:8,margin:24}}>
      <h2>Password Test</h2>
      <p>Current hash: <code>{hash || 'Loading...'}</code></p>
      <p>Click to test if 'AdminPass123!' matches the current hash.</p>
      <button onClick={testPassword} style={{padding:'8px 16px',background:'#1890ff',color:'white',border:'none',borderRadius:4}}>
        Test Password
      </button>
      {result && <div style={{marginTop:8,color:result.includes('true')?'green':'red'}}>{result}</div>}
    </div>
  );
}