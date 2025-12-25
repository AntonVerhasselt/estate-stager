"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

// Unsplash API response types
interface UnsplashPhoto {
  id: string;
  blur_hash: string | null;
  urls: {
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  }
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

// Pages to fetch per keyword
const PAGES_PER_KEYWORD = 3;
const PER_PAGE = 30; // Max allowed by Unsplash

export const fetchUnsplashImages = action({
  args: {
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error("UNSPLASH_ACCESS_KEY environment variable is not set");
    }

    const stats = {
      totalFetched: 0,
      totalSkipped: 0,
      totalErrors: 0,
      keywordsProcessed: 0,
      rateLimitRemaining: 0,
    };

    // Process each keyword
    for (const keyword of args.keywords) {
      try {
        console.log(`Processing keyword: "${keyword}"`);

        // Fetch 3 pages for this keyword
        for (let page = 1; page <= PAGES_PER_KEYWORD; page++) {
          try {
            // Construct search URL
            const searchUrl = new URL("https://api.unsplash.com/search/photos");
            searchUrl.searchParams.set("query", keyword);
            searchUrl.searchParams.set("page", page.toString());
            searchUrl.searchParams.set("per_page", PER_PAGE.toString());
            searchUrl.searchParams.set("orientation", "landscape"); // Better for interior design

            // Fetch from Unsplash API
            const response = await fetch(searchUrl.toString(), {
              headers: {
                Authorization: `Client-ID ${accessKey}`,
                "Accept-Version": "v1",
              },
            });

            // Check rate limit headers
            const rateLimitRemaining = response.headers.get("X-Ratelimit-Remaining");
            if (rateLimitRemaining) {
              stats.rateLimitRemaining = parseInt(rateLimitRemaining, 10);
              if (stats.rateLimitRemaining <= 5) {
                console.warn(`Rate limit low: ${stats.rateLimitRemaining} remaining`);
              }
            }

            if (!response.ok) {
              if (response.status === 403) {
                throw new Error("Rate limit exceeded or unauthorized");
              }
              const errorText = await response.text();
              throw new Error(`Unsplash API error: ${response.status} - ${errorText}`);
            }

            const data: UnsplashSearchResponse = await response.json();

            // 1. Get all unsplash IDs from this page
            const allIds = data.results.map((p) => p.id);

            // 2. Batch check which already exist
            const existingIds = await ctx.runQuery(
              internal.styleImages.get.getExistingUnsplashIds,
              { unsplashIds: allIds }
            );
            const existingSet = new Set(existingIds);

            // 3. Filter to new photos only
            const newPhotos = data.results.filter((p) => !existingSet.has(p.id));
            stats.totalSkipped += existingIds.length;

            if (newPhotos.length === 0) {
              console.log(`Page ${page}: All ${data.results.length} photos already exist, skipping`);
              continue;
            }

            console.log(
              `Page ${page}: Processing ${newPhotos.length} new photos (${existingIds.length} already exist)`
            );

            // 4. Analyze all new photos in parallel
            const analysisPromises = newPhotos.map(async (photo) => {
              const optimizedUrl = `${photo.urls.raw}&w=1080&q=80&fit=max`;
              try {
                const result = await ctx.runAction(
                  internal.styleImages.analyze.analyzeStyleImage,
                  { unsplashUrl: optimizedUrl }
                );
                console.log(
                  `Analyzed photo ${photo.id}: styles=${result.style.join(", ")}, colors=${result.colorPalette.join(", ")}, materials=${result.materials.join(", ")}, roomType=${result.roomType}`
                );
                return { photo, optimizedUrl, analysisResult: result };
              } catch (error) {
                console.error(`Error analyzing photo ${photo.id}:`, error);
                stats.totalErrors++;
                return { photo, optimizedUrl, analysisResult: undefined };
              }
            });

            const analyzed = await Promise.all(analysisPromises);

            // 5. Store all results in parallel (including roomType)
            await Promise.all(
              analyzed.map(({ photo, optimizedUrl, analysisResult }) =>
                ctx.runMutation(internal.styleImages.create.createStyleImage, {
                  unsplashId: photo.id,
                  unsplashUrl: optimizedUrl,
                  unsplashBlurHash: photo.blur_hash || undefined,
                  searchKeyword: keyword,
                  confirmed: false, // Will be confirmed after manual review
                  style: analysisResult?.style,
                  colorPalette: analysisResult?.colorPalette,
                  materials: analysisResult?.materials,
                  roomType: analysisResult?.roomType,
                })
              )
            );

            stats.totalFetched += analyzed.length;

            // Small delay between pages to be respectful
            if (page < PAGES_PER_KEYWORD) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.error(`Error fetching page ${page} for "${keyword}":`, error);
            stats.totalErrors++;
            // Continue with next page even if one fails
          }
        }

        stats.keywordsProcessed++;

        // Delay between keywords to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error processing keyword "${keyword}":`, error);
        stats.totalErrors++;
        // Continue with next keyword even if one fails
      }
    }

    return {
      success: true,
      stats: {
        ...stats,
        totalProcessed: stats.totalFetched + stats.totalSkipped,
      },
    };
  },
});
