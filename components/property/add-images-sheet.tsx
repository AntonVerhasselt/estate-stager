"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { RoomType } from "@/types/design"
import {
  ImageRoomTypeGrid,
  ImageCountDisplay,
} from "@/components/shared/image-room-type-grid"

// ============================================================================
// TYPES
// ============================================================================
export type PendingImage = {
  id: string
  src: string
  file: File
  roomType: RoomType | null
}

type AddImagesSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialImages: PendingImage[]
  onImagesChange: (images: PendingImage[]) => void
  onSubmit: (images: PendingImage[]) => void
}

// ============================================================================
// HOOKS
// ============================================================================
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

// ============================================================================
// HELPERS
// ============================================================================
function generateId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// COMPONENT
// ============================================================================
export function AddImagesSheet({
  open,
  onOpenChange,
  initialImages,
  onImagesChange,
  onSubmit,
}: AddImagesSheetProps) {
  const isMobile = useMediaQuery("(max-width: 639px)")
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [showValidationErrors, setShowValidationErrors] = React.useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: PendingImage[] = Array.from(files).map((file) => ({
      id: generateId(),
      src: URL.createObjectURL(file),
      file,
      roomType: null,
    }))

    onImagesChange([...initialImages, ...newImages])

    // Reset input so same file can be selected again
    e.target.value = ""
  }

  const handleDelete = (idToDelete: string) => {
    const newImages = initialImages.filter((img) => img.id !== idToDelete)
    onImagesChange(newImages)

    // Auto-close if all images are deleted
    if (newImages.length === 0) {
      onOpenChange(false)
    }
  }

  const handleRoomTypeChange = (id: string, roomType: RoomType) => {
    const newImages = initialImages.map((img) =>
      img.id === id ? { ...img, roomType } : img
    )
    onImagesChange(newImages)
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = () => {
    // Check if all images have room types
    const untaggedCount = initialImages.filter((img) => !img.roomType).length
    if (untaggedCount > 0) {
      setShowValidationErrors(true)
      return
    }

    onSubmit(initialImages)
    setShowValidationErrors(false)
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShowValidationErrors(false)
    }
    onOpenChange(newOpen)
  }

  const untaggedCount = initialImages.filter((img) => !img.roomType).length
  const canSubmit = initialImages.length > 0 && untaggedCount === 0

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          isMobile ? "max-h-[85vh] overflow-y-auto" : "sm:max-w-md overflow-y-auto"
        )}
      >
        <SheetHeader>
          <SheetTitle>Add images</SheetTitle>
          <SheetDescription>
            Select room types for each image before adding them to the property.
          </SheetDescription>
        </SheetHeader>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="sr-only"
        />

        {/* Image grid */}
        <div className="p-4 overflow-y-auto flex-1">
          <ImageRoomTypeGrid
            images={initialImages}
            getKey={(image) => image.id}
            onDelete={(image) => handleDelete(image.id)}
            onRoomTypeChange={(image, _index, roomType) =>
              handleRoomTypeChange(image.id, roomType)
            }
            onAddMore={openFilePicker}
            showValidationErrors={showValidationErrors}
            columns={2}
          />
          <ImageCountDisplay
            count={initialImages.length}
            untaggedCount={untaggedCount}
            showValidationErrors={showValidationErrors}
          />
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full sm:w-auto"
          >
            Add images
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
