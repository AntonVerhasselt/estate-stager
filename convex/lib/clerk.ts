"use node";

import { createClerkClient } from "@clerk/backend";

export function getClerkClient() {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    throw new Error(
      "Missing CLERK_SECRET_KEY environment variable required to create Clerk client"
    );
  }

  return createClerkClient({
    secretKey: clerkSecretKey,
  });
}
