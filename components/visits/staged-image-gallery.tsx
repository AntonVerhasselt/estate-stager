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
  Eye,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type VisitStatus } from "@/components/visits/visit-sheet"

// ============================================================================
// TYPES
// ============================================================================
export type RoomType = "living" | "kitchen" | "bedroom" | "bathroom" | "other"

export type StagedImage = {
  id: string
  originalImageId: string
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
  visitStatus?: VisitStatus
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
  visitStatus,
}: {
  image: StagedImage
  onDelete: (id: string) => void
  onRegenerate: (id: string) => void
  visitStatus?: VisitStatus
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [isRegenerating, setIsRegenerating] = React.useState(false)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    onRegenerate(image.id)
    setLightboxOpen(false)
    // Simulate regeneration delay
    setTimeout(() => setIsRegenerating(false), 2000)
  }

  const handleDelete = () => {
    onDelete(image.id)
    setShowDeleteConfirm(false)
    setLightboxOpen(false)
  }

  const isGenerating = image.status === "generating" || isRegenerating
  const canPerformActions = visitStatus !== "cancelled" && visitStatus !== "completed"

  return (
    <>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogTrigger asChild>
          <div className="group relative aspect-[4/3] overflow-hidden rounded-none border border-border bg-muted cursor-pointer">
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
                  <Button size="xs" variant="outline" onClick={(e) => {
                    e.stopPropagation()
                    handleRegenerate()
                  }}>
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

            {/* Hover overlay with eye icon */}
            {image.status === "ready" && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="size-6 text-white drop-shadow-md" />
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getRoomTypeIcon(image.roomType)}
              {getRoomTypeLabel(image.roomType)}
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none">
            <Image
              src={image.imageUrl}
              alt={getRoomTypeLabel(image.roomType)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {canPerformActions && (
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full sm:w-auto"
              >
                <Trash2 data-icon="inline-start" />
                Delete
              </Button>
              <Button
                onClick={handleRegenerate}
                className="w-full sm:w-auto"
              >
                <RefreshCw data-icon="inline-start" />
                Regenerate
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

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
              onClick={handleDelete}
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
  visitStatus,
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
          visitStatus={visitStatus}
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
    originalImageId: "p1",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
    roomType: "living",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si2",
    originalImageId: "p2",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    roomType: "kitchen",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si3",
    originalImageId: "p3",
    imageUrl:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&auto=format&fit=crop",
    roomType: "bedroom",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si4",
    originalImageId: "p4",
    imageUrl:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop",
    roomType: "bathroom",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si5",
    originalImageId: "p5",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
    roomType: "living",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "si6",
    originalImageId: "p6",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
    roomType: "other",
    status: "ready",
    createdAt: new Date("2025-12-15"),
  },
]

