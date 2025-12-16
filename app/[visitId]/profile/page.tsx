"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Palette, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  StylePreferences,
  mockStyleProfile,
} from "@/components/visits/style-preferences"
import { LikedImagesGallery } from "@/components/profile/liked-images-gallery"
import { mockSwipeImages, type SwipeImage } from "@/lib/mock-data/swipe-images"

// ============================================================================
// MOCK DATA FOR PROFILE PAGE
// ============================================================================
// Simulate some liked images from the swipe session
const mockLikedImages: SwipeImage[] = mockSwipeImages.slice(0, 6).filter((_, i) => i % 2 === 0 || i === 1)

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function StyleProfilePage({
  params,
}: {
  params: Promise<{ visitId: string }>
}) {
  const resolvedParams = React.use(params)

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href={`/${resolvedParams.visitId}?continue=true`}>
              <ArrowLeft data-icon="inline-start" />
              Keep refining
            </Link>
          </Button>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Your Style Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Based on your preferences, here&apos;s what we learned about your design taste.
          </p>
        </div>
        
        {/* Style Preferences Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="size-4 text-muted-foreground" />
              Style Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StylePreferences
              profile={mockStyleProfile}
              editable={false}
            />
          </CardContent>
        </Card>
        
        {/* Liked Images Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="size-4 text-muted-foreground" />
              Images You Liked
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({mockLikedImages.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikedImagesGallery images={mockLikedImages} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
