import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Update user info (Step 1 completion)
export const completeUserInfo = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      firstName: args.firstName,
      lastName: args.lastName,
      phoneNumber: args.phoneNumber,
    });

    return user._id;
  },
});

// Add organization to user (after org creation in Step 2)
export const addOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentOrgs = user.organizationIds || [];

    await ctx.db.patch(user._id, {
      organizationIds: [...currentOrgs, args.organizationId],
    });

    return user._id;
  },
});
