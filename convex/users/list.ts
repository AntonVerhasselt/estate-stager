import { internalQuery } from "../_generated/server";

export const listOrganizationUsers = internalQuery({
  handler: async (ctx) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get current user from database using Clerk ID
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return [];
    }

    // Get organization from user's organizationIds (use first org for now)
    const userOrgIds = currentUser.organizationIds;
    if (!userOrgIds || userOrgIds.length === 0) {
      return [];
    }

    // Get the organization directly by ID
    const organization = await ctx.db.get(userOrgIds[0]);

    if (!organization) {
      return [];
    }

    // Get all users from the organization's users array
    const userIds = organization.users;
    const users = await Promise.all(
      userIds.map((userId) => ctx.db.get(userId))
    );

    // Format return users array (filter out null in case of deleted users)
    const usersFormatted = users
      .filter((user) => user !== null)
      .map((user) => ({
        _id: user._id,
        fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        current: user._id === currentUser._id,
      }));

    return usersFormatted;
  },
});
