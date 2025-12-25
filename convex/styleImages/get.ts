import { internalQuery } from "../_generated/server";
import { v } from "convex/values";

// Check if a styleImage with the given unsplashId already exists
export const getByUnsplashId = internalQuery({
  args: {
    unsplashId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("styleImages")
      .withIndex("by_unsplashId", (q) => q.eq("unsplashId", args.unsplashId))
      .first();
  },
});

// Batch check which unsplashIds already exist in the database
export const getExistingUnsplashIds = internalQuery({
  args: {
    unsplashIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await Promise.all(
      args.unsplashIds.map((id) =>
        ctx.db
          .query("styleImages")
          .withIndex("by_unsplashId", (q) => q.eq("unsplashId", id))
          .first()
      )
    );
    // Return array of IDs that already exist
    return args.unsplashIds.filter((_, i) => existing[i] !== null);
  },
});