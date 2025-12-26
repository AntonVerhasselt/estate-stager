"use client"

import * as React from "react"
import { UploadIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ImageRoomTypeGrid,
  ImageCountDisplay,
} from "@/components/shared/image-room-type-grid"
import type { RoomType } from "@/types/design"
import { ROOM_TYPE_OPTIONS } from "@/types/design"

export type PropertyImage = {
  src: string
  roomType: RoomType | null
}

type ImageGalleryProps = {
  images: PropertyImage[]
  onImagesChange: (images: PropertyImage[]) => void
  showValidationErrors?: boolean
}

export function ImageGallery({ 
  images, 
  onImagesChange,
  showValidationErrors = false,
}: ImageGalleryProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Create blob URLs for preview with null roomType
    const newImages: PropertyImage[] = Array.from(files).map((file) => ({
      src: URL.createObjectURL(file),
      roomType: null,
    }))
    
    onImagesChange([...images, ...newImages])
    
    // Reset input so same file can be selected again
    e.target.value = ""
  }

  const handleDelete = (_image: PropertyImage, index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleRoomTypeChange = (_image: PropertyImage, index: number, roomType: RoomType) => {
    const newImages = images.map((img, i) =>
      i === index ? { ...img, roomType } : img
    )
    onImagesChange(newImages)
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  // Count untagged images
  const untaggedCount = images.filter((img) => !img.roomType).length

  // Hidden file input
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      multiple
      onChange={handleFileSelect}
      className="sr-only"
    />
  )

  // Empty state
  if (images.length === 0) {
    return (
      <div>
        {fileInput}
        <button
          type="button"
          onClick={openFilePicker}
          className={cn(
            "w-full border-2 border-dashed border-input rounded-none p-8",
            "flex flex-col items-center justify-center gap-2",
            "text-muted-foreground hover:text-foreground hover:border-foreground/30",
            "transition-colors cursor-pointer"
          )}
        >
          <UploadIcon className="size-8" />
          <span className="text-sm font-medium">Click to upload images</span>
          <span className="text-xs">PNG, JPG, WEBP up to 10MB each</span>
        </button>
      </div>
    )
  }

  // Gallery with images
  return (
    <div>
      {fileInput}
      <ImageRoomTypeGrid
        images={images}
        getKey={(image, index) => `${image.src}-${index}`}
        onDelete={handleDelete}
        onRoomTypeChange={handleRoomTypeChange}
        onAddMore={openFilePicker}
        showValidationErrors={showValidationErrors}
        columns={4}
      />
      <ImageCountDisplay
        count={images.length}
        untaggedCount={untaggedCount}
        showValidationErrors={showValidationErrors}
      />
    </div>
  )
}
