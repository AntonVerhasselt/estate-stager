"use client"

import * as React from "react"
import { Trash2Icon, PlusIcon, UploadIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Room type definitions
export type RoomType =
  | "living-room"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "garden"
  | "hall"
  | "desk-area"
  | "other"

export type PropertyImage = {
  src: string
  roomType: RoomType | null
}

export const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = [
  { value: "living-room", label: "Living Room" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bedroom", label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
  { value: "garden", label: "Garden" },
  { value: "hall", label: "Hall" },
  { value: "desk-area", label: "Desk Area" },
  { value: "other", label: "Other" },
]

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

  const handleDelete = (indexToDelete: number) => {
    const newImages = images.filter((_, index) => index !== indexToDelete)
    onImagesChange(newImages)
  }

  const handleRoomTypeChange = (index: number, roomType: RoomType) => {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => {
          const hasError = showValidationErrors && !image.roomType
          return (
            <div
              key={`${image.src}-${index}`}
              className={cn(
                "flex flex-col ring-1 ring-foreground/10 overflow-hidden",
                hasError && "ring-destructive"
              )}
            >
              {/* Image with delete overlay */}
              <div className="relative aspect-square group">
                <img
                  src={image.src}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-black/20 rounded-sm"
                  >
                    <Trash2Icon className="size-4 text-white" />
                    <span className="sr-only">Delete image</span>
                  </button>
                </div>
              </div>

              {/* Room type select */}
              <Select
                value={image.roomType || undefined}
                onValueChange={(value) => handleRoomTypeChange(index, value as RoomType)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full border-0 border-t ring-0 focus-visible:ring-0",
                    hasError && "border-destructive"
                  )}
                >
                  <SelectValue placeholder="Select room..." />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        })}
        
        {/* Add more button */}
        <button
          type="button"
          onClick={openFilePicker}
          className={cn(
            "aspect-square border-2 border-dashed border-input rounded-none",
            "flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:border-foreground/30",
            "transition-colors cursor-pointer"
          )}
        >
          <PlusIcon className="size-6" />
          <span className="sr-only">Add more images</span>
        </button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        {images.length} image{images.length !== 1 ? "s" : ""} selected
        {untaggedCount > 0 && (
          <span className={cn(showValidationErrors && "text-destructive")}>
            {" "}&middot; {untaggedCount} need{untaggedCount === 1 ? "s" : ""} a room type
          </span>
        )}
      </p>
    </div>
  )
}
