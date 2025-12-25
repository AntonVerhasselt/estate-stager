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
    deleted: v.optional(v.boolean()),
    style: v.optional(v.array(v.union(
      v.literal("modern"),
      v.literal("traditional"),
      v.literal("scandinavian"),
      v.literal("industrial"),
      v.literal("bohemian"),
      v.literal("coastal")
    ))),
    colorPalette: v.optional(v.array(v.union(
      v.literal("light-and-airy"),
      v.literal("dark-and-moody"),
      v.literal("earth-tones"),
      v.literal("monochrome"),
      v.literal("bold-and-vibrant"),
      v.literal("warm-neutrals")
    ))),
    materialFocus: v.optional(v.array(v.union(
      v.literal("natural-wood"),
      v.literal("metal-and-glass"),
      v.literal("stone-and-concrete"),
      v.literal("upholstered"),
      v.literal("rattan-and-wicker"),
      v.literal("painted-and-lacquered")
    ))),
    spatialPhilosophy: v.optional(v.array(v.union(
      v.literal("open-and-flowing"),
      v.literal("cozy-and-defined"),
      v.literal("minimal-and-uncluttered"),
      v.literal("maximalist-and-collected"),
      v.literal("symmetrical-and-formal"),
      v.literal("functional-and-zoned")
    ))),
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
    .index("by_unsplashUrl", ["unsplashUrl"])
    .index("by_confirmed", ["confirmed"])
    .index("by_roomType", ["roomType"])
    .index("by_confirmed_deleted", ["confirmed", "deleted"]),
});
