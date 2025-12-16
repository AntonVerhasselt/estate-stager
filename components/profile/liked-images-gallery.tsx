"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { type SwipeImage } from "@/lib/mock-data/swipe-images"

// ============================================================================
// TYPES
// ============================================================================
type LikedImagesGalleryProps = {
  images: SwipeImage[]
}

// ============================================================================
// COMPONENT
// ============================================================================
export function LikedImagesGallery({ images }: LikedImagesGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }
  
  // Keyboard navigation
  React.useEffect(() => {
    if (!lightboxOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goToNext()
      } else if (e.key === "Escape") {
        setLightboxOpen(false)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen])

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-border bg-muted/30 py-10 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          No liked images yet.
        </p>
      </div>
    )
  }

  const currentImage = images[currentIndex]

  return (
    <>
      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-none ring-1 ring-foreground/10 hover:ring-primary/50 transition-all cursor-pointer"
          >
            <Image
              src={image.imageUrl}
              alt={`${image.style} ${image.roomType}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {/* Style badge */}
            <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-none text-[10px] font-medium capitalize">
              {image.style}
            </div>
          </button>
        ))}
      </div>
      
      {/* Lightbox dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-black">
          <DialogTitle className="sr-only">
            {currentImage?.style} {currentImage?.roomType} image
          </DialogTitle>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-3 right-3 z-50 text-white hover:bg-white/10"
          >
            <X className="size-5" />
          </Button>
          
          {/* Image container */}
          <div className="relative w-full h-[70vh] sm:h-[80vh]">
            {currentImage && (
              <Image
                src={currentImage.imageUrl}
                alt={`${currentImage.style} ${currentImage.roomType}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            )}
            
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/10 size-10"
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/10 size-10"
                >
                  <ChevronRight className="size-6" />
                </Button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
          
          {/* Image info */}
          {currentImage && (
            <div className="px-4 py-3 bg-background border-t border-border">
              <p className="text-sm font-medium capitalize">
                {currentImage.style} · {currentImage.roomType}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
