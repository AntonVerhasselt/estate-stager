import { internalAction } from "../_generated/server";
import { v } from "convex/values";

export const filterImages = internalAction({
  args: {
    imageUrls: v.array(v.string()),
  },
  handler: async ({}, args) => {
    // Placeholder: just return the first 2 urls
    return {
      filteredImageUrls: args.imageUrls.slice(0, 2),
    };
  },
});
