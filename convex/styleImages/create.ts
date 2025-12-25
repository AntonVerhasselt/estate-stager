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
          v.literal("scandinavian"),
          v.literal("industrial"),
          v.literal("bohemian"),
          v.literal("coastal")
        )
      )
    ),
    colorPalette: v.optional(
      v.array(
        v.union(
          v.literal("light-and-airy"),
          v.literal("dark-and-moody"),
          v.literal("earth-tones"),
          v.literal("monochrome"),
          v.literal("bold-and-vibrant"),
          v.literal("warm-neutrals")
        )
      )
    ),
    materialFocus: v.optional(
      v.array(
        v.union(
          v.literal("natural-wood"),
          v.literal("metal-and-glass"),
          v.literal("stone-and-concrete"),
          v.literal("upholstered"),
          v.literal("rattan-and-wicker"),
          v.literal("painted-and-lacquered")
        )
      )
    ),
    spatialPhilosophy: v.optional(
      v.array(
        v.union(
          v.literal("open-and-flowing"),
          v.literal("cozy-and-defined"),
          v.literal("minimal-and-uncluttered"),
          v.literal("maximalist-and-collected"),
          v.literal("symmetrical-and-formal"),
          v.literal("functional-and-zoned")
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
      materialFocus: args.materialFocus,
      spatialPhilosophy: args.spatialPhilosophy,
      roomType: args.roomType,
    });
    return _id;
  },
});
