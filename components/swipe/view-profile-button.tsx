"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"

// ============================================================================
// TYPES
// ============================================================================
type ViewProfileButtonProps = {
  visible: boolean
  onClick: () => void
}

// ============================================================================
// COMPONENT
// ============================================================================
export function ViewProfileButton({ visible, onClick }: ViewProfileButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            onClick={onClick}
            className="shadow-lg px-4 h-9 text-xs"
          >
            <User data-icon="inline-start" />
            View Style Profile
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
