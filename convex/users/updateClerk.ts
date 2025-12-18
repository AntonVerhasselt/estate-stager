"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { getClerkClient } from "../lib/clerk";

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

    const client = getClerkClient();

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

    const client = getClerkClient();

    // Update user info using Clerk backend SDK
    await client.users.updateUser(userId, {
      firstName: args.firstName,
      lastName: args.lastName,
    });

    return { success: true };
  },
});
