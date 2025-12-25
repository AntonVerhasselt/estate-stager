import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

// Create a new styleImage record
export const createStyleImage = internalMutation({
  args: {
    unsplashId: v.string(),
    unsplashUrl: v.string(),
    unsplashBlurHash: v.optional(v.string()),
    searchKeyword: v.string(),
    confirmed: v.boolean(),
    style: v.optional(
      v.array(
        v.union(
          v.literal("modern"),
          v.literal("traditional"),
          v.literal("minimalist"),
          v.literal("bohemian"),
          v.literal("industrial"),
          v.literal("scandinavian"),
          v.literal("other")
        )
      )
    ),
    colorPalette: v.optional(
      v.array(
        v.union(
          v.literal("warm"),
          v.literal("cool"),
          v.literal("neutral"),
          v.literal("bold"),
          v.literal("soft"),
          v.literal("red"),
          v.literal("green"),
          v.literal("blue"),
          v.literal("yellow"),
          v.literal("purple"),
          v.literal("orange"),
          v.literal("brown"),
          v.literal("gray"),
          v.literal("black"),
          v.literal("white")
        )
      )
    ),
    materials: v.optional(
      v.array(
        v.union(
          v.literal("wood"),
          v.literal("metal"),
          v.literal("glass"),
          v.literal("stone"),
          v.literal("ceramic"),
          v.literal("paper"),
          v.literal("plastic"),
          v.literal("leather"),
          v.literal("fabric"),
          v.literal("other")
        )
      )
    ),
    roomType: v.optional(
      v.union(
        v.literal("living-room"),
        v.literal("kitchen"),
        v.literal("bedroom"),
        v.literal("bathroom"),
        v.literal("garden"),
        v.literal("hall"),
        v.literal("desk-area"),
        v.literal("other")
      )
    ),
  },
  handler: async (ctx, args) => {
    const _id = await ctx.db.insert("styleImages", {
      unsplashId: args.unsplashId,
      unsplashUrl: args.unsplashUrl,
      unsplashBlurHash: args.unsplashBlurHash,
      searchKeyword: args.searchKeyword,
      confirmed: args.confirmed,
      style: args.style,
      colorPalette: args.colorPalette,
      materials: args.materials,
      roomType: args.roomType,
    });
    return _id;
  },
});
