"use client"

import * as React from "react"
import Image from "next/image"
import {
  Sparkles,
  Trash2,
  RefreshCw,
  Sofa,
  ChefHat,
  BedDouble,
  Bath,
  Image as ImageIcon,
  Wand2,
  Share2,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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

// ============================================================================
// TYPES
// ============================================================================
export type RoomType = "living" | "kitchen" | "bedroom" | "bathroom" | "other"

export type StagedImage = {
  id: string
  originalPictureId: string
  imageUrl: string
  roomType: RoomType
  status: "generating" | "ready" | "failed"
  createdAt: Date
}

type StagedImageGalleryProps = {
  images: StagedImage[]
  onDelete: (id: string) => void
  onRegenerate: (id: string) => void
  onGenerateAll?: () => void
  hasStyleProfile: boolean
  prospectLink?: string
}

// ============================================================================
// HELPERS
// ============================================================================
function getRoomTypeLabel(roomType: RoomType): string {
  const labels: Record<RoomType, string> = {
    living: "Living room",
    kitchen: "Kitchen",
    bedroom: "Bedroom",
    bathroom: "Bathroom",
    other: "Other",
  }
  return labels[roomType]
}

function getRoomTypeIcon(roomType: RoomType) {
  const icons: Record<RoomType, React.ReactNode> = {
    living: <Sofa className="size-3" />,
    kitchen: <ChefHat className="size-3" />,
    bedroom: <BedDouble className="size-3" />,
    bathroom: <Bath className="size-3" />,
    other: <ImageIcon className="size-3" />,
  }
  return icons[roomType]
}

// ============================================================================
// COMPONENTS
// ============================================================================
function EmptyState({
  hasStyleProfile,
  onGenerateAll,
  prospectLink,
}: {
  hasStyleProfile: boolean
  onGenerateAll?: () => void
  prospectLink?: string
}) {
  const [linkCopied, setLinkCopied] = React.useState(false)

  const handleShareLink = async () => {
    if (!prospectLink) return
    try {
      await navigator.clipboard.writeText(`https://${prospectLink}`)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  if (!hasStyleProfile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-border bg-muted/30 py-10 px-4 text-center">
        <div className="mb-3 rounded-none bg-muted p-3">
          <Sparkles className="size-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium mb-1">No staged images yet</h3>
        <p className="text-xs text-muted-foreground max-w-xs mb-4">
          Images will be generated after the prospect completes their style quiz.
        </p>
        {prospectLink && (
          <Button variant="outline" size="sm" onClick={handleShareLink}>
            {linkCopied ? (
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
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-border bg-muted/30 py-10 px-4 text-center">
      <div className="mb-3 rounded-none bg-primary/10 p-3">
        <Wand2 className="size-6 text-primary" />
      </div>
      <h3 className="text-sm font-medium mb-1">Ready to generate</h3>
      <p className="text-xs text-muted-foreground mb-4 max-w-xs">
        Style preferences received. Generate personalized staged images for this
        prospect.
      </p>
      <Button onClick={onGenerateAll}>
        <Sparkles data-icon="inline-start" />
        Generate images
      </Button>
    </div>
  )
}

function StagedImageCard({
  image,
  onDelete,
  onRegenerate,
}: {
  image: StagedImage
  onDelete: (id: string) => void
  onRegenerate: (id: string) => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [isRegenerating, setIsRegenerating] = React.useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    onRegenerate(image.id)
    // Simulate regeneration delay
    setTimeout(() => setIsRegenerating(false), 2000)
  }

  const isGenerating = image.status === "generating" || isRegenerating

  return (
    <>
      <div className="group relative aspect-[4/3] overflow-hidden rounded-none border border-border bg-muted">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="size-5 text-muted-foreground animate-spin" />
              <span className="text-xs text-muted-foreground">Generating...</span>
            </div>
          </div>
        ) : image.status === "failed" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/5">
            <div className="flex flex-col items-center gap-2 text-center px-2">
              <span className="text-xs text-destructive">Generation failed</span>
              <Button size="xs" variant="outline" onClick={handleRegenerate}>
                <RefreshCw data-icon="inline-start" />
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <Image
            src={image.imageUrl}
            alt={getRoomTypeLabel(image.roomType)}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Room type badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-none text-xs">
          {getRoomTypeIcon(image.roomType)}
          <span>{getRoomTypeLabel(image.roomType)}</span>
        </div>

        {/* Hover actions */}
        {image.status === "ready" && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={handleRegenerate}
              title="Regenerate"
            >
              <RefreshCw className="size-3.5" />
            </Button>
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete staged image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this staged image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(image.id)
                setShowDeleteConfirm(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function StagedImageGallery({
  images,
  onDelete,
  onRegenerate,
  onGenerateAll,
  hasStyleProfile,
  prospectLink,
}: StagedImageGalleryProps) {
  if (images.length === 0) {
    return (
      <EmptyState
        hasStyleProfile={hasStyleProfile}
        onGenerateAll={onGenerateAll}
        prospectLink={prospectLink}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {images.map((image) => (
        <StagedImageCard
          key={image.id}
          image={image}
          onDelete={onDelete}
          onRegenerate={onRegenerate}
        />
      ))}
    </div>
  )
}

// ============================================================================
// MOCK DATA
// ============================================================================
export const mockStagedImages: StagedImage[] = [
  {
    id: "si1",
    originalPictureId: "p1",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
    roomType: "living",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si2",
    originalPictureId: "p2",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    roomType: "kitchen",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si3",
    originalPictureId: "p3",
    imageUrl:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&auto=format&fit=crop",
    roomType: "bedroom",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si4",
    originalPictureId: "p4",
    imageUrl:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop",
    roomType: "bathroom",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si5",
    originalPictureId: "p5",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
    roomType: "living",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si6",
    originalPictureId: "p6",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
    roomType: "other",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
]

