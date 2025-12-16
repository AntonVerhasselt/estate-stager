"use client"

import * as React from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Sofa,
  ChefHat,
  BedDouble,
  Bath,
  Image as ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ============================================================================
// TYPES
// ============================================================================
export type RoomType = "living" | "kitchen" | "bedroom" | "bathroom" | "other"

export type CarouselImage = {
  id: string
  imageUrl: string
  roomType: RoomType
}

type ImageCarouselProps = {
  images: CarouselImage[]
  onImageChange?: (index: number) => void
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
    living: <Sofa className="size-4" />,
    kitchen: <ChefHat className="size-4" />,
    bedroom: <BedDouble className="size-4" />,
    bathroom: <Bath className="size-4" />,
    other: <ImageIcon className="size-4" />,
  }
  return icons[roomType]
}

// ============================================================================
// COMPONENT
// ============================================================================
export function ImageCarousel({ images, onImageChange }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const currentImage = images[currentIndex]

  const goToIndex = React.useCallback(
    (index: number) => {
      const newIndex = Math.max(0, Math.min(index, images.length - 1))
      setCurrentIndex(newIndex)
      onImageChange?.(newIndex)
    },
    [images.length, onImageChange]
  )

  const goToPrevious = React.useCallback(() => {
    goToIndex(currentIndex - 1)
  }, [currentIndex, goToIndex])

  const goToNext = React.useCallback(() => {
    goToIndex(currentIndex + 1)
  }, [currentIndex, goToIndex])

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrevious, goToNext])

  // Touch handling for swipe
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main image area */}
      <div
        className="relative flex-1 bg-black"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={currentImage.imageUrl}
          alt={getRoomTypeLabel(currentImage.roomType)}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />

        {/* Room type badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-none text-sm shadow-lg">
          {getRoomTypeIcon(currentImage.roomType)}
          <span className="font-medium">
            {getRoomTypeLabel(currentImage.roomType)}
          </span>
        </div>

        {/* Image counter */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-none text-sm shadow-lg">
          <span className="font-medium">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        {/* Navigation arrows - desktop */}
        <div className="hidden sm:flex absolute inset-y-0 left-0 items-center pl-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="rounded-full shadow-lg"
          >
            <ChevronLeft />
          </Button>
        </div>
        <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex === images.length - 1}
            className="rounded-full shadow-lg"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="bg-background border-t border-border">
        <div className="flex overflow-x-auto gap-2 p-3 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToIndex(index)}
              className={cn(
                "relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-none border-2 transition-all",
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <Image
                src={image.imageUrl}
                alt={getRoomTypeLabel(image.roomType)}
                fill
                className="object-cover"
                sizes="80px"
              />
              {/* Small room type indicator */}
              <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm py-0.5 text-center">
                <span className="text-[10px] font-medium truncate px-1">
                  {getRoomTypeLabel(image.roomType).split(" ")[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

