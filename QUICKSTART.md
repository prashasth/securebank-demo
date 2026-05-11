# SecureBank — Blackbox Quickstart

This branch has the full Descope integration pre-built. You only need to wire up your own Descope project via environment variables — no code changes required.

## Prerequisites

- Node.js 18+
- A Descope project ([console.descope.com](https://console.descope.com))

---

## Setup (5 minutes)

### 1. Clone and install

```bash
git clone https://github.com/prashasth/securebank-demo.git
cd securebank-demo
git checkout blackbox
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_DESCOPE_PROJECT_ID` | Console → Project Settings |
| `NEXT_PUBLIC_DESCOPE_FLOW_LOGIN` | Your flow ID (e.g. `sign-up-or-in-bank`) |
| `DESCOPE_MANAGEMENT_KEY` | Console → Company → Management Keys |

### 3. Import the login flow

In Descope Console → Flows → Import:
- **UC4 (Passwordless):** import `flows/sign-up-or-in-bank.json`
- **UC5 (Password + OTP):** import `flows/sign-up-or-in-bank_otp.json`

Set `NEXT_PUBLIC_DESCOPE_FLOW_LOGIN` to the imported flow's ID.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Test users

Run the migration script to import Priya and Alex into your Descope project:

```bash
npx ts-node scripts/migrate-users.ts
```

| User | Email | Password |
|---|---|---|
| Priya | priya@securebank.com | Test@123 |
| Alex | alex@securebank.com | Test@123 |
| Sharat (UC5) | sharatbaliga@gmail.com | Test@123 |

To add Sharat (OTP user):

```bash
npx ts-node scripts/add-otp-user.ts
```

---

## What's covered

| UC | Feature | What to demo |
|---|---|---|
| UC1 | User Import | Run migration script, verify users in Console |
| UC2 | Password Auth | Login with Priya/Alex via password |
| UC3 | Passkey Enrollment | Priya sees passkey prompt after first login |
| UC4 | Passwordless Login | Returning login — passkey tap |
| UC5 | Password + OTP | Sharat logs in with password + OTP |
| UC6 | Connectors (HIBP) | New user sets `Admin@123` → blocked |
| UC7 | Session Management | DevTools → cookies → JWT decode |
