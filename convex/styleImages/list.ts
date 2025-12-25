import { query } from "../_generated/server";

// List all unconfirmed style images that haven't been deleted
export const listUnconfirmedStyleImages = query({
  handler: async (ctx) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Query all style images where confirmed is false
    const allUnconfirmed = await ctx.db
      .query("styleImages")
      .withIndex("by_confirmed", (q) => q.eq("confirmed", false))
      .collect();

    // Filter out deleted images (deleted !== true)
    return allUnconfirmed.filter((image) => image.deleted !== true);
  },
});

