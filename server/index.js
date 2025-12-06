require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || '';

let supabase = null;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Server will run in limited "no-supabase" mode for local development or tests.');
  // lightweight fake supabase object used for dev/tests (won't persist data)
  supabase = {
    from: () => ({
      insert: async (payload) => ({ data: Array.isArray(payload) ? payload : [payload], error: null })
    }),
    auth: {
      admin: {
        createUser: async (opts) => ({ data: { user: { id: `dev-${Date.now()}` } }, error: null })
      },
      signInWithPassword: async (creds) => ({ data: { session: { access_token: 'dev-token', refresh_token: 'dev-refresh', expires_in: 3600 }, user: { id: 'dev-user', email: creds.email } }, error: null })
    }
  };
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false } });
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// rate limiter for contact endpoint
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 12, standardHeaders: true, legacyHeaders: false });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), supabase_mode: !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) });
});

// POST /api/contact - store contact message in Supabase 'contacts' table
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, hp, recaptcha } = req.body || {};

    // Honeypot anti-bot field — should be empty for human users
    if (hp) return res.status(400).json({ error: 'Spam detected' });

    if (!email || !message) {
      return res.status(400).json({ error: 'Missing required fields: email and message' });
    }

    // Optional reCAPTCHA verification if server is configured with RECAPTCHA_SECRET
    if (RECAPTCHA_SECRET) {
      if (!recaptcha) return res.status(400).json({ error: 'Missing recaptcha token' });
      try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(recaptcha)}`;
        const r = await fetch(verifyUrl, { method: 'POST' });
        const json = await r.json();
        if (!json.success) return res.status(400).json({ error: 'recaptcha verification failed' });
      } catch (e) {
        console.warn('recaptcha verification error', e?.message || e);
        return res.status(500).json({ error: 'recaptcha verification failed' });
      }
    }

    const payload = {
      name: name || null,
      email,
      subject: subject || null,
      message,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('contacts').insert(payload).select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to store contact message' });
    }

    // Optionally, you could trigger an email, webhook, or other notifications here

    return res.status(201).json({ saved: true, record: data && data[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/signup (server-side signup using service_role)
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, full_name, username } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    // Create user using admin createUser
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: full_name || null, username: username || null }
    });

    if (createError) {
      console.error('createUser error:', createError);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Optionally create a profile row if you use public.profiles
    try {
      const profile = {
        id: userData.user.id,
        username: username || null,
        full_name: full_name || null
      };
      await supabase.from('profiles').insert(profile);
    } catch (e) {
      // profile creation failure is non-fatal; log and continue
      console.warn('profile insert failed:', e.message || e);
    }

    return res.status(201).json({ created: true, user: userData.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/login — server-side sign-in and session return
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('login error', error);
      return res.status(401).json({ error: error.message || 'Invalid credentials' });
    }

    // Set httpOnly cookies for access & refresh tokens to improve security.
    const session = data.session || {};
    const accessToken = session.access_token;
    const refreshToken = session.refresh_token;
    const expiresIn = session.expires_in || 3600;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn * 1000
    };

    if (accessToken) res.cookie('sv_access', accessToken, cookieOptions);
    if (refreshToken) res.cookie('sv_refresh', refreshToken, cookieOptions);

    // Also return session object to the client for demo; production should rely on cookies.
    return res.json({ session, user: data.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/logout — clears server cookies
app.post('/api/logout', (req, res) => {
  res.clearCookie('sv_access');
  res.clearCookie('sv_refresh');
  return res.json({ logged_out: true });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
