import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";

/**
 * Get all swipes for a visit (for displaying liked images on profile page)
 */
export const listLikedSwipesForVisit = query({
    args: {
      visitId: v.id("visits"),
    },
    handler: async (ctx, args) => {
      const swipes = await ctx.db
        .query("swipes")
        .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
        .order("desc")
        .collect();
  
      // Filter to only liked swipes and deduplicate by styleImageId
      const likedSwipes = swipes.filter((s) => s.direction === "like");
      const seenImageIds = new Set<string>();
      const uniqueLikedSwipes = likedSwipes.filter((swipe) => {
        if (seenImageIds.has(swipe.styleImageId)) {
          return false;
        }
        seenImageIds.add(swipe.styleImageId);
        return true;
      });
      
      const likedImages = await Promise.all(
        uniqueLikedSwipes.map(async (swipe) => {
          const styleImage = await ctx.db.get(swipe.styleImageId);
          if (!styleImage) return null;
          return {
            id: styleImage._id,
            unsplashUrl: styleImage.unsplashUrl,
            style: styleImage.style,
            roomType: styleImage.roomType,
          };
        })
      );
  
      return likedImages.filter((img): img is NonNullable<typeof img> => img !== null);
    },
  });

/**
 * Get swipes with their associated style images (internal use for profile calculation)
 */
export const listSwipesWithImages = internalQuery({
  args: {
    visitId: v.id("visits"),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the last N swipes for this visit, ordered by timestamp descending
    const swipes = await ctx.db
      .query("swipes")
      .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
      .order("desc")
      .take(args.limit);

    // Fetch the corresponding style images
    const swipesWithImages = await Promise.all(
      swipes.map(async (swipe) => {
        const styleImage = await ctx.db.get(swipe.styleImageId);
        return { swipe, styleImage };
      })
    );

    // Filter out any swipes where the style image was deleted
    return swipesWithImages.filter(
      (item): item is { swipe: typeof swipes[0]; styleImage: Doc<"styleImages"> } =>
        item.styleImage !== null
    );
  },
});
