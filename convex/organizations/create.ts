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

    // Create organization
    const orgId = await ctx.db.insert("organizations", {
      clerkOrganizationId: args.clerkOrganizationId,
      name: args.name,
      vatNumber: args.vatNumber,
      address: args.address,
      users: [user._id],
    });

    // Also add org to user's organizationIds
    const currentOrgs = user.organizationIds || [];
    await ctx.db.patch(user._id, {
      organizationIds: [...currentOrgs, orgId],
    });

    return orgId;
  },
});
