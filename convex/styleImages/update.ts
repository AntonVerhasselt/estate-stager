import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Confirm a style image and update its properties
export const confirmStyleImage = mutation({
  args: {
    id: v.id("styleImages"),
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
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      confirmed: true,
      ...updates,
    });
  },
});

// Soft delete a style image
export const softDeleteStyleImage = mutation({
  args: {
    id: v.id("styleImages"),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      deleted: true,
    });
  },
});

