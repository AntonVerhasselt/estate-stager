"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"

// ============================================================================
// TYPES
// ============================================================================
type DesktopControlsProps = {
  onDislike: () => void
  onLike: () => void
}

// ============================================================================
// COMPONENT
// ============================================================================
export function DesktopControls({ onDislike, onLike }: DesktopControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-4 px-4">
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
  )
}
