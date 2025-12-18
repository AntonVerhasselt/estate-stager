"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";

export const updateOrganizationMetadata = action({
  args: {
    organizationId: v.string(),
    publicMetadata: v.any(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify user belongs to this organization
    // Option 1: Check via Clerk's org_id claim in the JWT
    const userOrgId = identity.org_id;
    if (userOrgId !== args.organizationId) {
      throw new Error("Not authorized to update this organization");
    }

    // Initialize Clerk backend client
    const client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    // Update organization metadata using Clerk backend SDK
    await client.organizations.updateOrganizationMetadata(
      args.organizationId,
      {
        publicMetadata: args.publicMetadata,
      }
    );

    return { success: true };
  },
});
