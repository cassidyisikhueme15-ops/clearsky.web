# ClearSky 5.0

ClearSky 5.0 is a Nigerian-naira-only AI creative workspace.

## Memberships
- Bronze: ₦1,900/month
- Silver: ₦2,900/month
- Gold: ₦3,900/month
- Platinum: ₦4,900/month
- Premium: invite-only
- Yearly billing is monthly price × 12.
- New users receive a 5% discount on their first membership purchase.
- Paid memberships remove the ClearSky watermark. Admins and sub-admins also have watermark-free generation.

## Free tools
- Website Maker
- AI Logo Maker
- AI Flyer Maker
- AI Beats Generator

## Membership-only tools
- App Builder
- Game Builder
- Photo Studio
- AI Maker

Admin and approved sub-admins can use every generation tool for free.

## Accounts
Every user must choose a unique nickname. If a nickname is taken, ClearSky returns unused suggestions. Users can change their nickname later to another unused name.

**Log out** keeps the account and lets the user sign in again on another device.

**Sign out and delete account** permanently deletes the account. The deleted account cannot be logged into again; the person can create a new account.

## Paid sub-admin
A sub-admin application costs ₦10,000. The user pays through Paystack, then the owner can grant the sub-admin role from the admin dashboard. Admin is free.

## Setup
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Copy `.env.example` to `.env`.
4. Fill in the secrets yourself. Never paste them into chat or frontend files.
5. Run `npm install`.
6. Run `npm start`.
7. Open `http://localhost:3000`.

## Paystack
For testing, use a Paystack test secret key. For real payments, use a live key only after the Paystack account is activated.

Webhook: `https://YOUR-DOMAIN/api/pay/webhook`

## AI Beats
The AI Beats Generator asks the text model for a drum pattern, then ClearSky renders a simple WAV beat server-side. It is an original synthetic drum pattern rather than a commercial music sample.

## Security and deployment review
ClearSky 5.0 now includes several deployment-hardening measures:
- Security headers including HSTS in production, clickjacking protection, MIME sniffing protection, Referrer-Policy and Permissions-Policy.
- Production startup checks for a strong JWT secret, hashed admin password, SMTP, Paystack live key and OpenAI key.
- Rate limits on signup, login, OTP, resend OTP, payments, Premium applications and AI generation endpoints.
- Short-lived 24-hour JWT sessions with server-side session records and revocation on logout/account deletion. Each device login gets its own session.
- Admin actions and important payment/account events are written to an audit log.
- Paystack webhooks are verified with HMAC SHA-512 before processing.
- Paystack webhook parsing occurs before the JSON body parser, preventing the raw-signature verification bug common in this setup.
- Admin and sub-admin accounts cannot purchase memberships. The owner admin is not a membership plan and is never charged. Paid sub-admin access still requires the ₦10,000 application payment and owner approval.
- API responses are marked `no-store` to reduce sensitive-data caching.

### Production deployment checklist
1. Set `NODE_ENV=production`.
2. Set a random `JWT_SECRET` of at least 32 characters.
3. Generate a bcrypt admin password hash and put it in `ADMIN_PASSWORD_HASH`; do not use a plaintext production admin password. Example: `node -e "console.log(require('bcryptjs').hashSync('REPLACE_ME',12))"`. Run this locally and keep the resulting hash private.
4. Configure SMTP for OTPs and owner notifications.
5. Use a real domain with HTTPS. Put ClearSky behind a reverse proxy/load balancer that terminates TLS and set `TRUST_PROXY=true` only when that proxy is trusted.
6. Use a Paystack `sk_live_...` key only after Paystack has activated the account. Configure the webhook as `https://YOUR-DOMAIN/api/pay/webhook`.
7. Keep `OPENAI_API_KEY` only on the server. Never place it in `public/` or client-side JavaScript.
8. Store secrets in your hosting provider's secret manager/environment variables rather than committing `.env`.
9. Back up `clearsky.db` regularly and test restoring a backup. For higher traffic, move from SQLite to a managed production database.
10. Monitor the audit log, server errors, payment webhooks and OpenAI usage.
11. Keep dependencies updated and run `npm audit` before releases.
12. Have a qualified security professional review the deployment before accepting substantial real-money traffic. Have a Nigerian lawyer review the Terms and Privacy Policy for the actual business.

### CSRF note
ClearSky currently sends authentication in an `Authorization: Bearer` header rather than an ambient browser cookie, so classic cookie-based CSRF is not the primary risk. If authentication is later moved to cookies, add CSRF tokens and `SameSite` cookie protections before release.

This hardening is not a guarantee of security. No application can be declared secure merely because a checklist was completed, which is an unfortunate but persistent feature of software engineering.

## ClearSky 5.0 interface update

Version 5.0 changes the front-end experience to a mature white, yellow, and charcoal theme. The home route is now the ClearSky dashboard and no longer redirects visitors to login. Visitors can browse the dashboard and tools without an account, but generation actions require an active login session.

The profile page shows only the sign-in/login actions when a visitor is not authenticated. A shared navbar component is loaded on the ClearSky pages so the ClearSky 5.0 brand and navigation remain consistent across the app.

### Local Windows start

1. Open the ClearSky 5.0 folder in VS Code.
2. Make sure your `.env` file is present and contains your existing secrets.
3. In the VS Code terminal run:

```powershell
npm.cmd install
node server.js
```

4. Open `http://localhost:3000`.

You can also double-click `Start-ClearSky-5.0.bat` in the project folder. It installs dependencies the first time and starts the server.

### Email OTP storage
ClearSky 5.0 does not persist email verification OTPs. OTP hashes are kept only in server RAM for up to 10 minutes, are deleted after successful verification or expiry, and are invalidated when the server restarts. The legacy SQLite `otps` table is removed during startup. Pending verification email addresses are kept in browser `sessionStorage` only and cleared after successful verification.


## APA voice and camera
APA now supports browser voice input/output and camera capture. Camera frames are sent only when the user captures one and are not written to the ClearSky database. API calls use the configured OpenAI model with `store:false` for APA vision requests. The server's Permissions-Policy allows camera/microphone for this origin.

For use on another device, run the server on a trusted local network and open `http://<PC-IP>:3000`. For public deployment, use HTTPS and authentication.
