import { useEffect, useState } from 'react';
import { supabaseDb } from '@/lib/supabaseUtils';

export default function AdminVerifier() {
  const [admin, setAdmin] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const user = await supabaseDb.getUserByEmail('admin@ciphervault.com');
        setAdmin(user);
      } catch (e) {
        setError((e as Error).message || 'Unknown error');
      }
    })();
  }, []);

  if (error) return <div style={{color:'red'}}>Error: {error}</div>;
  if (!admin) return <div>Loading admin info…</div>;
  return (
    <div style={{padding:24,background:'#e6fffb',border:'1px solid #87e8de',borderRadius:8,margin:24}}>
      <h2>Admin User Info</h2>
      <div><b>Email:</b> {admin.email}</div>
      <div><b>Role:</b> {admin.role}</div>
      <div><b>ID:</b> {admin.idnum}</div>
      <div><b>Status:</b> {admin.authStatus}</div>
      <div><b>Hashed Password:</b> <code>{admin.password}</code></div>
    </div>
  );
}
