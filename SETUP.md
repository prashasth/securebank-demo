# SecureBank — Trainee Setup Guide

## What is this?

SecureBank is a demo banking app built with Next.js. The UI is complete — your job is to integrate [Descope](https://www.descope.com/) authentication across 12 use cases.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A free [Descope account](https://app.descope.com/sign-up)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/prashasth/securebank-demo.git
cd securebank-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```bash
NEXT_PUBLIC_DESCOPE_PROJECT_ID=<your-descope-project-id>
DESCOPE_MANAGEMENT_KEY=<your-descope-management-key>
```

- **Project ID** — found in [Descope Console → Project Settings](https://app.descope.com/settings/project)
- **Management Key** — generated in [Descope Console → Company → Management Keys](https://app.descope.com/settings/company/managementkeys)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Explore the app

Log in with one of the demo credentials:

| User | Email | Password | Role |
|------|-------|----------|------|
| Priya Sharma | priya@securebank.com | Test@123 | Customer |
| Alex Thompson | alex@securebank.com | Test@123 | Customer |
| Admin | admin@securebank.com | Admin@123 | Admin |

> These are hardcoded in `lib/data.ts` — your migration work will move them into Descope.

## Your Mission — 12 Descope Use Cases

| # | Use Case | Descope Feature |
|---|----------|-----------------|
| 1 | User Import | Batch Create Users API |
| 2 | Password Auth | Password Flow |
| 3 | Passkey Enrollment | `promote-biometrics` built-in flow |
| 4 | Passwordless Login | `sign-up-or-in` Passkey Flow |
| 5 | First-Time 2FA | Magic Link + Passkey Flow |
| 6 | Session Management | JWT Tokens + Session Validation |
| 7 | Step-Up Auth | Step-Up Flow |
| 8 | Geolocation Step-Up | Conditional + Risk Signals in Flow |
| 9 | Geolocation Blocking | Conditional + Block Action in Flow |
| 10 | Account Recovery | Recovery Flow |
| 11 | User Management | Descope Console — Users |
| 12 | Audit Logs | Descope Console — Audit |

## Project Structure

```
securebank/
├── app/
│   ├── page.tsx          # Login page
│   ├── dashboard/        # Customer dashboard
│   ├── transfer/         # Money transfer
│   └── admin/            # Admin console
├── components/
│   └── NavBar.tsx
├── lib/
│   ├── auth.tsx          # Current mock auth — you'll replace this
│   └── data.ts           # Hardcoded users & transactions
```

## Useful Links

- [Descope Docs](https://docs.descope.com)
- [Descope Next.js SDK](https://docs.descope.com/sdk-reference/web/next)
- [Descope Console](https://app.descope.com)
