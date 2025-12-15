"use client"

import * as React from "react"
import { LinkIcon, LoaderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

type UrlInputStepProps = {
  onSubmit: (url: string) => void
  onSkip: () => void
  isLoading: boolean
}

export function UrlInputStep({ onSubmit, onSkip, isLoading }: UrlInputStepProps) {
  const [url, setUrl] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError("Please enter a URL")
      return false
    }
    
    try {
      new URL(value)
      setError(null)
      return true
    } catch {
      setError("Please enter a valid URL")
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateUrl(url)) {
      onSubmit(url)
    }
  }

  return (
    <div className="py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Add New Property
        </h1>
        <p className="text-muted-foreground text-sm">
          Paste the property listing URL to automatically fetch the address and images
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field data-invalid={!!error}>
          <FieldLabel>Property Listing URL</FieldLabel>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <LinkIcon className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type="url"
              placeholder="https://realestate.example.com/listing/123"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              disabled={isLoading}
              aria-invalid={!!error}
            />
          </InputGroup>
          {error && <FieldError>{error}</FieldError>}
        </Field>

        <div className="flex flex-col gap-3">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <LoaderIcon className="size-4 animate-spin" />
                Fetching property details...
              </>
            ) : (
              "Fetch Property Details"
            )}
          </Button>
          
          <button
            type="button"
            onClick={onSkip}
            disabled={isLoading}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Skip, enter details manually
          </button>
        </div>
      </form>

      {/* Loading skeleton preview */}
      {isLoading && (
        <div className="mt-8 space-y-4 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
