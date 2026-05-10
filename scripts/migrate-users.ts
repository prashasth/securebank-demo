import bcrypt from "bcryptjs";
import DescopeClient from "@descope/node-sdk";

const SALT_ROUNDS = 10;

// Legacy users from lib/data.ts — simulates a real DB export
const legacyUsers = [
  {
    email: "priya@securebank.com",
    name: "Priya Sharma",
    password: "Test@123",
  },
  {
    email: "alex@securebank.com",
    name: "Alex Thompson",
    password: "Test@123",
  },
];

async function migrateUsers() {
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;
  const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

  if (!projectId || !managementKey) {
    console.error("Missing NEXT_PUBLIC_DESCOPE_PROJECT_ID or DESCOPE_MANAGEMENT_KEY in .env.local");
    process.exit(1);
  }

  const descope = DescopeClient({ projectId, managementKey });

  console.log(`\nMigrating ${legacyUsers.length} users to Descope...\n`);

  const batchUsers = await Promise.all(
    legacyUsers.map(async (user) => {
      const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
      console.log(`  Hashed password for ${user.email}`);

      return {
        loginIdOrUserId: user.email,
        email: user.email,
        verifiedEmail: true,
        displayName: user.name,
        customAttributes: { freshlyMigrated: true },
        hashedPassword: {
          bcrypt: { hash },
        },
      };
    })
  );

  const { data, error } = await descope.management.user.createBatch(batchUsers);

  if (error) {
    console.error("\nMigration failed:", error.errorMessage ?? error.errorDescription);
    process.exit(1);
  }

  console.log("\nResults:");
  data?.createdUsers?.forEach((u) => console.log(`  ✓ ${u.email} — imported`));

  if (data?.failedUsers?.length) {
    console.log("\nFailed:");
    data.failedUsers.forEach((f) => console.log(`  ✗ ${f.user?.email} — ${f.failure}`));
  }

  console.log("\nMigration complete.\n");
}

migrateUsers();
