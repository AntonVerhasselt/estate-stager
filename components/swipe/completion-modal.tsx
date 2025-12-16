"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ============================================================================
// TYPES
// ============================================================================
type CompletionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewProfile: () => void
  onKeepSwiping: () => void
}

// ============================================================================
// COMPONENT
// ============================================================================
export function CompletionModal({
  open,
  onOpenChange,
  onViewProfile,
  onKeepSwiping,
}: CompletionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          {/* Icon */}
          <div className="mb-2 p-4 bg-primary/10 rounded-full">
            <Sparkles className="size-8 text-primary" />
          </div>
          
          <DialogTitle className="text-lg">Your Style Profile is Ready</DialogTitle>
          
          <DialogDescription className="text-center">
            We have enough information to create your personalized style profile.
            You can view it now or keep swiping to refine your preferences.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onViewProfile} className="w-full">
            <Sparkles data-icon="inline-start" />
            View My Style Profile
          </Button>
          <Button variant="outline" onClick={onKeepSwiping} className="w-full">
            Keep Refining
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
