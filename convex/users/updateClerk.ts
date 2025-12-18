"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";

export const updateUserMetadata = action({
  args: {
    publicMetadata: v.any(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Validate Clerk secret key
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error(
        "Missing CLERK_SECRET_KEY environment variable required to create Clerk client"
      );
    }

    // Initialize Clerk backend client
    const client = createClerkClient({
      secretKey: clerkSecretKey,
    });

    // Update user metadata using Clerk backend SDK
    await client.users.updateUserMetadata(userId, {
      publicMetadata: args.publicMetadata,
    });

    return { success: true };
  },
});

export const updateUserInfo = action({
  args: {
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Validate Clerk secret key
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error(
        "Missing CLERK_SECRET_KEY environment variable required to create Clerk client"
      );
    }

    // Initialize Clerk backend client
    const client = createClerkClient({
      secretKey: clerkSecretKey,
    });

    // Update user info using Clerk backend SDK
    await client.users.updateUser(userId, {
      firstName: args.firstName,
      lastName: args.lastName,
    });

    return { success: true };
  },
});
