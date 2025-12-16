"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"

import { ExplanationScreen } from "@/components/swipe/explanation-screen"
import { SwipeContainer, type SwipedImages } from "@/components/swipe/swipe-container"
import { CompletionModal } from "@/components/swipe/completion-modal"
import { ViewProfileButton } from "@/components/swipe/view-profile-button"
import { mockSwipeImages, MIN_SWIPES_FOR_PROFILE, type SwipeImage } from "@/lib/mock-data/swipe-images"
import { getVisit } from "@/lib/mock-data/visits"

// ============================================================================
// TYPES
// ============================================================================
type SwipePhase = "explanation" | "swiping"

// ============================================================================
// HELPERS
// ============================================================================
function getStorageKey(visitId: string) {
  return `swipe-state-${visitId}`
}

function loadSwipedImages(visitId: string): SwipedImages | null {
  if (typeof window === "undefined") return null
  try {
    const stored = sessionStorage.getItem(getStorageKey(visitId))
    if (stored) {
      return JSON.parse(stored) as SwipedImages
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

function saveSwipedImages(visitId: string, images: SwipedImages) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(getStorageKey(visitId), JSON.stringify(images))
  } catch {
    // Ignore storage errors
  }
}

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
  
  // Fetch visit data (mock - would be a real API call in production)
  const visit = getVisit(resolvedParams.visitId)
  const hasStyleProfile = visit.styleProfile.hasStyleProfile
  
  // Check if we should skip the explanation (coming back from profile OR already has profile)
  const shouldContinue = searchParams.get("continue") === "true"
  const skipExplanation = shouldContinue || hasStyleProfile
  
  // State - restore from sessionStorage when continuing
  const [phase, setPhase] = React.useState<SwipePhase>(skipExplanation ? "swiping" : "explanation")
  const [swipedImages, setSwipedImages] = React.useState<SwipedImages>(() => {
    if (shouldContinue || hasStyleProfile) {
      const stored = loadSwipedImages(resolvedParams.visitId)
      if (stored) return stored
    }
    return { liked: [], disliked: [] }
  })
  const [showCompletionModal, setShowCompletionModal] = React.useState(false)
  // If visit already has a style profile, they've already seen/dismissed the modal
  const [hasSeenCompletionModal, setHasSeenCompletionModal] = React.useState(
    shouldContinue || hasStyleProfile
  )
  
  // Computed values
  const totalSwiped = swipedImages.liked.length + swipedImages.disliked.length
  const hasEnoughForProfile = totalSwiped >= MIN_SWIPES_FOR_PROFILE || hasStyleProfile
  // Show floating button if visit has a style profile OR user has seen the completion modal
  const showFloatingButton = (hasStyleProfile || hasSeenCompletionModal) && phase === "swiping"
  
  // Handlers
  const handleStart = () => {
    setPhase("swiping")
  }
  
  const handleSwipe = (image: SwipeImage, direction: "left" | "right") => {
    setSwipedImages((prev) => ({
      liked: direction === "right" ? [...prev.liked, image] : prev.liked,
      disliked: direction === "left" ? [...prev.disliked, image] : prev.disliked,
    }))
    
    // Check if we should show the completion modal
    const newTotal = totalSwiped + 1
    if (newTotal === MIN_SWIPES_FOR_PROFILE && !hasSeenCompletionModal) {
      // Small delay to let the swipe animation complete
      setTimeout(() => {
        setShowCompletionModal(true)
      }, 300)
    }
  }
  
  const handleViewProfile = () => {
    setShowCompletionModal(false)
    router.push(`/${resolvedParams.visitId}/profile`)
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
  
  const handleFloatingButtonClick = () => {
    router.push(`/${resolvedParams.visitId}/profile`)
  }
  
  // Persist swipedImages to sessionStorage whenever it changes
  React.useEffect(() => {
    if (swipedImages.liked.length > 0 || swipedImages.disliked.length > 0) {
      saveSwipedImages(resolvedParams.visitId, swipedImages)
    }
  }, [swipedImages, resolvedParams.visitId])

  return (
    <div className="min-h-[100dvh] bg-background">
      <AnimatePresence mode="wait">
        {phase === "explanation" ? (
          <ExplanationScreen key="explanation" onStart={handleStart} />
        ) : (
          <div key="swiping" className="h-[100dvh] flex flex-col">
            <SwipeContainer
              images={mockSwipeImages}
              onSwipe={handleSwipe}
              swipedImages={swipedImages}
              onViewProfile={hasEnoughForProfile ? handleViewProfile : undefined}
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
      
      {/* Floating view profile button */}
      <ViewProfileButton
        visible={showFloatingButton}
        onClick={handleFloatingButtonClick}
      />
    </div>
  )
}
