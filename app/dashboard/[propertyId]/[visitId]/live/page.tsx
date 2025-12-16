"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  MessageCircle,
  User,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ImageCarousel,
  type CarouselImage,
} from "@/components/visits/image-carousel"

// ============================================================================
// TYPES
// ============================================================================
type SendStatus = "idle" | "sending" | "success" | "error"

type Visit = {
  id: string
  prospectName: string
  phoneNumber: string
  countryCode: string
}

// ============================================================================
// MOCK DATA
// ============================================================================
const mockVisit: Visit = {
  id: "v1",
  prospectName: "Sarah Johnson",
  phoneNumber: "471234567",
  countryCode: "+32",
}

const mockImages: CarouselImage[] = [
  {
    id: "si1",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
    roomType: "living",
  },
  {
    id: "si2",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    roomType: "kitchen",
  },
  {
    id: "si3",
    imageUrl:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&auto=format&fit=crop",
    roomType: "bedroom",
  },
  {
    id: "si4",
    imageUrl:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop",
    roomType: "bathroom",
  },
  {
    id: "si5",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
    roomType: "living",
  },
  {
    id: "si6",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
    roomType: "other",
  },
]

// ============================================================================
// COMPONENTS
// ============================================================================
function SendButton({
  status,
  onSend,
}: {
  status: SendStatus
  onSend: () => void
}) {
  const getButtonContent = () => {
    switch (status) {
      case "sending":
        return (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Sending...</span>
          </>
        )
      case "success":
        return (
          <>
            <CheckCircle className="size-5" />
            <span>Sent!</span>
          </>
        )
      case "error":
        return (
          <>
            <XCircle className="size-5" />
            <span>Failed - Tap to retry</span>
          </>
        )
      default:
        return (
          <>
            <MessageCircle className="size-5" />
            <span>Send via WhatsApp</span>
          </>
        )
    }
  }

  const getButtonStyle = () => {
    switch (status) {
      case "success":
        return "bg-green-600 hover:bg-green-600 text-white"
      case "error":
        return "bg-destructive hover:bg-destructive text-destructive-foreground"
      default:
        return "bg-[#25D366] hover:bg-[#20bd5a] text-white"
    }
  }

  return (
    <Button
      onClick={onSend}
      disabled={status === "sending"}
      className={`h-14 text-base font-medium w-full rounded-none ${getButtonStyle()}`}
    >
      {getButtonContent()}
    </Button>
  )
}

function StatusToast({
  status,
  onDismiss,
}: {
  status: SendStatus
  onDismiss: () => void
}) {
  React.useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(onDismiss, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, onDismiss])

  if (status !== "success" && status !== "error") {
    return null
  }

  return (
    <div
      className={`fixed top-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 p-4 rounded-none shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-top-2 ${
        status === "success"
          ? "bg-green-600 text-white"
          : "bg-destructive text-destructive-foreground"
      }`}
    >
      {status === "success" ? (
        <>
          <CheckCircle className="size-5 shrink-0" />
          <div>
            <p className="font-medium">Image sent successfully</p>
            <p className="text-sm opacity-90">Delivered via WhatsApp</p>
          </div>
        </>
      ) : (
        <>
          <XCircle className="size-5 shrink-0" />
          <div>
            <p className="font-medium">Failed to send</p>
            <p className="text-sm opacity-90">Please try again</p>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function LiveVisitPage({
  params,
}: {
  params: Promise<{ propertyId: string; visitId: string }>
}) {
  const resolvedParams = React.use(params)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [sendStatus, setSendStatus] = React.useState<SendStatus>("idle")

  const handleSend = async () => {
    if (sendStatus === "sending") return

    setSendStatus("sending")

    // Simulate sending with mock delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Randomly succeed or fail for demo purposes (80% success rate)
    const success = Math.random() > 0.2

    if (success) {
      setSendStatus("success")
    } else {
      setSendStatus("error")
    }
  }

  const handleDismissToast = () => {
    setSendStatus("idle")
  }

  const currentImage = mockImages[currentImageIndex]

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <header className="shrink-0 h-14 border-b border-border bg-background flex items-center justify-between px-4 z-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link
            href={`/dashboard/${resolvedParams.propertyId}/${resolvedParams.visitId}`}
          >
            <ArrowLeft data-icon="inline-start" />
            <span className="hidden sm:inline">Exit live mode</span>
            <span className="sm:hidden">Exit</span>
          </Link>
        </Button>

        <Badge
          variant="secondary"
          className="bg-primary/15 text-primary flex items-center gap-1.5"
        >
          <User className="size-3" />
          {mockVisit.prospectName}
        </Badge>
      </header>

      {/* Main carousel area */}
      <div className="flex-1 min-h-0">
        <ImageCarousel
          images={mockImages}
          onImageChange={setCurrentImageIndex}
        />
      </div>

      {/* Send button area */}
      <div className="shrink-0 p-4 border-t border-border bg-background">
        <SendButton status={sendStatus} onSend={handleSend} />
        <p className="text-xs text-muted-foreground text-center mt-2">
          Sending: {currentImage.roomType.charAt(0).toUpperCase() + currentImage.roomType.slice(1)} ({currentImageIndex + 1}/{mockImages.length})
        </p>
      </div>

      {/* Status toast */}
      <StatusToast status={sendStatus} onDismiss={handleDismissToast} />
    </div>
  )
}

