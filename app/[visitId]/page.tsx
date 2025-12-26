"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import { AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { ExplanationScreen } from "@/components/swipe/explanation-screen"
import { SwipeContainer } from "@/components/swipe/swipe-container"
import { CompletionModal } from "@/components/swipe/completion-modal"
import { useImageBuffer } from "@/hooks/use-image-buffer"

// ============================================================================
// TYPES
// ============================================================================
type SwipePhase = "explanation" | "swiping"

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function SwipeQuizPage({
  params,
}: {
  params: Promise<{ visitId: string }>
}) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // The URL param is actually the prospectLinkId, not the visitId
  const prospectLinkId = resolvedParams.visitId
  
  // Fetch visit data from backend using prospectLinkId
  const visit = useQuery(
    api.visits.get.getVisitByProspectLink,
    { prospectLinkId }
  )
  
  const visitId = visit?._id ?? null
  
  // Reactively subscribe to style profile updates
  const styleProfile = useQuery(
    api.styleProfiles.get.getStyleProfileByVisit,
    visitId ? { visitId } : "skip"
  )
  
  // Use the image buffer hook for managing the rolling 5-image buffer
  const {
    currentImage,
    nextImage,
    isLoading: isBufferLoading,
    isExhausted,
    handleSwipe,
    swipeCount,
  } = useImageBuffer(visitId)
  
  // Check if profile is complete (has completedAt timestamp)
  const isProfileComplete = styleProfile?.completedAt != null
  const hasAnySwipes = swipeCount > 0
  
  // Check if we should skip the explanation (coming back from profile OR already has swipes)
  const shouldContinue = searchParams.get("continue") === "true"
  const skipExplanation = shouldContinue || hasAnySwipes
  
  // State
  const [phase, setPhase] = React.useState<SwipePhase>("explanation")
  const [showCompletionModal, setShowCompletionModal] = React.useState(false)
  const [hasSeenCompletionModal, setHasSeenCompletionModal] = React.useState(false)
  
  // Update phase when we know if we should skip explanation
  React.useEffect(() => {
    if (skipExplanation && phase === "explanation") {
      setPhase("swiping")
    }
  }, [skipExplanation, phase])
  
  // Track if we've shown the completion modal for this session
  const previousCompletedRef = React.useRef<boolean>(false)
  
  // Show completion modal when profile becomes complete
  React.useEffect(() => {
    if (
      isProfileComplete &&
      !previousCompletedRef.current &&
      !hasSeenCompletionModal &&
      phase === "swiping"
    ) {
      // Small delay to let the swipe animation complete
      const timer = setTimeout(() => {
        setShowCompletionModal(true)
      }, 300)
      previousCompletedRef.current = true
      return () => clearTimeout(timer)
    }
    
    // If profile was already complete when we loaded (e.g., returning user)
    if (isProfileComplete && !previousCompletedRef.current) {
      previousCompletedRef.current = true
      setHasSeenCompletionModal(true)
    }
  }, [isProfileComplete, hasSeenCompletionModal, phase])
  
  // Handlers
  const handleStart = () => {
    setPhase("swiping")
  }
  
  const handleViewProfile = () => {
    setShowCompletionModal(false)
    router.push(`/${prospectLinkId}/profile`)
  }
  
  const handleKeepSwiping = () => {
    setShowCompletionModal(false)
    setHasSeenCompletionModal(true)
  }
  
  const handleCompletionModalOpenChange = (open: boolean) => {
    setShowCompletionModal(open)
    // Treat any dismissal (clicking outside, pressing escape) as "Keep Refining"
    if (!open) {
      setHasSeenCompletionModal(true)
    }
  }
  
  // Loading state while fetching visit
  if (visit === undefined) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }
  
  // Visit not found
  if (visit === null) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Visit Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This link may have expired or is invalid.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <AnimatePresence mode="wait">
        {phase === "explanation" ? (
          <ExplanationScreen key="explanation" onStart={handleStart} />
        ) : (
          <div key="swiping" className="h-[100dvh] flex flex-col">
            <SwipeContainer
              currentImage={currentImage}
              nextImage={nextImage}
              isLoading={isBufferLoading}
              isExhausted={isExhausted}
              swipeCount={swipeCount}
              isProfileComplete={isProfileComplete}
              onSwipe={handleSwipe}
              onViewProfile={handleViewProfile}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Completion modal */}
      <CompletionModal
        open={showCompletionModal}
        onOpenChange={handleCompletionModalOpenChange}
        onViewProfile={handleViewProfile}
        onKeepSwiping={handleKeepSwiping}
      />
    </div>
  )
}
