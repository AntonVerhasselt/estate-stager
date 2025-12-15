"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { UrlInputStep } from "@/components/add-property/url-input-step"
import { ReviewEditStep } from "@/components/add-property/review-edit-step"
import type { PropertyImage } from "@/components/add-property/image-gallery"

// Mock scrape results for different scenarios
const MOCK_SCRAPE_RESULTS: Record<string, { address: string | null; images: PropertyImage[] }> = {
  // Full success - both address and images
  "https://realestate.example.com/listing/123": {
    address: "742 Evergreen Terrace, Springfield, IL 62701",
    images: [
      { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop", roomType: null },
      { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop", roomType: null },
      { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop", roomType: null },
      { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop", roomType: null },
    ],
  },
  // Only address, no images
  "https://realestate.example.com/listing/456": {
    address: "123 Main Street, Boston, MA 02101",
    images: [],
  },
  // Only images, no address
  "https://realestate.example.com/listing/789": {
    address: null,
    images: [
      { src: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop", roomType: null },
      { src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop", roomType: null },
    ],
  },
}

// Default result when URL doesn't match any mock
const DEFAULT_SCRAPE_RESULT: ScrapedData = { address: null, images: [] }

type ScrapedData = {
  address: string | null
  images: PropertyImage[]
}

type FlowState =
  | { step: "url-input" }
  | { step: "scraping" }
  | { step: "review"; scrapedData: ScrapedData }

async function simulateScrape(url: string): Promise<ScrapedData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  // Return mock data based on URL, or default if not found
  return MOCK_SCRAPE_RESULTS[url] || DEFAULT_SCRAPE_RESULT
}

export default function NewPropertyPage() {
  const router = useRouter()
  const [flowState, setFlowState] = React.useState<FlowState>({ step: "url-input" })

  const handleUrlSubmit = async (url: string) => {
    setFlowState({ step: "scraping" })
    
    try {
      const scrapedData = await simulateScrape(url)
      setFlowState({ step: "review", scrapedData })
    } catch (error) {
      // On error, go to review with empty data
      setFlowState({
        step: "review",
        scrapedData: { address: null, images: [] },
      })
    }
  }

  const handleSkip = () => {
    setFlowState({
      step: "review",
      scrapedData: { address: null, images: [] },
    })
  }

  const handleBack = () => {
    setFlowState({ step: "url-input" })
  }

  const handleSubmit = (data: { address: string; images: PropertyImage[]; agentId: string }) => {
    // Mock save - in production this would call an API
    console.log("Saving property:", data)
    
    // Mock: Generate a new property ID (simulating DB response)
    const newPropertyId = crypto.randomUUID()
    console.log("Created property with ID:", newPropertyId)
    
    // Redirect to the new property's detail page
    router.push(`/dashboard/${newPropertyId}`)
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
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
