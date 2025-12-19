import { internalQuery } from "../_generated/server";

// Internal query to get the user's organization from the database
export const getOrganization = internalQuery({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get current user from database using Clerk ID
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return null; // User not found
    }

    // Get the first organization ID from user's organizationIds array
    const userOrgIds = currentUser.organizationIds;
    if (!userOrgIds || userOrgIds.length === 0) {
      return null; // User doesn't belong to any organization
    }

    // Get the organization document from the database
    const organization = await ctx.db.get(userOrgIds[0]);

    if (!organization) {
      return null; // Organization not found or deleted
    }

    return organization;
  },
});
