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

    // Load and validate the organization exists
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Update user's organizationIds (avoid duplicates)
    const currentOrgs = user.organizationIds || [];
    if (!currentOrgs.includes(args.organizationId)) {
      await ctx.db.patch(user._id, {
        organizationIds: [...currentOrgs, args.organizationId],
      });
    }

    // Update organization's users array (avoid duplicates)
    const currentUsers = organization.users || [];
    if (!currentUsers.includes(user._id)) {
      await ctx.db.patch(args.organizationId, {
        users: [...currentUsers, user._id],
      });
    }

    return user._id;
  },
});
