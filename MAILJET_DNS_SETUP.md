# Mailjet DNS Configuration (Fix SPF Error)

To fix the "SPF record is missing" error and ensure your emails land in the Inbox (not Spam), you must configure your DNS records.

## 1. SPF Record (Sender Policy Framework)
**Type:** `TXT`
**Host/Name:** `@`
**Value:**
```
v=spf1 include:spf.mailjet.com include:_spf.reach.hostinger.com ~all
```
*(This combines your Hostinger email service with Mailjet, ensuring both can send emails on your behalf without being marked as spam.)*

## 2. DKIM Record (DomainKeys Identified Mail)
Mailjet likely provided a specific DKIM record in their dashboard. It usually looks like:
**Type:** `TXT`
**Host/Name:** `mailjet._domainkey`
**Value:** (A long string provided by Mailjet)

## 3. Verify in Mailjet
After adding these records to your domain provider (GoDaddy, Namecheap, Vercel, etc.):
1. Go to Mailjet Dashboard > Account Settings > Sender Authentication.
2. Click "Check DNS" or "Validate".
3. It may take up to 24 hours to propagate, but usually happens within minutes.

## 4. (Optional but Recommended) DMARC Record
Add a DMARC TXT record to improve deliverability and reporting. This will **not** break mail—using `p=none` only monitors.

- **Type:** `TXT`
- **Host/Name:** `_dmarc`
- **Value:**
```
v=DMARC1; p=none; rua=mailto:dmarc@ciphervault.online; ruf=mailto:dmarc@ciphervault.online; pct=100; adkim=s; aspf=s
```

Notes:
- `p=none` is monitoring-only; change to `quarantine`/`reject` later if desired.
- `adkim=s` / `aspf=s` align DKIM/SPF strictly with your domain.
- `rua`/`ruf` send aggregate/forensic reports to your mailbox; you can remove `ruf` if you prefer fewer reports.

---

# Vercel Deployment Fixes Applied

1. **Backend Dependencies:** Moved `node-mailjet`, `express`, `cors` to the root `package.json` so Vercel can find them.
2. **ES Modules:** Converted all backend files in `api/` to ES Modules (`import`/`export`) to match the project structure (`"type": "module"`).
3. **EmailJS Removal:** Completely removed EmailJS from the backend scheduler and replaced it with Mailjet.

**Next Step:**
Redeploy your application to Vercel to apply the 500 Error fix.
```bash
git add .
git commit -m "Fix Vercel 500 error: Convert api to ESM and fix dependencies"
git push
```
