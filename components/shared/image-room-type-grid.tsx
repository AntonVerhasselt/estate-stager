"use client"

import * as React from "react"
import { Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RoomType,
  ROOM_TYPE_OPTIONS,
} from "@/components/add-property/image-gallery"

// ============================================================================
// TYPES
// ============================================================================
export type ImageGridItem = {
  src: string
  roomType: RoomType | null
}

type ImageRoomTypeGridProps<T extends ImageGridItem> = {
  images: T[]
  getKey: (image: T, index: number) => string
  onDelete: (image: T, index: number) => void
  onRoomTypeChange: (image: T, index: number, roomType: RoomType) => void
  onAddMore?: () => void
  showValidationErrors?: boolean
  columns?: 2 | 3 | 4
}

// ============================================================================
// COMPONENT
// ============================================================================
export function ImageRoomTypeGrid<T extends ImageGridItem>({
  images,
  getKey,
  onDelete,
  onRoomTypeChange,
  onAddMore,
  showValidationErrors = false,
  columns = 2,
}: ImageRoomTypeGridProps<T>) {
  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[columns]

  return (
    <div className={cn("grid gap-3", gridColsClass)}>
      {images.map((image, index) => {
        const hasError = showValidationErrors && !image.roomType
        const key = getKey(image, index)

        return (
          <div
            key={key}
            className={cn(
              "flex flex-col ring-1 ring-foreground/10 overflow-hidden",
              hasError && "ring-destructive"
            )}
          >
            {/* Image with delete button - square crop */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={image.src}
                alt={`Image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Delete button - always visible */}
              <button
                type="button"
                onClick={() => onDelete(image, index)}
                className="absolute top-1.5 right-1.5 p-1.5 bg-black/40 hover:bg-black/60 rounded-sm transition-colors"
              >
                <Trash2 className="size-4 text-white" />
                <span className="sr-only">Delete image</span>
              </button>
            </div>

            {/* Room type select */}
            <Select
              value={image.roomType || undefined}
              onValueChange={(value) =>
                onRoomTypeChange(image, index, value as RoomType)
              }
            >
              <SelectTrigger
                className={cn(
                  "w-full border-0 border-t rounded-none ring-0 focus-visible:ring-0",
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
      {onAddMore && (
        <button
          type="button"
          onClick={onAddMore}
          className={cn(
            "aspect-square border-2 border-dashed border-input rounded-none",
            "flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:border-foreground/30",
            "transition-colors cursor-pointer"
          )}
        >
          <Plus className="size-6" />
          <span className="sr-only">Add more images</span>
        </button>
      )}
    </div>
  )
}

// ============================================================================
// IMAGE COUNT DISPLAY
// ============================================================================
type ImageCountDisplayProps = {
  count: number
  untaggedCount: number
  showValidationErrors?: boolean
}

export function ImageCountDisplay({
  count,
  untaggedCount,
  showValidationErrors = false,
}: ImageCountDisplayProps) {
  return (
    <p className="text-xs text-muted-foreground mt-2">
      {count} image{count !== 1 ? "s" : ""} selected
      {untaggedCount > 0 && (
        <span className={cn(showValidationErrors && "text-destructive")}>
          {" "}
          &middot; {untaggedCount} need{untaggedCount === 1 ? "s" : ""} a room
          type
        </span>
      )}
    </p>
  )
}
