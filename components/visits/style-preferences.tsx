"use client"

import * as React from "react"
import { Palette, Clock, Share2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"

// ============================================================================
// TYPES
// ============================================================================
export type StylePreference = {
  id: string
  category: string
  labelLeft: string
  labelRight: string
  value: number // 0-100, 50 is neutral
}

export type StyleProfile = {
  preferences: StylePreference[]
  colorPalette: string[] // hex colors
}

type StylePreferencesProps = {
  profile: StyleProfile | null
  onUpdate?: (preferences: StylePreference[]) => void
  editable?: boolean
  prospectLink?: string
}

// ============================================================================
// COMPONENT
// ============================================================================
export function StylePreferences({
  profile,
  onUpdate,
  editable = false,
  prospectLink,
}: StylePreferencesProps) {
  const [linkCopied, setLinkCopied] = React.useState(false)

  const handleSliderChange = (id: string, newValue: number) => {
    if (!profile || !onUpdate) return

    const updatedPreferences = profile.preferences.map((pref) =>
      pref.id === id ? { ...pref, value: newValue } : pref
    )
    onUpdate(updatedPreferences)
  }

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

  // Awaiting input state
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-border bg-muted/30 py-10 px-4 text-center">
        <div className="mb-3 rounded-none bg-muted p-3">
          <Clock className="size-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium mb-1">Awaiting style preferences</h3>
        <p className="text-xs text-muted-foreground max-w-xs mb-4">
          Share the link below so the prospect can swipe through design styles.
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
    <div className="space-y-6">
      {/* Style Sliders */}
      <div className="space-y-4">
        {profile.preferences.map((pref) => (
          <div key={pref.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{pref.labelLeft}</span>
              <span className="font-medium text-foreground">{pref.category}</span>
              <span className="text-muted-foreground">{pref.labelRight}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={pref.value}
                onChange={(e) =>
                  handleSliderChange(pref.id, Number(e.target.value))
                }
                disabled={!editable}
                className="w-full h-2 bg-muted rounded-none appearance-none cursor-pointer disabled:cursor-default
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-primary
                  [&::-webkit-slider-thumb]:shadow-sm
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:disabled:cursor-default
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-primary
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:disabled:cursor-default"
              />
              {/* Center marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3 bg-border pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Color Palette */}
      {profile.colorPalette.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium">Color preferences</span>
          </div>
          <div className="flex gap-2">
            {profile.colorPalette.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// MOCK DATA
// ============================================================================
export const mockStyleProfile: StyleProfile = {
  preferences: [
    {
      id: "style-1",
      category: "Design Style",
      labelLeft: "Modern",
      labelRight: "Traditional",
      value: 30,
    },
    {
      id: "style-2",
      category: "Space Feel",
      labelLeft: "Minimalist",
      labelRight: "Cozy",
      value: 65,
    },
    {
      id: "style-3",
      category: "Color Temperature",
      labelLeft: "Cool Tones",
      labelRight: "Warm Tones",
      value: 70,
    },
    {
      id: "style-4",
      category: "Color Intensity",
      labelLeft: "Neutral",
      labelRight: "Bold",
      value: 25,
    },
  ],
  colorPalette: ["#E8DED1", "#A3B18A", "#588157", "#344E41", "#1B263B"],
}

