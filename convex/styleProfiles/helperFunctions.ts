import type { Doc } from "../_generated/dataModel";

// ============================================================================
// TYPES
// ============================================================================
export type StyleScoreKey = "modern" | "traditional" | "scandinavian" | "industrial" | "bohemian" | "coastal";
export type ColorScoreKey = "lightAndAiry" | "darkAndMoody" | "earthTones" | "monochrome" | "boldAndVibrant" | "warmNeutrals";
export type MaterialScoreKey = "naturalWood" | "metalAndGlass" | "stoneAndConcrete" | "upholstered" | "rattanAndWicker" | "paintedAndLacquered";
export type SpatialScoreKey = "openAndFlowing" | "cozyAndDefined" | "minimalAndUncluttered" | "maximalistAndCollected" | "symmetricalAndFormal" | "functionalAndZoned";

export type Scores = {
  style: Record<StyleScoreKey, number>;
  colorPalette: Record<ColorScoreKey, number>;
  materialFocus: Record<MaterialScoreKey, number>;
  spatialPhilosophy: Record<SpatialScoreKey, number>;
};

export type DimensionConfidence = {
  style: number;
  colorPalette: number;
  materialFocus: number;
  spatialPhilosophy: number;
};

// ============================================================================
// CONSTANTS
// ============================================================================
// Default scores (all zeros)
export const DEFAULT_SCORES: Scores = {
  style: {
    modern: 0,
    traditional: 0,
    scandinavian: 0,
    industrial: 0,
    bohemian: 0,
    coastal: 0,
  },
  colorPalette: {
    lightAndAiry: 0,
    darkAndMoody: 0,
    earthTones: 0,
    monochrome: 0,
    boldAndVibrant: 0,
    warmNeutrals: 0,
  },
  materialFocus: {
    naturalWood: 0,
    metalAndGlass: 0,
    stoneAndConcrete: 0,
    upholstered: 0,
    rattanAndWicker: 0,
    paintedAndLacquered: 0,
  },
  spatialPhilosophy: {
    openAndFlowing: 0,
    cozyAndDefined: 0,
    minimalAndUncluttered: 0,
    maximalistAndCollected: 0,
    symmetricalAndFormal: 0,
    functionalAndZoned: 0,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate dimension confidence based on score spread
 * High confidence = clear preferences (large gap between max and min)
 * Low confidence = mixed signals (all scores near zero)
 */
export function calculateDimensionConfidence(scores: Record<string, number>, swipeCount: number): number {
    const values = Object.values(scores);
    if (values.length === 0 || swipeCount === 0) return 0;
  
    const maxScore = Math.max(...values);
    const minScore = Math.min(...values);
    const range = maxScore - minScore;
  
    // Normalize by swipe count - a range of 10 after 50 swipes is very clear
    // A range of 10 after 5 swipes could be noise
    const normalizedRange = range / Math.sqrt(swipeCount);
  
    // Map to 0-1 scale (empirically, a normalized range of 2 is very confident)
    const confidence = Math.min(normalizedRange / 2, 1);
  
    return confidence;
  }
  
  /**
   * Calculate overall confidence from dimension confidences
   * Uses the average of the top 3 dimensions (ignoring the weakest)
   */
  export function calculateOverallConfidence(dimensionConfidence: DimensionConfidence): number {
    const values = Object.values(dimensionConfidence);
    if (values.length === 0) return 0;
  
    // Sort descending and take top 3
    const sorted = [...values].sort((a, b) => b - a);
    const top3 = sorted.slice(0, 3);
  
    // Average the top 3
    return top3.reduce((sum, v) => sum + v, 0) / top3.length;
  }
  
  /**
   * Recalculate all scores from scratch based on swipe history
   * Uses the "point splitting" system - if an image has multiple tags,
   * each tag gets a fraction of the point
   */
  export function calculateScores(
    swipes: Array<{ direction: "like" | "dislike"; styleImage: Doc<"styleImages"> }>
  ): Scores {
    // Clone default scores
    const scores: Scores = JSON.parse(JSON.stringify(DEFAULT_SCORES));
  
    for (const swipe of swipes) {
      const { direction, styleImage } = swipe;
      const pointValue = direction === "like" ? 1 : -1;
  
      // Process style tags (all tags are now camelCase)
      if (styleImage.style && styleImage.style.length > 0) {
        const pointPerTag = pointValue / styleImage.style.length;
        for (const tag of styleImage.style) {
          if (tag in scores.style) {
            scores.style[tag as StyleScoreKey] += pointPerTag;
          }
        }
      }
  
      // Process color palette tags (all tags are now camelCase)
      if (styleImage.colorPalette && styleImage.colorPalette.length > 0) {
        const pointPerTag = pointValue / styleImage.colorPalette.length;
        for (const tag of styleImage.colorPalette) {
          if (tag in scores.colorPalette) {
            scores.colorPalette[tag as ColorScoreKey] += pointPerTag;
          }
        }
      }
  
      // Process material focus tags (all tags are now camelCase)
      if (styleImage.materialFocus && styleImage.materialFocus.length > 0) {
        const pointPerTag = pointValue / styleImage.materialFocus.length;
        for (const tag of styleImage.materialFocus) {
          if (tag in scores.materialFocus) {
            scores.materialFocus[tag as MaterialScoreKey] += pointPerTag;
          }
        }
      }
  
      // Process spatial philosophy tags (all tags are now camelCase)
      if (styleImage.spatialPhilosophy && styleImage.spatialPhilosophy.length > 0) {
        const pointPerTag = pointValue / styleImage.spatialPhilosophy.length;
        for (const tag of styleImage.spatialPhilosophy) {
          if (tag in scores.spatialPhilosophy) {
            scores.spatialPhilosophy[tag as SpatialScoreKey] += pointPerTag;
          }
        }
      }
    }
  
    return scores;
  }