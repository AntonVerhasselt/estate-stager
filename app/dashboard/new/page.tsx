"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { UrlInputStep } from "@/components/add-property/url-input-step"
import { ReviewEditStep, type User } from "@/components/add-property/review-edit-step"
import type { PropertyImage, RoomType } from "@/components/add-property/image-gallery"

type ScrapedData = {
  address: string | null
  images: PropertyImage[]
  users: User[]
  sourceUrl?: string
}

type FlowState =
  | { step: "url-input" }
  | { step: "scraping" }
  | { step: "review"; scrapedData: ScrapedData }

export default function NewPropertyPage() {
  const router = useRouter()
  const [flowState, setFlowState] = React.useState<FlowState>({ step: "url-input" })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  
  const scrapePropertyUrl = useAction(api.properties.scrape.scrapePropertyUrl)
  const createProperty = useAction(api.properties.create.createProperty)

  const handleUrlSubmit = async (url: string) => {
    setFlowState({ step: "scraping" })
    
    try {
      const result = await scrapePropertyUrl({ url })
      const scrapedData: ScrapedData = {
        address: result.address,
        images: (result.imageUrls ?? []).map((src) => ({ src, roomType: null })),
        users: (result.users ?? []) as User[],
        sourceUrl: url,
      }
      setFlowState({ step: "review", scrapedData })
    } catch (error) {
      // On error, go to review with empty data
      setFlowState({
        step: "review",
        scrapedData: { address: null, images: [], users: [] },
      })
    }
  }

  const handleSkip = () => {
    setFlowState({
      step: "review",
      scrapedData: { address: null, images: [], users: [] },
    })
  }

  const handleBack = () => {
    setFlowState({ step: "url-input" })
  }

  const handleSubmit = async (data: { address: string; images: PropertyImage[]; agentId: string }) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Get sourceUrl from flow state if available
      const sourceUrl = flowState.step === "review" ? flowState.scrapedData.sourceUrl : undefined
      
      // Transform images: src -> url, and ensure roomType is not null
      const images = data.images.map((img) => ({
        url: img.src,
        roomType: img.roomType as RoomType, // Already validated in ReviewEditStep
      }))
      
      const result = await createProperty({
        address: data.address,
        sourceUrl,
        images,
        userId: data.agentId as Id<"users">,
      })
      
      // Redirect to the new property's detail page
      router.push(`/dashboard/${result.propertyId}`)
    } catch (error) {
      console.error("Failed to create property:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to create property")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {(flowState.step === "url-input" || flowState.step === "scraping") && (
        <UrlInputStep
          onSubmit={handleUrlSubmit}
          onSkip={handleSkip}
          isLoading={flowState.step === "scraping"}
        />
      )}

      {flowState.step === "review" && (
        <ReviewEditStep
          initialAddress={flowState.scrapedData.address}
          initialImages={flowState.scrapedData.images}
          users={flowState.scrapedData.users}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </div>
  )
}
