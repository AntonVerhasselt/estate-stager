import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    organizationIds: v.optional(v.array(v.id("organizations"))),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  organizations: defineTable({
    clerkOrganizationId: v.string(), // Links to Clerk organization
    name: v.string(),
    address: v.string(),
    vatNumber: v.string(),
    users: v.array(v.id("users")),
  })
    .index("by_clerkOrganizationId", ["clerkOrganizationId"])
    .index("by_name", ["name"])
    .index("by_vatNumber", ["vatNumber"])
    .index("by_users", ["users"]),

  properties: defineTable({
    address: v.string(),
    status: v.union(v.literal("available"), v.literal("sold")),
    organizationId: v.id("organizations"),
    userId: v.id("users"), // Created by / assigned to
    sourceUrl: v.optional(v.string()),
    images: v.optional(v.array(v.id("images"))),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  images: defineTable({
    propertyId: v.id("properties"),
    storageId: v.id("_storage"),
    visitId: v.optional(v.id("visits")),
    originalImageId: v.optional(v.id("images")),
    roomType: v.union(
      v.literal("living-room"),
      v.literal("kitchen"),
      v.literal("bedroom"),
      v.literal("bathroom"),
      v.literal("garden"),
      v.literal("hall"),
      v.literal("desk-area"),
      v.literal("other")
    ),
  }).index("by_propertyId", ["propertyId"])
    .index("by_storageId", ["storageId"])
    .index("by_originalImageId", ["originalImageId"])
    .index("by_visitId", ["visitId"]),
  
  visits: defineTable({
    propertyId: v.id("properties"),
    startAt: v.number(), // Unix timestamp
    prospectName: v.string(),
    phoneNumber: v.string(), // e.g., "+32471234567"
    status: v.union(
      v.literal("planned"),
      v.literal("prepared"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    prospectLinkId: v.string(),
    createdAt: v.number(),
  })
    .index("by_propertyId", ["propertyId"])
    .index("by_prospectLinkId", ["prospectLinkId"])
    .index("by_status", ["status"])
    .index("by_startAt", ["startAt"]),

  styleImages: defineTable({
    unsplashId: v.string(),
    unsplashUrl: v.string(),
    unsplashBlurHash: v.optional(v.string()),
    searchKeyword: v.string(),
    confirmed: v.boolean(),
    style: v.optional(v.array(v.union(
      v.literal("modern"),
      v.literal("traditional"),
      v.literal("minimalist"),
      v.literal("bohemian"),
      v.literal("industrial"),
      v.literal("scandinavian"),
      v.literal("other")
    ))),
    colorPalette: v.optional(v.array(v.union(
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
      v.literal("white"),
    ))),
    materials: v.optional(v.array(v.union(
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
    ))),
    fourthProperty: v.optional(v.string()),
    roomType: v.optional(v.union(
      v.literal("living-room"),
      v.literal("kitchen"),
      v.literal("bedroom"),
      v.literal("bathroom"),
      v.literal("garden"),
      v.literal("hall"),
      v.literal("desk-area"),
      v.literal("other")
    )),
  }).index("by_unsplashId", ["unsplashId"])
    .index("by_style", ["style"])
    .index("by_colorPalette", ["colorPalette"])
    .index("by_materials", ["materials"])
    .index("by_roomType", ["roomType"]),
});
