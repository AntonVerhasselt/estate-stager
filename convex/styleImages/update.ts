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

