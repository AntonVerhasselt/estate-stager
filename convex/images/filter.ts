"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  // 1. Allowed file extensions
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".avif"],

  // 3. Keywords that indicate UI elements (not property photos)
  uiKeywords: [
    "logo",
    "icon",
    "sprite",
    "banner",
    "favicon",
    "ad",
    "avatar",
    "button",
    "arrow",
    "social",
    "twitter",
    "facebook",
    "instagram",
    "linkedin",
    "youtube",
    "pinterest",
    "placeholder",
    "loading",
    "spinner",
  ],

  // 4. Tracking & ad domains to block
  trackerDomains: [
    "googletagmanager.com",
    "google-analytics.com",
    "doubleclick.net",
    "googlesyndication.com",
    "googleadservices.com",
    "facebook.com/tr",
    "analytics",
    "tracking",
    "pixel",
    "beacon",
  ],

  // 5. Minimum file size in bytes (20 KB)
  minFileSize: 20 * 1024,

  // 6. Thumbnail patterns
  thumbnailPatterns: [
    /thumb/i,
    /small/i,
    /mini/i,
    /tiny/i,
    /preview/i,
    /[?&]w=\d{1,3}(?:&|$)/i,  // w=100, w=400, etc. (small widths)
    /[?&]h=\d{1,3}(?:&|$)/i,  // h=100, h=400, etc. (small heights)
    /[?&]size=(?:s|small|thumb)/i,
    /_\d{2,3}x\d{2,3}\./i,    // _100x100. pattern
    /-\d{2,3}x\d{2,3}\./i,    // -100x100. pattern
  ],

  // 7. Query params to strip for deduplication
  dedupeStripParams: ["w", "h", "width", "height", "size", "q", "quality", "fit", "crop", "auto", "format", "dpr"],

  // 10. Maximum number of images to return
  maxImages: 50,

  // Timeout for HEAD requests (ms)
  headRequestTimeout: 5000,
};

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * 1. Extension Filter
 * Keep only normal photo files — .jpg, .jpeg, .png, .webp, .avif
 */
function hasAllowedExtension(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return CONFIG.allowedExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    // If URL parsing fails, check the raw string
    const lowerUrl = url.toLowerCase();
    return CONFIG.allowedExtensions.some((ext) => lowerUrl.includes(ext));
  }
}

/**
 * 2. Data URL Filter
 * Ignore images embedded directly in the page (like data:image/...)
 */
function isNotDataUrl(url: string): boolean {
  return !url.trim().toLowerCase().startsWith("data:");
}

/**
 * 3. Keyword Filter
 * Remove images that clearly look like UI elements or ads
 */
function hasNoUiKeywords(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return !CONFIG.uiKeywords.some((keyword) => lowerUrl.includes(keyword));
}

/**
 * 4. Tracking & Ad Filter
 * Drop analytics or ad tracking images
 */
function isNotTracker(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const fullUrl = url.toLowerCase();
    return !CONFIG.trackerDomains.some(
      (domain) => hostname.includes(domain) || fullUrl.includes(domain)
    );
  } catch {
    // If URL parsing fails, check the raw string
    const lowerUrl = url.toLowerCase();
    return !CONFIG.trackerDomains.some((domain) => lowerUrl.includes(domain));
  }
}

/**
 * 6. Thumbnail Detection
 * Check if URL looks like a thumbnail
 */
function isThumbnail(url: string): boolean {
  return CONFIG.thumbnailPatterns.some((pattern) => pattern.test(url));
}

/**
 * 7. Get normalized URL for deduplication
 * Remove size-related query parameters
 */
function getNormalizedUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    CONFIG.dedupeStripParams.forEach((param) => {
      urlObj.searchParams.delete(param);
    });
    // Also remove hash
    urlObj.hash = "";
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * 7. Get base URL (without query params) for grouping similar images
 */
function getBaseUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.origin}${urlObj.pathname}`;
  } catch {
    return url;
  }
}

/**
 * 5 & 9. Validate image via HEAD request
 * Checks Content-Type and Content-Length
 */
async function validateImageHead(url: string): Promise<{ valid: boolean; size: number }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.headRequestTimeout);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EstateStager/1.0)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { valid: false, size: 0 };
    }

    // 9. File-Type Validation Filter
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return { valid: false, size: 0 };
    }

    // 5. Size / Dimension Filter
    const contentLength = response.headers.get("content-length");
    const size = contentLength ? parseInt(contentLength, 10) : 0;

    // If we can't determine size, give it the benefit of the doubt
    if (!contentLength || isNaN(size)) {
      return { valid: true, size: CONFIG.minFileSize + 1 };
    }

    return { valid: size >= CONFIG.minFileSize, size };
  } catch {
    // On error (timeout, network issue), give benefit of the doubt
    return { valid: true, size: CONFIG.minFileSize + 1 };
  }
}

// ============================================================================
// Main Filter Action
// ============================================================================

export const filterImages = internalAction({
  args: {
    imageUrls: v.array(v.string()),
  },
  handler: async ({}, args) => {
    const { imageUrls } = args;
    
    console.log(`[ImageFilter] Starting with ${imageUrls.length} images`);

    // ========================================================================
    // Phase 1: Fast synchronous filters (no network requests)
    // ========================================================================

    let urls = imageUrls;

    // 2. Data URL Filter
    urls = urls.filter(isNotDataUrl);
    console.log(`[ImageFilter] After data URL filter: ${urls.length}`);

    // 1. Extension Filter
    urls = urls.filter(hasAllowedExtension);
    console.log(`[ImageFilter] After extension filter: ${urls.length}`);

    // 3. Keyword Filter
    urls = urls.filter(hasNoUiKeywords);
    console.log(`[ImageFilter] After keyword filter: ${urls.length}`);

    // 4. Tracking & Ad Filter
    urls = urls.filter(isNotTracker);
    console.log(`[ImageFilter] After tracker filter: ${urls.length}`);

    // ========================================================================
    // Phase 2: Deduplication and thumbnail handling
    // ========================================================================

    // 7. Duplicate URL Filter - Group by normalized URL
    const normalizedGroups = new Map<string, string[]>();
    for (const url of urls) {
      const normalized = getNormalizedUrl(url);
      if (!normalizedGroups.has(normalized)) {
        normalizedGroups.set(normalized, []);
      }
      normalizedGroups.get(normalized)!.push(url);
    }

    // For each group, prefer non-thumbnail versions
    const dedupedUrls: string[] = [];
    for (const [, group] of normalizedGroups) {
      // Sort: non-thumbnails first, then by URL length (longer URLs often have more params = larger images)
      const sorted = group.sort((a, b) => {
        const aIsThumb = isThumbnail(a);
        const bIsThumb = isThumbnail(b);
        if (aIsThumb !== bIsThumb) return aIsThumb ? 1 : -1;
        return b.length - a.length;
      });
      dedupedUrls.push(sorted[0]);
    }
    console.log(`[ImageFilter] After deduplication: ${dedupedUrls.length}`);

    // 6. Additional thumbnail handling - Group by base URL and prefer full-size
    const baseUrlGroups = new Map<string, { url: string; isThumb: boolean }[]>();
    for (const url of dedupedUrls) {
      const baseUrl = getBaseUrl(url);
      if (!baseUrlGroups.has(baseUrl)) {
        baseUrlGroups.set(baseUrl, []);
      }
      baseUrlGroups.get(baseUrl)!.push({ url, isThumb: isThumbnail(url) });
    }

    const thumbnailFiltered: string[] = [];
    for (const [, group] of baseUrlGroups) {
      // If we have both thumbnails and full-size, keep only full-size
      const fullSize = group.filter((g) => !g.isThumb);
      const thumbs = group.filter((g) => g.isThumb);

      if (fullSize.length > 0) {
        // Take all full-size versions (they might be different sizes/qualities)
        thumbnailFiltered.push(...fullSize.map((g) => g.url));
      } else {
        // Only thumbnails exist, take the first one
        thumbnailFiltered.push(thumbs[0].url);
      }
    }
    console.log(`[ImageFilter] After thumbnail filter: ${thumbnailFiltered.length}`);

    // ========================================================================
    // Phase 3: Async validation (HEAD requests)
    // Limit to reasonable number before making network requests
    // ========================================================================

    // Take more than maxImages to account for failures in HEAD validation
    const candidateUrls = thumbnailFiltered.slice(0, CONFIG.maxImages * 2);

    // 5 & 9. Validate via HEAD requests (size and content-type)
    const validationResults = await Promise.all(
      candidateUrls.map(async (url) => {
        const result = await validateImageHead(url);
        return { url, ...result };
      })
    );

    const validatedUrls = validationResults
      .filter((r) => r.valid)
      .sort((a, b) => b.size - a.size) // Sort by size descending (larger images first)
      .map((r) => r.url);

    console.log(`[ImageFilter] After HEAD validation: ${validatedUrls.length}`);

    // ========================================================================
    // Phase 4: Apply max count guard
    // ========================================================================

    // 10. Max Count Guard
    const finalUrls = validatedUrls.slice(0, CONFIG.maxImages);
    console.log(`[ImageFilter] Final count: ${finalUrls.length}`);

    return {
      filteredImageUrls: finalUrls,
    };
  },
});
