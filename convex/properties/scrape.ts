"use node";

import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { v } from "convex/values";

// Type for expected response structure from Firecrawl v2 API
interface FirecrawlResponse {
  success: boolean;
  data?: {
    json?: {
      address?: string;
    };
    images?: string[];
    metadata?: {
      title?: string;
      description?: string;
      sourceURL?: string;
    };
  };
  error?: string;
}

export const scrapePropertyUrl = action({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error("FIRECRAWL_API_KEY environment variable is not set");
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: args.url,
          formats: [
            {type: 'images'}, 
            {
              type: 'json',
              schema: {
                type: 'object',
                properties: {
                  address: {
                    type: 'string',
                  },
                },
                required: ['address'],
              },
            },
          ],
          onlyMainContent: true,
          maxAge: 172800000,
          mobile: false,
          skipTlsVerification: true,
          parsers: ['pdf'],
          actions: [{type: 'wait', milliseconds: 100}],
          removeBase64Images: false,
          blockAds: true,
          proxy: 'auto',
          storeInCache: true,
          zeroDataRetention: false
        })
      };

      const response = await fetch('https://api.firecrawl.dev/v2/scrape', options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Firecrawl API error:", response.status, errorText);
        return {
          address: null,
          imageUrls: [],
        };
      }

      const result: FirecrawlResponse = await response.json();

      if (!result.success || !result.data) {
        console.error("Firecrawl scrape failed:", result);
        return {
          address: null,
          imageUrls: [],
        };
      }

      // Extract address from JSON result
      const address = result.data.json?.address ?? null;

      // Extract image URLs from images array
      const imageUrls: string[] = result.data.images ?? [];

      const users: object[] = await ctx.runQuery(internal.users.list.listOrganizationUsers);

      return {
        address,
        imageUrls,
        users
      };
    } catch (error) {
      console.error("Error scraping URL:", error);
      return {
        address: null,
        imageUrls: [],
        users: [],
      };
    }
  },
});
