"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { GoogleGenAI, Type } from "@google/genai";

// Style options matching the schema
const STYLE_OPTIONS = [
  "modern",
  "traditional",
  "minimalist",
  "bohemian",
  "industrial",
  "scandinavian",
  "other",
] as const;

// Color palette options matching the schema
const COLOR_PALETTE_OPTIONS = [
  "warm",
  "cool",
  "neutral",
  "bold",
  "soft",
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "brown",
  "gray",
  "black",
  "white",
] as const;

// Materials options matching the schema
const MATERIALS_OPTIONS = [
  "wood",
  "metal",
  "glass",
  "stone",
  "ceramic",
  "paper",
  "plastic",
  "leather",
  "fabric",
  "other",
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

1. **Style**: Identify the dominant interior design style(s) present. Look at furniture shapes, architectural elements, decorative patterns, and overall aesthetic. A space can reflect multiple styles (e.g., a modern room with industrial accents).

2. **Color Palette**: Identify both the mood/temperature of colors (warm, cool, neutral, bold, soft) AND the specific dominant colors visible. Focus on walls, large furniture pieces, textiles, and accent colors.

3. **Materials**: Identify the primary materials visible in furniture, flooring, fixtures, and decorative elements. Look at textures and finishes carefully.

4. **Room Type**: Identify the type of room shown in the image based on the furniture, fixtures, layout, and architectural features present.

Be selective and precise - only include the TOP 2 most prominent values for each category. Focus on what dominates the space, not subtle accents.`;

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
        "The top 1-2 most dominant color characteristics of the space.",
    },
    materials: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: [...MATERIALS_OPTIONS],
      },
      maxItems: "2",
      description:
        "The top 1-2 most prominent materials visible in the space.",
    },
    roomType: {
      type: Type.STRING,
      enum: [...ROOM_TYPE_OPTIONS],
      description: "The type of room shown in the image.",
    },
  },
  required: ["style", "colorPalette", "materials", "roomType"],
};

// Type for the analysis result
export interface StyleAnalysisResult {
  style: (typeof STYLE_OPTIONS)[number][];
  colorPalette: (typeof COLOR_PALETTE_OPTIONS)[number][];
  materials: (typeof MATERIALS_OPTIONS)[number][];
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
              text: "Analyze this interior design image and identify the style, color palette, materials, and room type. For style, color palette, and materials, select only the TOP 1-2 most dominant values - no more than 2 per category. For room type, select the single most appropriate category.",
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
      !Array.isArray(analysisResult.materials) ||
      !analysisResult.roomType
    ) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return analysisResult;
  },
});
