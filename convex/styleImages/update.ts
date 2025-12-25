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
    await ctx.db.patch(args.id, {
      deleted: true,
    });
  },
});

