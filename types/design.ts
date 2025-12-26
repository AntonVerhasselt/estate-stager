// ============================================================================
// DESIGN-RELATED TYPE DEFINITIONS
// ============================================================================
// Centralized types for style, color palette, material focus, spatial philosophy, and room types
// All values use camelCase for consistency across the codebase

// Style types (already camelCase - no change needed)
export type Style = "modern" | "traditional" | "scandinavian" | "industrial" | "bohemian" | "coastal";

// Color palette - camelCase
export type ColorPalette = "lightAndAiry" | "darkAndMoody" | "earthTones" | "monochrome" | "boldAndVibrant" | "warmNeutrals";

// Material focus - camelCase
export type MaterialFocus = "naturalWood" | "metalAndGlass" | "stoneAndConcrete" | "upholstered" | "rattanAndWicker" | "paintedAndLacquered";

// Spatial philosophy - camelCase
export type SpatialPhilosophy = "openAndFlowing" | "cozyAndDefined" | "minimalAndUncluttered" | "maximalistAndCollected" | "symmetricalAndFormal" | "functionalAndZoned";

// Room type - camelCase
export type RoomType = "livingRoom" | "kitchen" | "bedroom" | "bathroom" | "garden" | "hall" | "deskArea" | "other";

// ============================================================================
// CONSTANTS FOR UI DISPLAY
// ============================================================================

export const STYLE_OPTIONS: { value: Style; label: string }[] = [
  { value: "modern", label: "Modern" },
  { value: "traditional", label: "Traditional" },
  { value: "scandinavian", label: "Scandinavian" },
  { value: "industrial", label: "Industrial" },
  { value: "bohemian", label: "Bohemian" },
  { value: "coastal", label: "Coastal" },
];

export const COLOR_PALETTE_OPTIONS: { value: ColorPalette; label: string }[] = [
  { value: "lightAndAiry", label: "Light And Airy" },
  { value: "darkAndMoody", label: "Dark And Moody" },
  { value: "earthTones", label: "Earth Tones" },
  { value: "monochrome", label: "Monochrome" },
  { value: "boldAndVibrant", label: "Bold And Vibrant" },
  { value: "warmNeutrals", label: "Warm Neutrals" },
];

export const MATERIAL_FOCUS_OPTIONS: { value: MaterialFocus; label: string }[] = [
  { value: "naturalWood", label: "Natural Wood" },
  { value: "metalAndGlass", label: "Metal And Glass" },
  { value: "stoneAndConcrete", label: "Stone And Concrete" },
  { value: "upholstered", label: "Upholstered" },
  { value: "rattanAndWicker", label: "Rattan And Wicker" },
  { value: "paintedAndLacquered", label: "Painted And Lacquered" },
];

export const SPATIAL_PHILOSOPHY_OPTIONS: { value: SpatialPhilosophy; label: string }[] = [
  { value: "openAndFlowing", label: "Open And Flowing" },
  { value: "cozyAndDefined", label: "Cozy And Defined" },
  { value: "minimalAndUncluttered", label: "Minimal And Uncluttered" },
  { value: "maximalistAndCollected", label: "Maximalist And Collected" },
  { value: "symmetricalAndFormal", label: "Symmetrical And Formal" },
  { value: "functionalAndZoned", label: "Functional And Zoned" },
];

export const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = [
  { value: "livingRoom", label: "Living Room" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bedroom", label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
  { value: "garden", label: "Garden" },
  { value: "hall", label: "Hall" },
  { value: "deskArea", label: "Desk Area" },
  { value: "other", label: "Other" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format a camelCase value to a display label
 * e.g., "lightAndAiry" -> "Light And Airy"
 */
export function formatLabel(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
}

