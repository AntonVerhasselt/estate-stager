"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { ArrowLeft, Palette, Heart, Loader2 } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StyleRadarChart } from "@/components/profile/style-radar-chart"
import { LikedImagesGallery } from "@/components/profile/liked-images-gallery"

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function StyleProfilePage({
  params,
}: {
  params: Promise<{ visitId: string }>
}) {
  const resolvedParams = React.use(params)
  
  // The URL param is actually the prospectLinkId
  const prospectLinkId = resolvedParams.visitId
  
  // Fetch visit data from backend using prospectLinkId
  const visit = useQuery(
    api.visits.get.getVisitByProspectLink,
    { prospectLinkId }
  )
  
  const visitId = visit?._id ?? null
  
  // Fetch style profile
  const styleProfile = useQuery(
    api.styleProfiles.get.getStyleProfileByVisit,
    visitId ? { visitId } : "skip"
  )
  
  // Fetch liked images
  const likedImages = useQuery(
    api.swipes.list.listLikedSwipesForVisit,
    visitId ? { visitId } : "skip"
  )
  
  // Loading state
  if (visit === undefined || (visitId && styleProfile === undefined)) {
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
  
  // No style profile yet
  if (!styleProfile) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="-ml-2">
              <Link href={`/${prospectLinkId}?continue=true`}>
                <ArrowLeft data-icon="inline-start" />
                Continue swiping
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Palette className="size-12 text-muted-foreground/50 mb-4" />
            <h1 className="text-xl font-semibold mb-2">No Style Profile Yet</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Keep swiping to build your personalized style profile.
            </p>
            <Button asChild>
              <Link href={`/${prospectLinkId}?continue=true`}>
                Start Swiping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href={`/${prospectLinkId}?continue=true`}>
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
            Based on {styleProfile.swipeCount} swipes, here&apos;s what we learned about your design taste.
          </p>
        </div>
        
        {/* Style Preferences Card with Radar Charts */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="size-4 text-muted-foreground" />
              Style Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StyleRadarChart scores={styleProfile.scores} />
          </CardContent>
        </Card>
        
        {/* Liked Images Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="size-4 text-muted-foreground" />
              Images You Liked
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({likedImages?.length ?? 0})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikedImagesGallery images={likedImages ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
