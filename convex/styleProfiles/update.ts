import { internalAction, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import {
  type DimensionConfidence,
  calculateScores,
  calculateDimensionConfidence,
  calculateOverallConfidence,
} from "./helperFunctions";

// ============================================================================
// CONSTANTS
// ============================================================================
const COMPLETION_CONFIDENCE_THRESHOLD = 0.8; // 80% confidence
const MAX_SWIPES_FOR_COMPLETION = 50; // Hard stop at 50 swipes
const MAX_SWIPES_TO_CONSIDER = 100; // Only consider last 100 swipes

// ============================================================================
// INTERNAL MUTATION - Save profile to database
// ============================================================================
export const saveProfile = internalMutation({
  args: {
    visitId: v.id("visits"),
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
    swipeCount: v.number(),
    dimensionConfidence: v.object({
      style: v.number(),
      colorPalette: v.number(),
      materialFocus: v.number(),
      spatialPhilosophy: v.number(),
    }),
    overallConfidence: v.number(),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("styleProfiles")
      .withIndex("by_visitId", (q) => q.eq("visitId", args.visitId))
      .first();

    const profileData = {
      visitId: args.visitId,
      scores: args.scores,
      swipeCount: args.swipeCount,
      dimensionConfidence: args.dimensionConfidence,
      overallConfidence: args.overallConfidence,
      completedAt: args.completedAt,
      lastUpdatedAt: Date.now(),
    };

    if (existingProfile) {
      // Update existing profile (but don't overwrite completedAt if already set)
      await ctx.db.patch(existingProfile._id, {
        ...profileData,
        completedAt: existingProfile.completedAt ?? args.completedAt,
      });
      return existingProfile._id;
    } else {
      // Create new profile
      return await ctx.db.insert("styleProfiles", profileData);
    }
  },
});

// ============================================================================
// INTERNAL ACTION - Background profile update
// ============================================================================
export const updateProfileAsync = internalAction({
  args: {
    visitId: v.id("visits"),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the last 100 swipes with their associated style images
    const swipesWithImages = await ctx.runQuery(internal.swipes.list.listSwipesWithImages, {
      visitId: args.visitId,
      limit: MAX_SWIPES_TO_CONSIDER,
    });

    const swipeCount = swipesWithImages.length;
    if (swipeCount === 0) {
      // No swipes yet, nothing to calculate
      return;
    }

    // 2. Calculate scores from scratch
    const swipeData = swipesWithImages.map((item) => ({
      direction: item.swipe.direction,
      styleImage: item.styleImage,
    }));
    const scores = calculateScores(swipeData);

    // 3. Calculate confidence for each dimension
    const dimensionConfidence: DimensionConfidence = {
      style: calculateDimensionConfidence(scores.style, swipeCount),
      colorPalette: calculateDimensionConfidence(scores.colorPalette, swipeCount),
      materialFocus: calculateDimensionConfidence(scores.materialFocus, swipeCount),
      spatialPhilosophy: calculateDimensionConfidence(scores.spatialPhilosophy, swipeCount),
    };

    // 4. Calculate overall confidence
    const overallConfidence = calculateOverallConfidence(dimensionConfidence);

    // 5. Check if profile is complete
    const isComplete =
      overallConfidence >= COMPLETION_CONFIDENCE_THRESHOLD ||
      swipeCount >= MAX_SWIPES_FOR_COMPLETION;

    // 6. Save the profile
    await ctx.runMutation(internal.styleProfiles.update.saveProfile, {
      visitId: args.visitId,
      scores,
      swipeCount,
      dimensionConfidence,
      overallConfidence,
      completedAt: isComplete ? Date.now() : undefined,
    });
  },
});
