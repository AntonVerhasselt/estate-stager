"use node";

import { action, internalAction, ActionCtx } from "../_generated/server";
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
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

// Rate limit handling
interface RateLimitInfo {
  remaining: number;
  limit: number;
  isExhausted: boolean;
}

// Custom error for rate limiting
class RateLimitError extends Error {
  remainingKeywords: string[];
  startPage: number;
  constructor(
    message: string,
    remainingKeywords: string[],
    startPage: number
  ) {
    super(message);
    this.name = "RateLimitError";
    this.remainingKeywords = remainingKeywords;
    this.startPage = startPage;
  }
}

// Pages to fetch per keyword
const PAGES_PER_KEYWORD = 3;
const PER_PAGE = 30; // Max allowed by Unsplash
// Demo mode: 50 requests/hour. After approval: 5000 requests/hour
// We schedule retry after 1 hour for demo mode
const RATE_LIMIT_RETRY_DELAY_MS = 60 * 60 * 1000; // 1 hour in milliseconds
// Minimum rate limit before we proactively stop to avoid wasting requests
const RATE_LIMIT_BUFFER = 2;

/**
 * Helper to check rate limit from Unsplash response headers
 */
function parseRateLimitHeaders(response: Response): RateLimitInfo {
  const remaining = parseInt(
    response.headers.get("X-Ratelimit-Remaining") || "50",
    10
  );
  const limit = parseInt(
    response.headers.get("X-Ratelimit-Limit") || "50",
    10
  );
  return {
    remaining,
    limit,
    isExhausted: remaining <= RATE_LIMIT_BUFFER,
  };
}

/**
 * Internal action that can be scheduled - doesn't require authentication
 * Used for automatic retries after rate limit
 */
export const fetchUnsplashImagesInternal = internalAction({
  args: {
    keywords: v.array(v.string()),
    startPage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error("UNSPLASH_ACCESS_KEY environment variable is not set");
    }

    return await processFetch(ctx, accessKey, args.keywords, args.startPage);
  },
});

/**
 * Public action - requires authentication
 */
export const fetchUnsplashImages = action({
  args: {
    keywords: v.array(v.string()),
    startPage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error("UNSPLASH_ACCESS_KEY environment variable is not set");
    }

    return await processFetch(ctx, accessKey, args.keywords, args.startPage);
  },
});

/**
 * Core fetch logic shared between public and internal actions
 */
async function processFetch(
  ctx: ActionCtx,
  accessKey: string,
  keywords: string[],
  startPage?: number
) {
  const stats = {
    totalFetched: 0,
    totalSkipped: 0,
    totalErrors: 0,
    keywordsProcessed: 0,
    rateLimitRemaining: 50,
    rateLimitHit: false,
    scheduledRetryAt: null as number | null,
    remainingKeywords: [] as string[],
  };

  let currentRateLimit: RateLimitInfo = {
    remaining: 50,
    limit: 50,
    isExhausted: false,
  };

  try {
    // Process each keyword
    for (let keywordIndex = 0; keywordIndex < keywords.length; keywordIndex++) {
      const keyword = keywords[keywordIndex];

      // Check if we should stop due to rate limiting
      if (currentRateLimit.isExhausted) {
        throw new RateLimitError(
          "Rate limit exhausted, scheduling retry",
          keywords.slice(keywordIndex),
          1
        );
      }

      try {
        console.log(`Processing keyword: "${keyword}"`);

        // Determine starting page (for resuming after rate limit)
        const initialPage =
          keywordIndex === 0 && startPage ? startPage : 1;

        // Fetch pages for this keyword
        for (let page = initialPage; page <= PAGES_PER_KEYWORD; page++) {
          // Pre-check rate limit before making request
          if (currentRateLimit.isExhausted) {
            throw new RateLimitError(
              "Rate limit exhausted before page request",
              keywords.slice(keywordIndex),
              page
            );
          }

          try {
            // Construct search URL
            const searchUrl = new URL("https://api.unsplash.com/search/photos");
            searchUrl.searchParams.set("query", keyword);
            searchUrl.searchParams.set("page", page.toString());
            searchUrl.searchParams.set("per_page", PER_PAGE.toString());
            searchUrl.searchParams.set("orientation", "landscape");

            // Fetch from Unsplash API
            const response = await fetch(searchUrl.toString(), {
              headers: {
                Authorization: `Client-ID ${accessKey}`,
                "Accept-Version": "v1",
              },
            });

            // Update rate limit info from response headers
            currentRateLimit = parseRateLimitHeaders(response);
            stats.rateLimitRemaining = currentRateLimit.remaining;

            if (currentRateLimit.remaining <= 5) {
              console.warn(
                `Rate limit low: ${currentRateLimit.remaining}/${currentRateLimit.limit} remaining`
              );
            }

            // Handle rate limit exceeded (403 or 429)
            if (response.status === 403 || response.status === 429) {
              console.error(
                `Rate limit exceeded (HTTP ${response.status}), stopping and scheduling retry`
              );
              throw new RateLimitError(
                `Rate limit exceeded (HTTP ${response.status})`,
                keywords.slice(keywordIndex),
                page
              );
            }

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(
                `Unsplash API error: ${response.status} - ${errorText}`
              );
            }

            const data: UnsplashSearchResponse = await response.json();

            // 1. Get all unsplash IDs from this page
            const allIds = data.results.map((p) => p.id);

            if (allIds.length === 0) {
              console.log(`Page ${page}: No results found`);
              continue;
            }

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
              console.log(
                `Page ${page}: All ${data.results.length} photos already exist, skipping`
              );
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
                return { photo, optimizedUrl, analysisResult: result, error: false };
              } catch {
                stats.totalErrors++;
                return { photo, optimizedUrl, analysisResult: undefined, error: true };
              }
            });

            const analyzed = await Promise.all(analysisPromises);

            // Log batch summary
            const successCount = analyzed.filter((a) => !a.error).length;
            const errorCount = analyzed.filter((a) => a.error).length;
            console.log(
              `Page ${page}: Analyzed ${successCount}/${analyzed.length} images successfully${
                errorCount > 0 ? ` (${errorCount} errors)` : ""
              }`
            );

            // 5. Store all results in parallel
            await Promise.all(
              analyzed.map(({ photo, optimizedUrl, analysisResult }) =>
                ctx.runMutation(internal.styleImages.create.createStyleImage, {
                  unsplashId: photo.id,
                  unsplashUrl: optimizedUrl,
                  unsplashBlurHash: photo.blur_hash || undefined,
                  searchKeyword: keyword,
                  confirmed: false,
                  style: analysisResult?.style,
                  colorPalette: analysisResult?.colorPalette,
                  materialFocus: analysisResult?.materialFocus,
                  spatialPhilosophy: analysisResult?.spatialPhilosophy,
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
            // Re-throw rate limit errors
            if (error instanceof RateLimitError) {
              throw error;
            }
            console.error(`Error fetching page ${page} for "${keyword}":`, error);
            stats.totalErrors++;
            // Continue with next page for non-rate-limit errors
          }
        }

        stats.keywordsProcessed++;

        // Delay between keywords to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        // Re-throw rate limit errors
        if (error instanceof RateLimitError) {
          throw error;
        }
        console.error(`Error processing keyword "${keyword}":`, error);
        stats.totalErrors++;
        // Continue with next keyword for non-rate-limit errors
      }
    }

    return {
      success: true,
      rateLimitHit: false,
      stats: {
        ...stats,
        totalProcessed: stats.totalFetched + stats.totalSkipped,
      },
    };
  } catch (error) {
    // Handle rate limit errors by scheduling a retry
    if (error instanceof RateLimitError) {
      const retryAt = Date.now() + RATE_LIMIT_RETRY_DELAY_MS;
      stats.rateLimitHit = true;
      stats.scheduledRetryAt = retryAt;
      stats.remainingKeywords = error.remainingKeywords;

      console.log(
        `Rate limit hit. Scheduling retry in 1 hour for ${error.remainingKeywords.length} remaining keywords, starting at page ${error.startPage}`
      );

      // Schedule the internal action to continue later
      await ctx.scheduler.runAt(
        retryAt,
        internal.styleImages.fetchFromUnsplash.fetchUnsplashImagesInternal,
        {
          keywords: error.remainingKeywords,
          startPage: error.startPage,
        }
      );

      return {
        success: false,
        rateLimitHit: true,
        scheduledRetryAt: new Date(retryAt).toISOString(),
        remainingKeywords: error.remainingKeywords,
        stats: {
          ...stats,
          totalProcessed: stats.totalFetched + stats.totalSkipped,
        },
      };
    }

    // Re-throw other errors
    throw error;
  }
}
