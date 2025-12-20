"use client"

import * as React from "react"
import { CalendarPlus, Phone, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// ============================================================================
// TYPES
// ============================================================================
export type VisitStatus = "planned" | "prepared" | "completed" | "cancelled"

export type Visit = {
  id: string
  startAt: Date
  prospectName: string
  phoneNumber: string // Full phone number including country code
  status: VisitStatus
}

export type VisitFormData = Omit<Visit, "id" | "status">

type VisitSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialData?: Partial<Visit>
  onSubmit: (data: VisitFormData) => void | Promise<void>
  isSubmitting?: boolean
}

// ============================================================================
// CONSTANTS
// ============================================================================
const COUNTRY_CODES = [
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1", country: "US", flag: "🇺🇸" },
]

// ============================================================================
// HELPERS
// ============================================================================
function getMinDateTime(): string {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

function formatDateTimeForInput(date: Date): string {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
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
// COMPONENT
// ============================================================================
export function VisitSheet({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
}: VisitSheetProps) {
  const isMobile = useMediaQuery("(max-width: 639px)")
  const [prospectName, setProspectName] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [dateTime, setDateTime] = React.useState("")

  // Initialize form with initial data when editing
  React.useEffect(() => {
    if (open && initialData) {
      setProspectName(initialData.prospectName || "")
      setPhoneNumber(initialData.phoneNumber || "")
      if (initialData.startAt) {
        setDateTime(formatDateTimeForInput(initialData.startAt))
      }
    }
  }, [open, initialData])

  const resetForm = () => {
    setProspectName("")
    setPhoneNumber("")
    setDateTime("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prospectName || !phoneNumber || !dateTime) return

    try {
      await onSubmit({
        prospectName,
        phoneNumber,
        startAt: new Date(dateTime),
      })
      resetForm()
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the parent component
      // Just prevent the form from closing on error
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  const isValid = prospectName && phoneNumber && dateTime

  const isEditMode = mode === "edit"

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[85vh] overflow-y-auto" : ""}
      >
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit visit" : "Plan a visit"}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the visit details."
              : "Schedule a property viewing with a potential prospect."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="prospectName">Prospect name</Label>
            <Input
              id="prospectName"
              placeholder="Enter prospect's full name"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+32 471 23 45 67"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="datetime">Date & time</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              min={isEditMode ? undefined : getMinDateTime()}
              required
              className="w-full"
            />
          </div>
        </form>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                {isEditMode ? "Saving..." : "Scheduling..."}
              </>
            ) : isEditMode ? (
              <>
                <Save data-icon="inline-start" />
                Save changes
              </>
            ) : (
              <>
                <CalendarPlus data-icon="inline-start" />
                Schedule visit
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

