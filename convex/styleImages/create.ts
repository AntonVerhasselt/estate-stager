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
          v.literal("lightAndAiry"),
          v.literal("darkAndMoody"),
          v.literal("earthTones"),
          v.literal("monochrome"),
          v.literal("boldAndVibrant"),
          v.literal("warmNeutrals")
        )
      )
    ),
    materialFocus: v.optional(
      v.array(
        v.union(
          v.literal("naturalWood"),
          v.literal("metalAndGlass"),
          v.literal("stoneAndConcrete"),
          v.literal("upholstered"),
          v.literal("rattanAndWicker"),
          v.literal("paintedAndLacquered")
        )
      )
    ),
    spatialPhilosophy: v.optional(
      v.array(
        v.union(
          v.literal("openAndFlowing"),
          v.literal("cozyAndDefined"),
          v.literal("minimalAndUncluttered"),
          v.literal("maximalistAndCollected"),
          v.literal("symmetricalAndFormal"),
          v.literal("functionalAndZoned")
        )
      )
    ),
    roomType: v.optional(
      v.union(
        v.literal("livingRoom"),
        v.literal("kitchen"),
        v.literal("bedroom"),
        v.literal("bathroom"),
        v.literal("garden"),
        v.literal("hall"),
        v.literal("deskArea"),
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
