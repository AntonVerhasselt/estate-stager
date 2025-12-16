"use client"

import * as React from "react"
import { AnimatePresence } from "framer-motion"

import { SwipeCard } from "@/components/swipe/swipe-card"
import { DesktopControls } from "@/components/swipe/desktop-controls"
import { type SwipeImage } from "@/lib/mock-data/swipe-images"

// ============================================================================
// TYPES
// ============================================================================
export type SwipedImages = {
  liked: SwipeImage[]
  disliked: SwipeImage[]
}

type SwipeContainerProps = {
  images: SwipeImage[]
  onSwipe: (image: SwipeImage, direction: "left" | "right") => void
  swipedImages: SwipedImages
}

// ============================================================================
// COMPONENT
// ============================================================================
export function SwipeContainer({ images, onSwipe, swipedImages }: SwipeContainerProps) {
  const totalSwiped = swipedImages.liked.length + swipedImages.disliked.length
  const currentIndex = totalSwiped
  const currentImage = images[currentIndex]
  const nextImage = images[currentIndex + 1]
  
  // Track exit direction for button clicks
  const [exitDirection, setExitDirection] = React.useState<"left" | "right">("left")
  
  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentImage) return
      
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
  }, [currentImage])

  const handleSwipe = (direction: "left" | "right") => {
    if (currentImage) {
      setExitDirection(direction)
      onSwipe(currentImage, direction)
    }
  }

  // All images swiped
  if (!currentImage) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="mb-4 p-4 bg-primary/10 rounded-full">
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">You&apos;ve seen them all!</h2>
        <p className="text-sm text-muted-foreground">
          Great job exploring different styles.
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-full bg-background">
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center gap-2">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(totalSwiped / images.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium shrink-0">
          {totalSwiped}/{images.length}
        </span>
      </div>
      
      {/* Card stack area - centered with flexbox */}
      <div className="flex-1 mt-12 mb-4 flex items-center justify-center">
        {/* Card stack - relative container for absolute positioning of cards */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {/* Show next card underneath (blurred) */}
            {nextImage && (
              <SwipeCard
                key={nextImage.id}
                image={nextImage}
                onSwipe={() => {}}
                isTop={false}
                isBlurred={true}
              />
            )}
            
            {/* Current card on top */}
            <SwipeCard
              key={currentImage.id}
              image={currentImage}
              onSwipe={handleSwipe}
              isTop={true}
              exitDirection={exitDirection}
            />
          </AnimatePresence>
        </div>
      </div>
      
      {/* Desktop controls */}
      <DesktopControls
        onDislike={() => handleSwipe("left")}
        onLike={() => handleSwipe("right")}
      />
    </div>
  )
}
