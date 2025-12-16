"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"

import { ExplanationScreen } from "@/components/swipe/explanation-screen"
import { SwipeContainer, type SwipedImages } from "@/components/swipe/swipe-container"
import { CompletionModal } from "@/components/swipe/completion-modal"
import { ViewProfileButton } from "@/components/swipe/view-profile-button"
import { mockSwipeImages, MIN_SWIPES_FOR_PROFILE, type SwipeImage } from "@/lib/mock-data/swipe-images"

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
  
  // Check if we should skip the explanation (coming back from profile)
  const shouldContinue = searchParams.get("continue") === "true"
  
  // State
  const [phase, setPhase] = React.useState<SwipePhase>(shouldContinue ? "swiping" : "explanation")
  const [swipedImages, setSwipedImages] = React.useState<SwipedImages>({
    liked: [],
    disliked: [],
  })
  const [showCompletionModal, setShowCompletionModal] = React.useState(false)
  const [hasSeenCompletionModal, setHasSeenCompletionModal] = React.useState(shouldContinue)
  
  // Computed values
  const totalSwiped = swipedImages.liked.length + swipedImages.disliked.length
  const hasEnoughForProfile = totalSwiped >= MIN_SWIPES_FOR_PROFILE
  const showFloatingButton = hasSeenCompletionModal && phase === "swiping"
  
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
  
  const handleFloatingButtonClick = () => {
    router.push(`/${resolvedParams.visitId}/profile`)
  }

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
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Completion modal */}
      <CompletionModal
        open={showCompletionModal}
        onOpenChange={setShowCompletionModal}
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
