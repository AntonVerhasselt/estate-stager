"use client"

import * as React from "react"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageGallery, type PropertyImage } from "./image-gallery"

// Mock agents data
type Agent = {
  id: string
  name: string
  avatar: string
  initials: string
}

const MOCK_AGENTS: Agent[] = [
  { id: "1", name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop", initials: "SJ" },
  { id: "2", name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop", initials: "MC" },
  { id: "3", name: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop", initials: "ED" },
  { id: "4", name: "James Wilson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop", initials: "JW" },
  { id: "5", name: "Lisa Martinez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop", initials: "LM" },
]

type ReviewEditStepProps = {
  initialAddress: string | null
  initialImages: PropertyImage[]
  onBack: () => void
  onSubmit: (data: { address: string; images: PropertyImage[]; agentId: string }) => void
}

export function ReviewEditStep({
  initialAddress,
  initialImages,
  onBack,
  onSubmit,
}: ReviewEditStepProps) {
  const [address, setAddress] = React.useState<string>(initialAddress || "")
  const [images, setImages] = React.useState<PropertyImage[]>(initialImages)
  const [agentId, setAgentId] = React.useState<string | null>(null)
  const [addressError, setAddressError] = React.useState<string | null>(null)
  const [imagesError, setImagesError] = React.useState<string | null>(null)
  const [agentError, setAgentError] = React.useState<string | null>(null)
  const [showImageValidationErrors, setShowImageValidationErrors] = React.useState(false)

  // Get selected agent for display
  const selectedAgent = MOCK_AGENTS.find((a) => a.id === agentId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let hasError = false
    
    // Validate address
    if (!address.trim()) {
      setAddressError("Please enter a property address")
      hasError = true
    } else {
      setAddressError(null)
    }
    
    // Validate images (at least 1 required)
    if (images.length === 0) {
      setImagesError("Please upload at least one image")
      hasError = true
    } else {
      // Validate all images have a room type
      const untaggedCount = images.filter((img) => !img.roomType).length
      if (untaggedCount > 0) {
        setImagesError(`Please select a room type for all images (${untaggedCount} remaining)`)
        setShowImageValidationErrors(true)
        hasError = true
      } else {
        setImagesError(null)
      }
    }
    
    // Validate agent
    if (!agentId) {
      setAgentError("Please select an agent")
      hasError = true
    } else {
      setAgentError(null)
    }
    
    if (hasError) return
    
    // TypeScript: We've validated that address is not empty and agentId is not null
    onSubmit({ address: address.trim(), images, agentId: agentId! })
  }

  // Clear error when all images are properly tagged
  const handleImagesChange = (newImages: PropertyImage[]) => {
    setImages(newImages)
    
    // Clear image count error if images exist
    if (newImages.length > 0 && imagesError === "Please upload at least one image") {
      setImagesError(null)
    }
    
    // Clear room type validation if all images are now tagged
    if (showImageValidationErrors) {
      const untaggedCount = newImages.filter((img) => !img.roomType).length
      if (untaggedCount === 0) {
        setImagesError(null)
        setShowImageValidationErrors(false)
      }
    }
  }

  return (
    <div className="py-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
        >
          <ArrowLeftIcon className="size-4" />
          <span className="sr-only">Go back</span>
        </Button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Review Property Details
          </h1>
          <p className="text-xs text-muted-foreground">
            Step 2 of 2 &mdash; Review and edit the property information
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Address Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium">
            Property Address <span className="text-destructive">*</span>
          </h2>
          <Input
            type="text"
            placeholder="123 Main Street, City, State ZIP"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              if (addressError) setAddressError(null)
            }}
            aria-invalid={!!addressError}
          />
          {addressError && <FieldError>{addressError}</FieldError>}
        </div>

        {/* Images Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium">
            Property Images <span className="text-destructive">*</span>
          </h2>
          <ImageGallery 
            images={images} 
            onImagesChange={handleImagesChange}
            showValidationErrors={showImageValidationErrors}
          />
          {imagesError && (
            <p className="text-xs text-destructive">{imagesError}</p>
          )}
        </div>

        {/* Agent Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium">
            Assigned Agent <span className="text-destructive">*</span>
          </h2>
          <Select
            value={agentId || ""}
            onValueChange={(value) => {
              setAgentId(value)
              if (agentError) setAgentError(null)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an agent...">
                {selectedAgent && (
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                      <AvatarFallback>{selectedAgent.initials}</AvatarFallback>
                    </Avatar>
                    <span>{selectedAgent.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MOCK_AGENTS.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>{agent.initials}</AvatarFallback>
                    </Avatar>
                    <span>{agent.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {agentError && <FieldError>{agentError}</FieldError>}
        </div>

        {/* Submit Button - Sticky on mobile */}
        <div className="pt-4 border-t">
          <Button type="submit" className="w-full sm:w-auto">
            Add Property
          </Button>
        </div>
      </form>
    </div>
  )
}
