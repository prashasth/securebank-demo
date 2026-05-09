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

When migrating users from a legacy system to a new identity provider like Descope, one of the biggest concerns is disruption — you don't want to force every user to reset their password just because the backend changed. Descope solves this with **hashed password import**: you export the password hashes from your old database and pass them directly to Descope. From that point on, when a user logs in with their existing password, Descope verifies it against the imported hash transparently. The user never knows a migration happened.

In this demo, `lib/data.ts` acts as the legacy database. It stores passwords in plaintext (which a real system would never do — a real DB would store bcrypt hashes). The migration script simulates what a real engineering team would do:
1. Export users and their password hashes from the old database
2. Call Descope's Batch Create Users API to import them
3. Tag each user with `freshlyMigrated: true` so the app can trigger a passkey enrollment flow on their next login (Use Case 3)

---

### API used

**`POST https://api.descope.com/v1/mgmt/user/create/batch`**

This is a **Management API** — it requires a Management Key, not a user session token. It's meant to be called server-side only (migration scripts, backend jobs) and should never be exposed to the browser.

Key request fields:

| Field | Description |
|-------|-------------|
| `loginIdOrUserId` | The unique login identifier — we use the email address |
| `email` | The user's email |
| `verifiedEmail: true` | Marks the email as already verified — skips re-verification since the legacy system already verified it |
| `displayName` | The user's full name |
| `hashedPassword.bcrypt.hash` | The bcrypt hash string — Descope will verify future logins against this |
| `customAttributes.freshlyMigrated` | A custom boolean flag we define — used in Use Case 3 to detect first-time logins and prompt passkey enrollment |

**SDK:** `@descope/node-sdk` → `descope.management.user.createBatch(users)`

Descope supports these hashing algorithms for import: `bcrypt`, `argon2`, `pbkdf2`, `firebase`, `django`, `phpass`, `md5`, and `sha` variants. This means you can migrate from virtually any major stack without forcing password resets.

---

### Step 1 — Create the `freshlyMigrated` custom attribute

Before importing users, you need to define the `freshlyMigrated` attribute in your Descope project. Descope won't accept unknown custom attributes — they must be declared in the schema first.

This attribute is a boolean flag that will be set to `true` on every imported user. Later, in Use Case 3, the app checks this flag after login to decide whether to show the passkey enrollment prompt.

1. Go to **Console → Users → Custom Attributes** tab
   ([app.descope.com/users/attributes](https://app.descope.com/users/attributes))

   > ![Custom Attributes tab — empty](screenshots/uc1-01-custom-attributes-empty.png)

2. Click **+ Create Attribute** and fill in:
   - **Display Name:** `Freshly Migrated` — human-readable label shown in the Console
   - **Machine Name:** `freshlyMigrated` — auto-fills; this is the key used in code
   - **Type:** `Boolean` — since this is a true/false flag

   > ![Create Attribute dialog filled in](screenshots/uc1-02-create-attribute-dialog.png)

3. Click **Add**. You should now see the attribute listed:

   > ![Custom Attributes tab showing freshlyMigrated](screenshots/uc1-03-custom-attributes-created.png)

---

### Step 2 — Get your Project ID and Management Key

You need two credentials from Descope to authenticate the migration script.

**Project ID** identifies your Descope project. It's safe to use in frontend code (prefixed with `NEXT_PUBLIC_`) since it's not a secret — it's like a project name.

1. Go to **Console → Settings → Project**
2. Copy the **Project ID** field (starts with `P2...`)

   > ![Settings → Project showing Project ID](screenshots/uc1-06-project-id.png)

**Management Key** is a privileged server-side secret that grants access to Descope's Management APIs (create users, delete users, etc.). Treat it like a database password — never commit it or expose it in the browser.

1. Go to **Console → Settings → Company → Management Keys**
2. Click **+ Management Key** and fill in:
   - **Name:** `securebank`
   - **Description:** `securebank demo`
   - **Expiration:** `30 Days` — for demos, short expiry is fine; production keys should be rotated regularly
   - **Roles:** `Full Access` — needed to create and manage users

   > ![Generate Management Key dialog](screenshots/uc1-07-generate-management-key.png)

3. Click **Generate Key**. Copy the key immediately — Descope shows it only once and cannot retrieve it later.

   > ![Management key created confirmation](screenshots/uc1-08-management-key-created.png)

4. Create a `.env.local` file in your project root and add both values:

   ```
   NEXT_PUBLIC_DESCOPE_PROJECT_ID=<your-project-id>
   DESCOPE_MANAGEMENT_KEY=<your-management-key>
   ```

   > **Important:** `.env.local` is already listed in `.gitignore` — it will never be committed. Never hardcode these values in your source files.

---

### Step 3 — Install dependencies

The migration script needs two packages:
- **`bcryptjs`** — to hash the legacy plaintext passwords before importing (simulating what a real DB export would contain)
- **`@descope/node-sdk`** — Descope's server-side SDK for calling the Management API
- **`tsx`** — runs TypeScript files directly without a build step (dev only)

```bash
npm install bcryptjs @descope/node-sdk
npm install --save-dev @types/bcryptjs tsx
```

---

### Step 4 — Review the migration script

Open `scripts/migrate-users.ts`. Here's what it does step by step:

```typescript
// 1. For each legacy user, generate a bcrypt hash of their plaintext password
const hash = await bcrypt.hash(user.password, SALT_ROUNDS);

// 2. Build the Descope user object with the hash and freshlyMigrated flag
return {
  loginIdOrUserId: user.email,
  email: user.email,
  verifiedEmail: true,        // already verified in the legacy system
  displayName: user.name,
  customAttributes: { freshlyMigrated: true },
  hashedPassword: {
    bcrypt: { hash },         // Descope stores this and verifies future logins against it
  },
};

// 3. Call the Batch Create Users API
const { data, error } = await descope.management.user.createBatch(batchUsers);
```

`SALT_ROUNDS = 10` is the bcrypt work factor — higher is more secure but slower to hash. 10 is the industry standard for most applications.

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

Navigate to **Console → Users** and confirm both Priya and Alex appear. Notice their status is **Invited** — this is normal for batch-imported users. They become **Active** after their first login.

> ![Console Users list showing Priya and Alex imported](screenshots/uc1-04-users-imported.png)

Click on **Priya Sharma** to open her profile. Scroll down and confirm:
- Email is verified (checkmark next to email)
- **Freshly Migrated** checkbox is checked

> ![Priya Sharma profile with Freshly Migrated checked](screenshots/uc1-05-user-freshly-migrated.png)

✅ **Use Case 1 complete.** Both users are now in Descope with bcrypt-hashed passwords and `freshlyMigrated: true`. They can log in with their existing password (`Test@123`) without any reset — and the app will detect the flag to prompt passkey enrollment in Use Case 3.

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
| 6 | `uc1-06-project-id.png` | Settings → Project showing Project ID | ✅ Captured |
| 7 | `uc1-07-generate-management-key.png` | Generate Management Key dialog | ✅ Captured |
| 8 | `uc1-08-management-key-created.png` | Management key created confirmation | ✅ Captured |
