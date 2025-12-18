import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createOrganization = mutation({
  args: {
    clerkOrganizationId: v.string(),
    name: v.string(),
    vatNumber: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get creator user from DB
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Idempotency check: query organizations by clerkOrganizationId
    let existingOrg;
    try {
      // Prefer using the by_clerkOrganizationId index if it exists
      existingOrg = await ctx.db
        .query("organizations")
        .withIndex("by_clerkOrganizationId", (q) =>
          q.eq("clerkOrganizationId", args.clerkOrganizationId)
        )
        .first();
    } catch (error) {
      // Fallback to filter-based query if index is missing
      existingOrg = await ctx.db
        .query("organizations")
        .filter((q) => q.eq(q.field("clerkOrganizationId"), args.clerkOrganizationId))
        .first();
    }

    let orgId;
    if (existingOrg) {
      // Organization exists: patch it to add user._id to users array only if not already present
      const currentUsers = existingOrg.users || [];
      if (!currentUsers.includes(user._id)) {
        await ctx.db.patch(existingOrg._id, {
          users: [...currentUsers, user._id],
        });
      }
      orgId = existingOrg._id;
    } else {
      // Organization doesn't exist: create it as currently implemented
      orgId = await ctx.db.insert("organizations", {
        clerkOrganizationId: args.clerkOrganizationId,
        name: args.name,
        vatNumber: args.vatNumber,
        address: args.address,
        users: [user._id],
      });
    }

    // Also add org to user's organizationIds if not already present
    const currentOrgs = user.organizationIds || [];
    if (!currentOrgs.includes(orgId)) {
      await ctx.db.patch(user._id, {
        organizationIds: [...currentOrgs, orgId],
      });
    }

    return orgId;
  },
});
