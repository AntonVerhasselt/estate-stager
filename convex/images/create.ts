import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

// Room type validator matching the schema
const roomTypeValidator = v.union(
  v.literal("living-room"),
  v.literal("kitchen"),
  v.literal("bedroom"),
  v.literal("bathroom"),
  v.literal("garden"),
  v.literal("hall"),
  v.literal("desk-area"),
  v.literal("other")
);

// Internal mutation to create image record
export const createImageRecord = internalMutation({
  args: {
    propertyId: v.id("properties"),
    storageId: v.id("_storage"),
    roomType: roomTypeValidator,
  },
  handler: async (ctx, args) => {
    const _id = await ctx.db.insert("images", {
      propertyId: args.propertyId,
      storageId: args.storageId,
      roomType: args.roomType,
    });
    return _id;
  },
});
