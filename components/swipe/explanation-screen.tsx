"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowLeftRight } from "lucide-react"

import { Button } from "@/components/ui/button"

// ============================================================================
// TYPES
// ============================================================================
type ExplanationScreenProps = {
  onStart: () => void
}

// ============================================================================
// COMPONENT
// ============================================================================
export function ExplanationScreen({ onStart }: ExplanationScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 py-12 bg-gradient-to-b from-background via-background to-primary/5"
    >
      {/* Decorative background element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-8 p-5 bg-primary/10 rounded-full"
        >
          <Sparkles className="size-10 text-primary" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3"
        >
          Discover Your Style
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed"
        >
          Swipe through beautiful interior designs to help us understand your taste.
          Swipe right if you love it, left if it&apos;s not for you.
        </motion.p>

        {/* Visual hint */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-6 mb-10 text-xs text-muted-foreground"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-destructive font-medium">✕</span>
            </div>
            <span>Not for me</span>
          </div>
          <ArrowLeftRight className="size-5 text-muted-foreground/50" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">♥</span>
            </div>
            <span>Love it</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="px-8 h-11 text-sm font-medium"
          >
            <Sparkles data-icon="inline-start" />
            Let&apos;s Start
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
