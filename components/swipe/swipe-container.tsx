"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Loader2 } from "lucide-react"

import { SwipeCard, type StyleImage } from "@/components/swipe/swipe-card"
import { DesktopControls } from "@/components/swipe/desktop-controls"
import { Button } from "@/components/ui/button"

// ============================================================================
// TYPES
// ============================================================================
type SwipeContainerProps = {
  /** Current image from buffer */
  currentImage: StyleImage | null
  /** Next image from buffer (for preview) */
  nextImage: StyleImage | null
  /** Whether initial images are loading */
  isLoading: boolean
  /** Whether all images have been swiped */
  isExhausted: boolean
  /** Total swipe count */
  swipeCount: number
  /** Whether the style profile is complete */
  isProfileComplete?: boolean
  /** Handle swipe - fire-and-forget */
  onSwipe: (direction: "like" | "dislike") => void
  /** Navigate to profile */
  onViewProfile?: () => void
}

// ============================================================================
// CONSTANTS
// ============================================================================
const MAX_SWIPES = 50

// ============================================================================
// COMPONENT
// ============================================================================
export function SwipeContainer({ 
  currentImage,
  nextImage,
  isLoading,
  isExhausted,
  swipeCount,
  isProfileComplete = false,
  onSwipe,
  onViewProfile,
}: SwipeContainerProps) {
  // Track exit direction for button clicks
  const [exitDirection, setExitDirection] = React.useState<"left" | "right">("left")
  
  // Stable reference to current image ID for keyboard handler
  const currentImageIdRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    currentImageIdRef.current = currentImage?._id ?? null
  }, [currentImage])

  // Stable swipe handler that doesn't depend on currentImage
  const handleSwipe = React.useCallback((direction: "left" | "right") => {
    if (!currentImageIdRef.current) return
    setExitDirection(direction)
    // Fire-and-forget - convert direction to like/dislike
    onSwipe(direction === "right" ? "like" : "dislike")
  }, [onSwipe])
  
  // Keyboard navigation with stable callback
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentImageIdRef.current) return
      
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault()
        handleSwipe("left")
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault()
        handleSwipe("right")
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSwipe])

  // Determine what state we're in
  const showLoading = isLoading
  const showExhausted = !isLoading && (!currentImage || isExhausted)
  const showCards = !showLoading && !showExhausted

  return (
    <div className="relative flex flex-col h-full bg-background">
      {/* Logo and progress - always visible */}
      <div className="absolute top-4 left-0 right-0 z-50 flex flex-col items-center gap-2">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          <span className="text-primary">est</span>ager
        </Link>
        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{swipeCount} / {MAX_SWIPES}</span>
          <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min((swipeCount / MAX_SWIPES) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 mb-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-6 text-center"
            >
              <Loader2 className="size-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Loading style images...</p>
            </motion.div>
          )}
          
          {showExhausted && (
            <motion.div
              key="exhausted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-6 text-center"
            >
              <div className="mb-4 p-4 bg-primary/10 rounded-full">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-lg font-semibold mb-2">You&apos;ve seen them all!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Great job exploring different styles.
              </p>
              {onViewProfile && (
                <Button onClick={onViewProfile}>
                  <Sparkles data-icon="inline-start" />
                  View Style Profile
                </Button>
              )}
            </motion.div>
          )}
          
          {showCards && currentImage && (
            <motion.div
              key="cards"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <AnimatePresence mode="popLayout">
                {/* Show next card underneath (blurred) */}
                {nextImage && (
                  <SwipeCard
                    key={nextImage._id}
                    image={nextImage}
                    onSwipe={() => {}}
                    isTop={false}
                    isBlurred={true}
                  />
                )}
                
                {/* Current card on top */}
                <SwipeCard
                  key={currentImage._id}
                  image={currentImage}
                  onSwipe={handleSwipe}
                  isTop={true}
                  exitDirection={exitDirection}
                />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Desktop controls - always render container for stable layout, but control visibility */}
      <div className={`transition-opacity duration-150 ${showCards ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <DesktopControls
          onDislike={() => handleSwipe("left")}
          onLike={() => handleSwipe("right")}
          showViewProfile={isProfileComplete}
          onViewProfile={onViewProfile}
        />
      </div>
    </div>
  )
}
