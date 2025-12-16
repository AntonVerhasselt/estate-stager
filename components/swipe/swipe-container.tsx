"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

import { SwipeCard } from "@/components/swipe/swipe-card"
import { DesktopControls } from "@/components/swipe/desktop-controls"
import { Button } from "@/components/ui/button"
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
  onViewProfile?: () => void
}

// ============================================================================
// COMPONENT
// ============================================================================
export function SwipeContainer({ images, onSwipe, swipedImages, onViewProfile }: SwipeContainerProps) {
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
        <p className="text-sm text-muted-foreground mb-6">
          Great job exploring different styles.
        </p>
        {onViewProfile && (
          <Button onClick={onViewProfile}>
            <Sparkles data-icon="inline-start" />
            View Style Profile
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-full bg-background">
      {/* Logo */}
      <div className="absolute top-4 left-0 right-0 z-50 flex justify-center">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          <span className="text-primary">est</span>ager
        </Link>
      </div>
      
      {/* Card stack area - centered with flexbox */}
      <div className="flex-1 mb-4 flex items-center justify-center">
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
