import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get the style profile for a specific visit
 * This is used by the frontend to reactively listen for profile updates
 * and detect when the profile is complete
 */
export const getStyleProfileByVisit = query({
  args: {
    visitId: v.id("visits"),
  },
  handler: async (ctx, args) => {
    // No auth required - prospects are not logged in users
    // The visitId itself acts as a form of authentication

    const profile = await ctx.db
      .query("styleProfiles")
      .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
      .first();

    return profile;
  },
});


