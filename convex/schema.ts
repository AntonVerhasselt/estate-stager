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
      v.literal("livingRoom"),
      v.literal("kitchen"),
      v.literal("bedroom"),
      v.literal("bathroom"),
      v.literal("garden"),
      v.literal("hall"),
      v.literal("deskArea"),
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
      v.literal("lightAndAiry"),
      v.literal("darkAndMoody"),
      v.literal("earthTones"),
      v.literal("monochrome"),
      v.literal("boldAndVibrant"),
      v.literal("warmNeutrals")
    ))),
    materialFocus: v.optional(v.array(v.union(
      v.literal("naturalWood"),
      v.literal("metalAndGlass"),
      v.literal("stoneAndConcrete"),
      v.literal("upholstered"),
      v.literal("rattanAndWicker"),
      v.literal("paintedAndLacquered")
    ))),
    spatialPhilosophy: v.optional(v.array(v.union(
      v.literal("openAndFlowing"),
      v.literal("cozyAndDefined"),
      v.literal("minimalAndUncluttered"),
      v.literal("maximalistAndCollected"),
      v.literal("symmetricalAndFormal"),
      v.literal("functionalAndZoned")
    ))),
    roomType: v.optional(v.union(
      v.literal("livingRoom"),
      v.literal("kitchen"),
      v.literal("bedroom"),
      v.literal("bathroom"),
      v.literal("garden"),
      v.literal("hall"),
      v.literal("deskArea"),
      v.literal("other")
    )),
  }).index("by_unsplashId", ["unsplashId"])
    .index("by_unsplashUrl", ["unsplashUrl"])
    .index("by_confirmed", ["confirmed"])
    .index("by_roomType", ["roomType"])
    .index("by_confirmed_deleted", ["confirmed", "deleted"]),

  // Swipes table - immutable log of all swipes
  swipes: defineTable({
    visitId: v.id("visits"),
    styleImageId: v.id("styleImages"),
    direction: v.union(v.literal("like"), v.literal("dislike")),
  })
    .index("by_visitId", ["visitId"])
    .index("by_visitId_styleImageId", ["visitId", "styleImageId"]),
    
  // StyleProfiles table - computed cache of preference profiles
  styleProfiles: defineTable({
    visitId: v.id("visits"),
    // Scores for each tag dimension (e.g., { "style.modern": 8.5, "style.traditional": -2.3 })
    scores: v.object({
      style: v.object({
        modern: v.number(),
        traditional: v.number(),
        scandinavian: v.number(),
        industrial: v.number(),
        bohemian: v.number(),
        coastal: v.number(),
      }),
      colorPalette: v.object({
        lightAndAiry: v.number(),
        darkAndMoody: v.number(),
        earthTones: v.number(),
        monochrome: v.number(),
        boldAndVibrant: v.number(),
        warmNeutrals: v.number(),
      }),
      materialFocus: v.object({
        naturalWood: v.number(),
        metalAndGlass: v.number(),
        stoneAndConcrete: v.number(),
        upholstered: v.number(),
        rattanAndWicker: v.number(),
        paintedAndLacquered: v.number(),
      }),
      spatialPhilosophy: v.object({
        openAndFlowing: v.number(),
        cozyAndDefined: v.number(),
        minimalAndUncluttered: v.number(),
        maximalistAndCollected: v.number(),
        symmetricalAndFormal: v.number(),
        functionalAndZoned: v.number(),
      }),
    }),
    swipeCount: v.number(), // Total swipes (derived from swipes table)
    dimensionConfidence: v.object({
      style: v.number(),
      colorPalette: v.number(),
      materialFocus: v.number(),
      spatialPhilosophy: v.number(),
    }),
    overallConfidence: v.number(), // Average clarity across dimensions (0-1)
    completedAt: v.optional(v.number()), // Timestamp when profile reached completion (null if incomplete)
    lastUpdatedAt: v.number(), // Last time the profile was recalculated
  })
    .index("by_visitId", ["visitId"])
    .index("by_completedAt", ["completedAt"]),
});
