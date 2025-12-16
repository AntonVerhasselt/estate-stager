"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

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
import {
  StylePreferences,
  mockStyleProfile,
  type StyleProfile,
  type StylePreference,
} from "@/components/visits/style-preferences"
import {
  StagedImageGallery,
  mockStagedImages,
  type StagedImage,
} from "@/components/visits/staged-image-gallery"

// ============================================================================
// TYPES
// ============================================================================
type Property = {
  id: string
  address: string
}

// ============================================================================
// MOCK DATA
// ============================================================================
const mockProperty: Property = {
  id: "1",
  address: "123 Oak Street, Brooklyn, NY 11201",
}

const mockVisits: Record<string, Visit> = {
  v1: {
    id: "v1",
    startAt: new Date("2025-12-16T10:00:00"),
    prospectName: "Sarah Johnson",
    phoneNumber: "471234567",
    countryCode: "+32",
    status: "prepared",
  },
  v2: {
    id: "v2",
    startAt: new Date("2025-12-14T14:30:00"),
    prospectName: "Michael Chen",
    phoneNumber: "612345678",
    countryCode: "+31",
    status: "completed",
  },
  v3: {
    id: "v3",
    startAt: new Date("2025-12-12T11:00:00"),
    prospectName: "Emily Davis",
    phoneNumber: "678901234",
    countryCode: "+33",
    status: "cancelled",
  },
  v4: {
    id: "v4",
    startAt: new Date("2025-12-18T16:00:00"),
    prospectName: "Amanda Brown",
    phoneNumber: "491234567",
    countryCode: "+32",
    status: "planned",
  },
}

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

function formatPhoneNumber(countryCode: string, phoneNumber: string): string {
  return `${countryCode} ${phoneNumber}`
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

  // Get mock visit data
  const initialVisit = mockVisits[resolvedParams.visitId]

  // Generate prospect link
  const prospectLink = `estager.com/${resolvedParams.visitId}`

  // State
  const [visit, setVisit] = React.useState<Visit | null>(initialVisit || null)
  const [editSheetOpen, setEditSheetOpen] = React.useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [styleProfile, setStyleProfile] = React.useState<StyleProfile | null>(
    // Only show style profile for "prepared" or "completed" visits
    initialVisit?.status === "prepared" || initialVisit?.status === "completed"
      ? mockStyleProfile
      : null
  )
  const [stagedImages, setStagedImages] = React.useState<StagedImage[]>(
    // Only show staged images for "prepared" or "completed" visits
    initialVisit?.status === "prepared" || initialVisit?.status === "completed"
      ? mockStagedImages
      : []
  )

  // Handle visit not found
  if (!visit) {
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

  const handleEditSubmit = (data: VisitFormData) => {
    setVisit((prev) => (prev ? { ...prev, ...data } : null))
    setEditSheetOpen(false)
  }

  const handleCancel = () => {
    setVisit((prev) => (prev ? { ...prev, status: "cancelled" } : null))
    setCancelDialogOpen(false)
  }

  const handleDeleteStagedImage = (id: string) => {
    setStagedImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleRegenerateStagedImage = (id: string) => {
    setStagedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, status: "generating" as const } : img
      )
    )
    // Simulate regeneration
    setTimeout(() => {
      setStagedImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, status: "ready" as const } : img
        )
      )
    }, 2000)
  }

  const handleGenerateAllImages = () => {
    // Simulate generating images
    setStagedImages(
      mockStagedImages.map((img) => ({ ...img, status: "generating" as const }))
    )
    setTimeout(() => {
      setStagedImages(mockStagedImages)
    }, 2000)
  }

  const handleUpdateStylePreferences = (preferences: StylePreference[]) => {
    setStyleProfile((prev) => (prev ? { ...prev, preferences } : null))
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${prospectLink}`)
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
              {mockProperty.address}
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
                {formatPhoneNumber(visit.countryCode, visit.phoneNumber)}
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
                  <span className="truncate">{prospectLink}</span>
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
            <StylePreferences
              profile={styleProfile}
              onUpdate={handleUpdateStylePreferences}
              editable={visit.status === "prepared"}
              prospectLink={prospectLink}
            />
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
              hasStyleProfile={styleProfile !== null}
              prospectLink={prospectLink}
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
            <AlertDialogCancel>Keep visit</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel visit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

