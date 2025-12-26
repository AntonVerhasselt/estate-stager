"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { GoogleGenAI, Type } from "@google/genai";

// Style options matching the schema
const STYLE_OPTIONS = [
  "modern",
  "traditional",
  "scandinavian",
  "industrial",
  "bohemian",
  "coastal",
] as const;

// Color palette options matching the schema
const COLOR_PALETTE_OPTIONS = [
  "light-and-airy",
  "dark-and-moody",
  "earth-tones",
  "monochrome",
  "bold-and-vibrant",
  "warm-neutrals",
] as const;

// Material focus options matching the schema
const MATERIAL_FOCUS_OPTIONS = [
  "natural-wood",
  "metal-and-glass",
  "stone-and-concrete",
  "upholstered",
  "rattan-and-wicker",
  "painted-and-lacquered",
] as const;

// Spatial philosophy options matching the schema
const SPATIAL_PHILOSOPHY_OPTIONS = [
  "open-and-flowing",
  "cozy-and-defined",
  "minimal-and-uncluttered",
  "maximalist-and-collected",
  "symmetrical-and-formal",
  "functional-and-zoned",
] as const;

// Room type options matching the schema
const ROOM_TYPE_OPTIONS = [
  "living-room",
  "kitchen",
  "bedroom",
  "bathroom",
  "garden",
  "hall",
  "desk-area",
  "other",
] as const;

// System prompt for interior design analysis
const SYSTEM_PROMPT = `You are an expert interior designer and real estate staging consultant with deep knowledge of design styles, color theory, and materials.

Your task is to analyze interior design images and extract key visual characteristics that would help match properties with potential buyers' preferences.

When analyzing an image, carefully examine:

1. **Style** - Identify the dominant interior design style(s):
   - **modern**: Clean lines, minimal ornamentation, functional
   - **traditional**: Classic furniture, rich woods, symmetrical layouts
   - **scandinavian**: Light woods, hygge comfort, functional simplicity
   - **industrial**: Exposed brick, metal frames, raw materials
   - **bohemian**: Layered textiles, global patterns, eclectic mix
   - **coastal**: Light blues, whitewashed wood, beachy textures

2. **Color Palette** - Identify the dominant color mood:
   - **light-and-airy**: Whites, creams, soft pastels, bright
   - **dark-and-moody**: Charcoal, navy, deep tones, dramatic
   - **earth-tones**: Terracotta, ochre, sage, warm naturals
   - **monochrome**: Black, white, grayscale, tonal only
   - **bold-and-vibrant**: Jewel tones, saturated pops, energetic
   - **warm-neutrals**: Beige, camel, warm gray, taupe

3. **Material Focus** - Identify the primary materials visible:
   - **natural-wood**: Oak, walnut, pine, exposed beams
   - **metal-and-glass**: Steel, chrome, glass, mirrors
   - **stone-and-concrete**: Marble, granite, raw concrete
   - **upholstered**: Velvet, linen, leather, soft fabrics
   - **rattan-and-wicker**: Cane, seagrass, woven textures
   - **painted-and-lacquered**: High-gloss, colored, lacquered surfaces

4. **Spatial Philosophy** - Identify the spatial arrangement approach:
   - **open-and-flowing**: Open concept, seamless transitions
   - **cozy-and-defined**: Separate rooms, intimate nooks
   - **minimal-and-uncluttered**: Negative space, essential only
   - **maximalist-and-collected**: Full walls, layered decor
   - **symmetrical-and-formal**: Balanced layouts, paired furniture
   - **functional-and-zoned**: Clear purpose, practical flow

5. **Room Type** - Identify the type of room shown based on furniture, fixtures, layout, and architectural features.

Be selective and precise - only include the TOP 2 most prominent values for style, color palette, material focus, and spatial philosophy. Focus on what dominates the space, not subtle accents.`;

// Response schema for structured output
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    style: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: [...STYLE_OPTIONS],
      },
      maxItems: "2",
      description:
        "The top 1-2 dominant interior design styles present in the image.",
    },
    colorPalette: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: [...COLOR_PALETTE_OPTIONS],
      },
      maxItems: "2",
      description:
        "The top 1-2 most dominant color palette characteristics of the space.",
    },
    materialFocus: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: [...MATERIAL_FOCUS_OPTIONS],
      },
      maxItems: "2",
      description:
        "The top 1-2 most prominent material types visible in the space.",
    },
    spatialPhilosophy: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: [...SPATIAL_PHILOSOPHY_OPTIONS],
      },
      maxItems: "2",
      description:
        "The top 1-2 most prominent spatial arrangement approaches in the space.",
    },
    roomType: {
      type: Type.STRING,
      enum: [...ROOM_TYPE_OPTIONS],
      description: "The type of room shown in the image.",
    },
  },
  required: ["style", "colorPalette", "materialFocus", "spatialPhilosophy", "roomType"],
};

// Type for the analysis result
export interface StyleAnalysisResult {
  style: (typeof STYLE_OPTIONS)[number][];
  colorPalette: (typeof COLOR_PALETTE_OPTIONS)[number][];
  materialFocus: (typeof MATERIAL_FOCUS_OPTIONS)[number][];
  spatialPhilosophy: (typeof SPATIAL_PHILOSOPHY_OPTIONS)[number][];
  roomType: (typeof ROOM_TYPE_OPTIONS)[number];
}

export const analyzeStyleImage = internalAction({
  args: {
    unsplashUrl: v.string(),
  },
  handler: async (ctx, args): Promise<StyleAnalysisResult> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    // Initialize the Gemini client
    const ai = new GoogleGenAI({ apiKey });

    // Fetch the image from the Unsplash URL and convert to base64
    const imageResponse = await fetch(args.unsplashUrl);
    if (!imageResponse.ok) {
      throw new Error(
        `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`
      );
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

    // Determine MIME type from response headers or default to jpeg
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    // Make the API request with structured output
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: contentType,
                data: base64ImageData,
              },
            },
            {
              text: "Analyze this interior design image and identify the style, color palette, material focus, spatial philosophy, and room type. For style, color palette, material focus, and spatial philosophy, select only the TOP 1-2 most dominant values - no more than 2 per category. For room type, select the single most appropriate category.",
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: analysisResponseSchema,
      },
    });

    // Parse the structured response
    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response text received from Gemini API");
    }

    const analysisResult: StyleAnalysisResult = JSON.parse(responseText);

    // Validate the response matches our expected types
    if (
      !Array.isArray(analysisResult.style) ||
      !Array.isArray(analysisResult.colorPalette) ||
      !Array.isArray(analysisResult.materialFocus) ||
      !Array.isArray(analysisResult.spatialPhilosophy) ||
      !analysisResult.roomType
    ) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return analysisResult;
  },
});
