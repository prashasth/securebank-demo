# SecureBank — Descope Integration Lab Guide

A step-by-step guide to integrating Descope authentication into the SecureBank demo app.
Follow each use case in order — each builds on the previous one.

---

## Prerequisites

Before you begin:

- [ ] Clone the repo and run `npm install` (see [SETUP.md](SETUP.md))
- [ ] Create a free account at [app.descope.com](https://app.descope.com)
- [ ] Create a new Descope project named `SecureBank`
- [ ] Copy your **Project ID** from Console → Project Settings
- [ ] Generate a **Management Key** from Console → Company → Management Keys
- [ ] Create a `.env.local` file with both values (see [SETUP.md](SETUP.md))

---

## Use Case 1 — User Import

**Goal:** Migrate Priya and Alex from the legacy system into Descope using the Batch Create Users API, simulating a real password hash migration.

### Step 1 — Install dependencies

```bash
npm install bcryptjs @descope/node-sdk
npm install --save-dev @types/bcryptjs tsx
```

### Step 2 — Create the migration script

Create `scripts/migrate-users.ts` _(added in this step)_.

This script:
1. Reads users from `lib/data.ts` (your "legacy database")
2. Bcrypt-hashes their plaintext passwords
3. POSTs to Descope's Batch Create Users API with `freshlyMigrated: true`

### Step 3 — Run the migration

```bash
npx tsx scripts/migrate-users.ts
```

Expected output:
```
Migrating 2 users to Descope...
✓ priya@securebank.com — imported
✓ alex@securebank.com — imported
Migration complete.
```

### Step 4 — Verify in Descope Console

> 📸 **SCREENSHOT NEEDED:** Descope Console → Users — showing Priya and Alex imported with `freshlyMigrated: true` custom attribute

Navigate to **Console → Users** and confirm:
- Both users appear
- Email is verified
- Custom attribute `freshlyMigrated` is set to `true`

---

## Use Case 2 — Password Auth

> _Coming soon_

---

## Use Case 3 — Passkey Enrollment

> _Coming soon_

---

## Use Case 4 — Passwordless Login

> _Coming soon_

---

## Use Case 5 — First-Time 2FA

> _Coming soon_

---

## Use Case 6 — Session Management

> _Coming soon_

---

## Use Case 7 — Step-Up Auth

> _Coming soon_

---

## Use Case 8 — Geolocation Step-Up

> _Coming soon_

---

## Use Case 9 — Geolocation Blocking

> _Coming soon_

---

## Use Case 10 — Account Recovery

> _Coming soon_

---

## Use Case 11 — User Management

> _Coming soon_

---

## Use Case 12 — Audit Logs

> _Coming soon_

---

## Screenshots Index

| # | Description | Use Case | Status |
|---|-------------|----------|--------|
| 1 | Descope Console → Users showing imported Priya & Alex | UC1 | Pending |
