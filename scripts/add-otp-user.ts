import bcrypt from "bcryptjs";
import DescopeClient from "@descope/node-sdk";

const SALT_ROUNDS = 10;

async function addOtpUser() {
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;
  const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

  if (!projectId || !managementKey) {
    console.error("Missing NEXT_PUBLIC_DESCOPE_PROJECT_ID or DESCOPE_MANAGEMENT_KEY in .env.local");
    process.exit(1);
  }

  const descope = DescopeClient({ projectId, managementKey });

  const hash = await bcrypt.hash("Test@123", SALT_ROUNDS);
  console.log("\nHashed password for sharatbaliga@gmail.com");

  const { data, error } = await descope.management.user.createBatch([
    {
      loginIdOrUserId: "sharatbaliga@gmail.com",
      email: "sharatbaliga@gmail.com",
      verifiedEmail: true,
      displayName: "Sharat",
      customAttributes: { otpEnabled: true },
      hashedPassword: {
        bcrypt: { hash },
      },
    },
  ]);

  if (error) {
    console.error("\nFailed:", error.errorMessage ?? error.errorDescription);
    process.exit(1);
  }

  console.log("\nResults:");
  data?.createdUsers?.forEach((u) => console.log(`  ✓ ${u.email} — imported`));

  if (data?.failedUsers?.length) {
    console.log("\nFailed:");
    data.failedUsers.forEach((f) => console.log(`  ✗ ${f.user?.email} — ${f.failure}`));
  }

  console.log("\nDone.\n");
}

addOtpUser();
