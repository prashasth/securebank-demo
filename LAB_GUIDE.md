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

### What's happening here?

In a real migration, your legacy database stores user passwords as hashes (e.g. bcrypt). You can't migrate plaintext passwords — and you shouldn't force users to reset. Instead, you export the hashes and hand them to Descope so users can log in with their existing password without ever knowing a migration happened.

In this demo, `lib/data.ts` is the "legacy database" with plaintext passwords. The migration script simulates what a real team would do: bcrypt-hash those passwords, then call Descope's API to import the users.

### API used

**POST** `https://api.descope.com/v1/mgmt/user/create/batch`

- Requires a **Management Key** as a Bearer token (server-side only — never expose this in the browser)
- Accepts an array of users with fields like `loginIdOrUserId`, `email`, `verifiedEmail`, `displayName`, `customAttributes`, and `hashedPassword`
- The `hashedPassword.bcrypt.hash` field accepts a standard bcrypt hash string — Descope verifies future logins against it transparently
- The `customAttributes.freshlyMigrated: true` flag is used later in Use Case 3 to trigger the passkey enrollment flow automatically after first login

**SDK used:** `@descope/node-sdk` → `descope.management.user.createBatch(users)`

---

**Goal:** Migrate Priya and Alex from the legacy system into Descope using the Batch Create Users API, simulating a real password hash migration.

### Step 1 — Create the `freshlyMigrated` custom attribute in Descope Console

Before importing users, you need to register the custom attribute in Descope so it can be stored against each user.

1. Go to **Console → Users → Custom Attributes** tab
   ([app.descope.com/users/attributes](https://app.descope.com/users/attributes))

   > ![Custom Attributes tab — empty](screenshots/uc1-01-custom-attributes-empty.png)

2. Click **+ Create Attribute** and fill in:
   - **Display Name:** `Freshly Migrated`
   - **Machine Name:** `freshlyMigrated` _(auto-fills)_
   - **Type:** `Boolean`

   > ![Create Attribute dialog filled in](screenshots/uc1-02-create-attribute-dialog.png)

3. Click **Add**. You should now see the attribute listed:

   > ![Custom Attributes tab showing freshlyMigrated](screenshots/uc1-03-custom-attributes-created.png)

---

### Step 2 — Install dependencies

```bash
npm install bcryptjs @descope/node-sdk
npm install --save-dev @types/bcryptjs tsx
```

---

### Step 3 — Create the migration script

Create `scripts/migrate-users.ts`. This script:
1. Reads users from `lib/data.ts` (your "legacy database")
2. Bcrypt-hashes their plaintext passwords (simulating a real DB export)
3. POSTs to Descope's Batch Create Users API with `freshlyMigrated: true`

---

### Step 4 — Set up environment variables

Ensure your `.env.local` has:

```
NEXT_PUBLIC_DESCOPE_PROJECT_ID=<your-project-id>
DESCOPE_MANAGEMENT_KEY=<your-management-key>
```

---

### Step 5 — Run the migration

```bash
npx tsx scripts/migrate-users.ts
```

Expected output:
```
Migrating 2 users to Descope...
  Hashed password for priya@securebank.com
  Hashed password for alex@securebank.com

Results:
  ✓ priya@securebank.com — imported
  ✓ alex@securebank.com — imported

Migration complete.
```

---

### Step 6 — Verify in Descope Console

Navigate to **Console → Users** and confirm both Priya and Alex appear with verified emails:

> ![Console Users list showing Priya and Alex imported](screenshots/uc1-04-users-imported.png)

Click on a user to confirm `freshlyMigrated` is checked:

> ![Priya Sharma profile with Freshly Migrated checked](screenshots/uc1-05-user-freshly-migrated.png)

✅ **Use Case 1 complete.** Both users are in Descope with bcrypt-hashed passwords and `freshlyMigrated: true`.

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

| # | File | Description | Status |
|---|------|-------------|--------|
| 1 | `uc1-01-custom-attributes-empty.png` | Custom Attributes tab — empty state | ✅ Captured |
| 2 | `uc1-02-create-attribute-dialog.png` | Create Attribute dialog filled in | ✅ Captured |
| 3 | `uc1-03-custom-attributes-created.png` | Custom Attributes tab showing freshlyMigrated | ✅ Captured |
| 4 | `uc1-04-users-imported.png` | Console → Users showing Priya & Alex imported | ✅ Captured |
| 5 | `uc1-05-user-freshly-migrated.png` | Priya's profile with Freshly Migrated checked | ✅ Captured |
