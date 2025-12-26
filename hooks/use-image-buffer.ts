"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id, Doc } from "@/convex/_generated/dataModel";

// ============================================================================
// TYPES
// ============================================================================
export type StyleImage = Doc<"styleImages">;

type ImageBufferState = {
  /** Images ready to display (preloaded) */
  buffer: StyleImage[];
  /** Whether the initial load is complete */
  isReady: boolean;
  /** Whether we've exhausted all available images */
  isExhausted: boolean;
  /** Local swipe count for immediate UI updates */
  localSwipeCount: number;
};

type UseImageBufferReturn = {
  /** Current image to display */
  currentImage: StyleImage | null;
  /** Next image (for preview/preload) */
  nextImage: StyleImage | null;
  /** Whether initial images are loading */
  isLoading: boolean;
  /** Whether all images have been swiped */
  isExhausted: boolean;
  /** Handle a swipe - removes current image and triggers refill */
  handleSwipe: (direction: "like" | "dislike") => void;
  /** Total swipe count (local for instant feedback) */
  swipeCount: number;
};

// ============================================================================
// CONSTANTS
// ============================================================================
const BUFFER_SIZE = 5;

// ============================================================================
// IMAGE PRELOADER
// ============================================================================
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

// ============================================================================
// HOOK
// ============================================================================
export function useImageBuffer(visitId: Id<"visits"> | null): UseImageBufferReturn {
  // State for managing the image buffer
  const [state, setState] = React.useState<ImageBufferState>({
    buffer: [],
    isReady: false,
    isExhausted: false,
    localSwipeCount: 0,
  });

  // Track IDs we've already added to buffer to avoid duplicates
  const seenIdsRef = React.useRef<Set<string>>(new Set());

  // Convex queries and mutations
  const initialImages = useQuery(
    api.styleImages.list.listInitialSwipeImages,
    visitId ? { visitId } : "skip"
  );
  
  const nextImage = useQuery(
    api.styleImages.get.getNextStyleImage,
    visitId && state.isReady && state.buffer.length < BUFFER_SIZE && !state.isExhausted
      ? { visitId }
      : "skip"
  );

  // Get initial swipe count from backend (only used for initialization)
  const backendSwipeCount = useQuery(
    api.swipes.get.getSwipeCount,
    visitId ? { visitId } : "skip"
  );

  const createSwipe = useMutation(api.swipes.create.createSwipe);

  // Initialize buffer with initial images
  React.useEffect(() => {
    if (!initialImages || backendSwipeCount === undefined || state.isReady) return;

    const initializeBuffer = async () => {
      // Mark all initial images as seen
      for (const img of initialImages) {
        seenIdsRef.current.add(img._id);
      }

      // Preload all images in parallel
      await Promise.all(
        initialImages.map((img) => 
          preloadImage(img.unsplashUrl).catch(() => {
            // Silent fail - image will still work, just not preloaded
          })
        )
      );

      setState((prev) => ({
        ...prev,
        buffer: initialImages,
        isReady: true,
        isExhausted: initialImages.length === 0,
        localSwipeCount: backendSwipeCount,
      }));
    };

    initializeBuffer();
  }, [initialImages, backendSwipeCount, state.isReady]);

  // Refill buffer when we get a new image from the query
  React.useEffect(() => {
    if (!nextImage || !state.isReady) return;
    
    // Skip if we've already seen this image
    if (seenIdsRef.current.has(nextImage._id)) return;
    
    // Mark as seen
    seenIdsRef.current.add(nextImage._id);

    // Preload and add to buffer
    preloadImage(nextImage.unsplashUrl)
      .catch(() => {
        // Silent fail
      })
      .finally(() => {
        setState((prev) => ({
          ...prev,
          buffer: [...prev.buffer, nextImage],
        }));
      });
  }, [nextImage, state.isReady]);

  // Detect exhaustion when query returns null
  React.useEffect(() => {
    if (
      state.isReady &&
      state.buffer.length < BUFFER_SIZE &&
      nextImage === null &&
      !state.isExhausted
    ) {
      setState((prev) => ({
        ...prev,
        isExhausted: true,
      }));
    }
  }, [nextImage, state.isReady, state.buffer.length, state.isExhausted]);

  // Handle swipe - fire-and-forget mutation, immediately update buffer
  const handleSwipe = React.useCallback(
    (direction: "like" | "dislike") => {
      setState((prev) => {
        const currentImage = prev.buffer[0];
        if (!currentImage || !visitId) return prev;

        // Fire-and-forget - don't await
        createSwipe({
          visitId,
          styleImageId: currentImage._id,
          direction,
        }).catch((error) => {
          // Silent fail - log for debugging but don't interrupt user
          console.error("Failed to record swipe:", error);
        });

        // Immediately remove current image from buffer and increment local count
        return {
          ...prev,
          buffer: prev.buffer.slice(1),
          localSwipeCount: prev.localSwipeCount + 1,
          isExhausted: prev.buffer.length <= 1 && prev.isExhausted,
        };
      });
    },
    [visitId, createSwipe]
  );

  return {
    currentImage: state.buffer[0] ?? null,
    nextImage: state.buffer[1] ?? null,
    isLoading: !state.isReady,
    isExhausted: state.isExhausted && state.buffer.length === 0,
    handleSwipe,
    swipeCount: state.localSwipeCount,
  };
}
