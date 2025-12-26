"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

// ============================================================================
// TYPES
// ============================================================================
type DesktopControlsProps = {
  onDislike: () => void
  onLike: () => void
  /** Whether to show the "View Profile" button */
  showViewProfile?: boolean
  /** Callback when "View Profile" is clicked */
  onViewProfile?: () => void
}

// ============================================================================
// COMPONENT
// ============================================================================
export function DesktopControls({ 
  onDislike, 
  onLike,
  showViewProfile = false,
  onViewProfile,
}: DesktopControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4 px-4">
      {/* Swipe controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Dislike button */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onDislike}
            className="size-14 rounded-full border-2 border-destructive/30 hover:border-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Dislike"
          >
            <X className="size-6 text-destructive" />
          </Button>
        </motion.div>
        
        {/* Keyboard hint - only visible on desktop */}
        <div className="hidden sm:flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
          <span>or use</span>
          <div className="flex gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">→</kbd>
          </div>
        </div>
        
        {/* Like button */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onLike}
            className="size-14 rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors"
            aria-label="Like"
          >
            <Heart className="size-6 text-primary" />
          </Button>
        </motion.div>
      </div>
      
      {/* View Profile button - always render container for stable layout */}
      <div className="h-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showViewProfile && onViewProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={onViewProfile}
                className="gap-1.5"
              >
                <Sparkles className="size-4" />
                View Style Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
