"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"

import { cn } from "@/lib/utils"
import { type SwipeImage } from "@/lib/mock-data/swipe-images"

// ============================================================================
// TYPES
// ============================================================================
type SwipeCardProps = {
  image: SwipeImage
  onSwipe: (direction: "left" | "right") => void
  isTop?: boolean
  exitDirection?: "left" | "right"
  isBlurred?: boolean
}

// ============================================================================
// CONSTANTS
// ============================================================================
const SWIPE_THRESHOLD = 100
const VELOCITY_THRESHOLD = 500

// ============================================================================
// COMPONENT
// ============================================================================
export function SwipeCard({ image, onSwipe, isTop = false, exitDirection, isBlurred = false }: SwipeCardProps) {
  const x = useMotionValue(0)
  
  // Transform values based on drag position
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x
    
    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > VELOCITY_THRESHOLD) {
      const direction = offset > 0 ? "right" : "left"
      onSwipe(direction)
    }
  }

  // Determine exit direction: use drag position if dragged, otherwise use prop
  const getExitX = () => {
    const draggedX = x.get()
    if (Math.abs(draggedX) > 10) {
      // Card was dragged, use drag direction
      return draggedX > 0 ? 300 : -300
    }
    // Card was not dragged (button click), use exitDirection prop
    // Dislike (left) → -300 (animate left), Like (right) → 300 (animate right)
    return exitDirection === "right" ? 300 : -300
  }

  return (
    <motion.div
      className={cn(
        "absolute cursor-grab active:cursor-grabbing",
        !isTop && "pointer-events-none",
        isBlurred && "blur-sm opacity-50"
      )}
      style={{ x, rotate: isBlurred ? 0 : rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.98, opacity: isTop ? 1 : 0.6 }}
      animate={{ 
        scale: isTop ? 1 : 0.98, 
        opacity: isTop ? 1 : (isBlurred ? 0.5 : 0.8),
      }}
      exit={{
        x: getExitX(),
        opacity: 0,
        transition: { duration: 0.2 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Card container - natural sizing based on image */}
      <div className="relative rounded-none overflow-hidden ring-1 ring-foreground/10 shadow-xl">
        {/* Main image - natural dimensions with max constraints */}
        <Image
          src={image.imageUrl}
          alt={`${image.style} ${image.roomType}`}
          width={800}
          height={600}
          className="w-auto h-auto max-w-[calc(100vw-2rem)] max-h-[60vh] sm:max-w-[500px] sm:max-h-[70vh]"
          priority={isTop}
        />
        
        {/* Like indicator overlay */}
        {!isBlurred && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-primary/20 pointer-events-none"
            style={{ opacity: likeOpacity }}
          >
            <div className="rotate-[-20deg] border-4 border-primary rounded-none px-4 py-2">
              <span className="text-3xl font-bold text-primary tracking-wider">LIKE</span>
            </div>
          </motion.div>
        )}
        
        {/* Nope indicator overlay */}
        {!isBlurred && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-destructive/20 pointer-events-none"
            style={{ opacity: nopeOpacity }}
          >
            <div className="rotate-[20deg] border-4 border-destructive rounded-none px-4 py-2">
              <span className="text-3xl font-bold text-destructive tracking-wider">NOPE</span>
            </div>
          </motion.div>
        )}
        
        {/* Style badge */}
        {!isBlurred && (
          <div className="absolute bottom-4 left-4 z-30 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-none text-xs font-medium capitalize">
            {image.style} · {image.roomType}
          </div>
        )}
      </div>
    </motion.div>
  )
}
