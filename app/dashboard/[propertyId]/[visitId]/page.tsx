"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  Edit,
  Link2,
  MapPin,
  Phone,
  Play,
  Sparkles,
  User,
  XCircle,
  Palette,
  Share2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  VisitSheet,
  type Visit,
  type VisitStatus,
  type VisitFormData,
} from "@/components/visits/visit-sheet"
import { StyleRadarChart } from "@/components/profile/style-radar-chart"
import {
  StagedImageGallery,
  type StagedImage,
  type RoomType,
} from "@/components/visits/staged-image-gallery"

// ============================================================================
// HELPERS
// ============================================================================
function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

// Map database roomType to StagedImage RoomType
function mapRoomType(
  dbRoomType: "livingRoom" | "kitchen" | "bedroom" | "bathroom" | "garden" | "hall" | "deskArea" | "other"
): RoomType {
  switch (dbRoomType) {
    case "livingRoom":
      return "living"
    case "kitchen":
    case "bedroom":
    case "bathroom":
      return dbRoomType
    case "garden":
    case "hall":
    case "deskArea":
    case "other":
    default:
      return "other"
  }
}

function getStatusBadgeStyle(status: VisitStatus): string {
  switch (status) {
    case "prepared":
      return "bg-primary/15 text-primary"
    case "planned":
      return "bg-muted text-muted-foreground"
    case "completed":
      return "bg-secondary text-secondary-foreground"
    case "cancelled":
      return "bg-destructive/10 text-destructive line-through"
    default:
      return ""
  }
}

function getStatusLabel(status: VisitStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function VisitDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string; visitId: string }>
}) {
  const resolvedParams = React.use(params)
  const router = useRouter()

  // Fetch visit data from database
  const visitData = useQuery(api.visits.get.getVisitById, {
    visitId: resolvedParams.visitId as Id<"visits">,
  })

  // Fetch style profile
  const styleProfile = useQuery(
    api.styleProfiles.get.getStyleProfileByVisit,
    visitData?.visit ? { visitId: visitData.visit._id } : "skip"
  )

  // Mutations
  const cancelVisitMutation = useMutation(api.visits.update.cancelVisit)
  const updateVisitMutation = useMutation(api.visits.update.updateVisit)

  // State
  const [editSheetOpen, setEditSheetOpen] = React.useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [isCancelling, setIsCancelling] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [styleLinkCopied, setStyleLinkCopied] = React.useState(false)
  const [prospectLinkFull, setProspectLinkFull] = React.useState("")
  const [prospectLinkDisplay, setProspectLinkDisplay] = React.useState("")

  // Compute prospect links on client-side only (window is not available during SSR)
  React.useEffect(() => {
    if (visitData?.visit?.prospectLinkId) {
      setProspectLinkFull(`${window.location.origin}/${visitData.visit.prospectLinkId}`)
      setProspectLinkDisplay(`${window.location.host}/${visitData.visit.prospectLinkId}`)
    }
  }, [visitData?.visit?.prospectLinkId])

  // Loading state
  if (visitData === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-sm text-muted-foreground">Loading visit details...</div>
      </div>
    )
  }

  // Handle visit not found
  if (visitData === null) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-lg font-semibold mb-2">Visit not found</h1>
        <p className="text-sm text-muted-foreground mb-4">
          The visit you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="outline">
          <Link href={`/dashboard/${resolvedParams.propertyId}`}>
            <ArrowLeft data-icon="inline-start" />
            Back to property
          </Link>
        </Button>
      </div>
    )
  }

  // Transform data
  const visit: Visit = {
    id: visitData.visit._id,
    startAt: new Date(visitData.visit.startAt),
    prospectName: visitData.visit.prospectName,
    phoneNumber: visitData.visit.phoneNumber,
    status: visitData.visit.status,
  }

  const property = {
    id: visitData.property._id,
    address: visitData.property.address,
  }

  // Map generated images to StagedImage format
  const stagedImages: StagedImage[] = visitData.generatedImages.map((img) => ({
    id: img._id,
    originalImageId: img.originalImageId ?? img._id, // Use actual reference, fallback to self for legacy data
    imageUrl: img.imageUrl,
    roomType: mapRoomType(img.roomType),
    status: "ready" as const,
    createdAt: img._creationTime
      ? new Date(img._creationTime)
      : new Date(visitData.visit.createdAt),
  }))

  const handleEditSubmit = async (data: VisitFormData) => {
    setIsUpdating(true)
    try {
      await updateVisitMutation({
        visitId: resolvedParams.visitId as Id<"visits">,
        prospectName: data.prospectName,
        phoneNumber: data.phoneNumber,
        startAt: data.startAt.getTime(), // Convert Date to Unix timestamp
      })
      setEditSheetOpen(false)
    } catch (error) {
      console.error("Failed to update visit:", error)
      throw error // Re-throw to prevent sheet from closing
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      await cancelVisitMutation({ visitId: resolvedParams.visitId as Id<"visits"> })
      setCancelDialogOpen(false)
    } catch (error) {
      console.error("Failed to cancel visit:", error)
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error("Failed to cancel visit", {
        description: message,
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleDeleteStagedImage = (id: string) => {
    // TODO: Implement delete mutation
    console.log("Delete staged image:", id)
  }

  const handleRegenerateStagedImage = (id: string) => {
    // TODO: Implement regenerate mutation
    console.log("Regenerate staged image:", id)
  }

  const handleGenerateAllImages = () => {
    // TODO: Implement generate all mutation
    console.log("Generate all images")
  }

  const handleCopyStyleLink = async () => {
    if (!prospectLinkDisplay) return
    try {
      await navigator.clipboard.writeText(`https://${prospectLinkDisplay}`)
      setStyleLinkCopied(true)
      setTimeout(() => setStyleLinkCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(prospectLinkFull)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const canStartLiveMode =
    visit.status === "prepared" && stagedImages.length > 0
  const canCancel = visit.status === "planned" || visit.status === "prepared"

  return (
    <>
      <div className="space-y-6">
        {/* Back navigation */}
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href={`/dashboard/${resolvedParams.propertyId}`}>
              <ArrowLeft data-icon="inline-start" />
              Back to property
            </Link>
          </Button>
        </div>

        {/* Header with title and actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Visit with {visit.prospectName}
              </h1>
              <Badge
                variant="secondary"
                className={getStatusBadgeStyle(visit.status)}
              >
                {getStatusLabel(visit.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {property.address}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canCancel && (
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(true)}
              >
                <XCircle data-icon="inline-start" />
                <span className="hidden sm:inline">Cancel visit</span>
                <span className="sm:hidden">Cancel</span>
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditSheetOpen(true)}>
              <Edit data-icon="inline-start" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            {canStartLiveMode && (
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/${resolvedParams.propertyId}/${resolvedParams.visitId}/live`
                  )
                }
              >
                <Play data-icon="inline-start" />
                <span className="hidden sm:inline">Start live visit</span>
                <span className="sm:hidden">Live</span>
              </Button>
            )}
          </div>
        </div>

        {/* Information Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              Visit Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Prospect</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <User className="size-3.5 text-muted-foreground" />
                {visit.prospectName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Phone number</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <Phone className="size-3.5 text-muted-foreground" />
                {visit.phoneNumber}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground" />
                {formatDateTime(visit.startAt)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Prospect link</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium flex items-center gap-2 truncate">
                  <Link2 className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{prospectLinkDisplay}</span>
                </p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {linkCopied ? (
                    <Check className="size-3.5 text-primary" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Style Preferences Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="size-4 text-muted-foreground" />
              Style Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!styleProfile ? (
              <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-border bg-muted/30 py-10 px-4 text-center">
                <div className="mb-3 rounded-none bg-muted p-3">
                  <Clock className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium mb-1">Awaiting style preferences</h3>
                <p className="text-xs text-muted-foreground max-w-xs mb-4">
                  Share the link below so the prospect can swipe through design styles.
                </p>
                {prospectLinkDisplay && (
                  <Button variant="outline" size="sm" onClick={handleCopyStyleLink}>
                    {styleLinkCopied ? (
                      <>
                        <Check data-icon="inline-start" className="text-primary" />
                        Link copied!
                      </>
                    ) : (
                      <>
                        <Share2 data-icon="inline-start" />
                        Copy style quiz link
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <StyleRadarChart 
                scores={styleProfile.scores} 
                gridClassName="grid gap-4 grid-cols-2 lg:grid-cols-4"
              />
            )}
          </CardContent>
        </Card>

        {/* Staged Images Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-muted-foreground" />
              Staged Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StagedImageGallery
              images={stagedImages}
              onDelete={handleDeleteStagedImage}
              onRegenerate={handleRegenerateStagedImage}
              onGenerateAll={handleGenerateAllImages}
              hasStyleProfile={styleProfile !== null && styleProfile !== undefined}
              prospectLink={prospectLinkDisplay}
              visitStatus={visit.status}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Sheet */}
      <VisitSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        mode="edit"
        initialData={visit}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this visit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the visit as cancelled. You can still view the
              visit details but won&apos;t be able to start a live visit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep visit</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                await handleCancel()
              }}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelling..." : "Cancel visit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

