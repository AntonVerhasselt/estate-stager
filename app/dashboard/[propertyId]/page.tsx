"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CalendarPlus,
  BadgeCheck,
  Calendar,
  Image as ImageIcon,
  Search,
  Clock,
  User,
  ArrowUpRight,
  ImagePlus,
  Upload,
  Sofa,
  ChefHat,
  BedDouble,
  Bath,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trees,
  DoorOpen,
  Monitor,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  VisitSheet,
  type Visit,
  type VisitFormData,
} from "@/components/visits/visit-sheet"
import {
  AddImagesSheet,
  type PendingImage,
} from "@/components/property/add-images-sheet"
import { type RoomType as ImageGalleryRoomType } from "@/components/add-property/image-gallery"

// ============================================================================
// MOCK DATA TOGGLES - Set to true to test empty states
// ============================================================================
const MOCK_EMPTY_VISITS = false
const MOCK_EMPTY_PICTURES = false

// ============================================================================
// TYPES
// ============================================================================
type PropertyStatus = "available" | "sold"
type RoomType =
  | "living-room"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "garden"
  | "hall"
  | "desk-area"
  | "other"
type SortDirection = "asc" | "desc" | null
type SortColumn = "startAt" | "prospectName" | "status" | null

type Property = {
  id: string
  address: string
  status: PropertyStatus
}

type Picture = {
  id: string
  imageUrl: string
  roomType: RoomType
  createdAt: Date
}

// ============================================================================
// CONSTANTS
// ============================================================================
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20]

// ============================================================================
// INITIAL MOCK DATA
// ============================================================================
const initialMockProperty: Property = {
  id: "1",
  address: "123 Oak Street, Brooklyn, NY 11201",
  status: "available",
}

const initialMockVisits: Visit[] = MOCK_EMPTY_VISITS
  ? []
  : [
      {
        id: "v1",
        startAt: new Date("2025-12-16T10:00:00"),
        prospectName: "Sarah Johnson",
        phoneNumber: "471234567",
        countryCode: "+32",
        status: "prepared",
      },
      {
        id: "v2",
        startAt: new Date("2025-12-14T14:30:00"),
        prospectName: "Michael Chen",
        phoneNumber: "612345678",
        countryCode: "+31",
        status: "completed",
      },
      {
        id: "v3",
        startAt: new Date("2025-12-12T11:00:00"),
        prospectName: "Emily Davis",
        phoneNumber: "678901234",
        countryCode: "+33",
        status: "cancelled",
      },
      {
        id: "v4",
        startAt: new Date("2025-12-18T16:00:00"),
        prospectName: "Amanda Brown",
        phoneNumber: "491234567",
        countryCode: "+32",
        status: "planned",
      },
      {
        id: "v5",
        startAt: new Date("2025-12-20T09:00:00"),
        prospectName: "Robert Taylor",
        phoneNumber: "478901234",
        countryCode: "+32",
        status: "planned",
      },
      {
        id: "v6",
        startAt: new Date("2025-12-10T15:00:00"),
        prospectName: "Jennifer Martinez",
        phoneNumber: "623456789",
        countryCode: "+31",
        status: "completed",
      },
      {
        id: "v7",
        startAt: new Date("2025-12-22T11:30:00"),
        prospectName: "David Anderson",
        phoneNumber: "156789012",
        countryCode: "+49",
        status: "prepared",
      },
    ]

const initialMockPictures: Picture[] = MOCK_EMPTY_PICTURES
  ? []
  : [
      {
        id: "p1",
        imageUrl:
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop",
        roomType: "living-room",
        createdAt: new Date("2025-12-01"),
      },
      {
        id: "p2",
        imageUrl:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
        roomType: "kitchen",
        createdAt: new Date("2025-12-01"),
      },
      {
        id: "p3",
        imageUrl:
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop",
        roomType: "bedroom",
        createdAt: new Date("2025-12-02"),
      },
      {
        id: "p4",
        imageUrl:
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop",
        roomType: "bathroom",
        createdAt: new Date("2025-12-02"),
      },
      {
        id: "p5",
        imageUrl:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
        roomType: "living-room",
        createdAt: new Date("2025-12-03"),
      },
      {
        id: "p6",
        imageUrl:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop",
        roomType: "kitchen",
        createdAt: new Date("2025-12-03"),
      },
      {
        id: "p7",
        imageUrl:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
        roomType: "bedroom",
        createdAt: new Date("2025-12-04"),
      },
      {
        id: "p8",
        imageUrl:
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop",
        roomType: "other",
        createdAt: new Date("2025-12-04"),
      },
    ]

// ============================================================================
// HELPERS
// ============================================================================
function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getRoomTypeLabel(roomType: RoomType): string {
  const labels: Record<RoomType, string> = {
    "living-room": "Living Room",
    kitchen: "Kitchen",
    bedroom: "Bedroom",
    bathroom: "Bathroom",
    garden: "Garden",
    hall: "Hall",
    "desk-area": "Desk Area",
    other: "Other",
  }
  return labels[roomType]
}

function getRoomTypeIcon(roomType: RoomType) {
  const icons: Record<RoomType, React.ReactNode> = {
    "living-room": <Sofa className="size-3.5" />,
    kitchen: <ChefHat className="size-3.5" />,
    bedroom: <BedDouble className="size-3.5" />,
    bathroom: <Bath className="size-3.5" />,
    garden: <Trees className="size-3.5" />,
    hall: <DoorOpen className="size-3.5" />,
    "desk-area": <Monitor className="size-3.5" />,
    other: <ImageIcon className="size-3.5" />,
  }
  return icons[roomType]
}

function generateId(): string {
  return `v${Date.now()}`
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ============================================================================
// COMPONENTS
// ============================================================================

function TitleRow({
  property,
  onMarkAsSold,
  onPlanVisit,
}: {
  property: Property
  onMarkAsSold: () => void
  onPlanVisit: () => void
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight break-words">
          {property.address}
        </h1>
        <Badge
          variant="secondary"
          className={`w-fit shrink-0 ${
            property.status === "available"
              ? "bg-primary/15 text-primary"
              : ""
          }`}
        >
          {property.status === "available" ? "Available" : "Sold"}
        </Badge>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {property.status === "available" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <BadgeCheck data-icon="inline-start" />
                <span className="hidden sm:inline">Mark as sold</span>
                <span className="sm:hidden">Sold</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark as sold?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will set the property status to Sold.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onMarkAsSold}>
                  Mark as sold
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button onClick={onPlanVisit}>
          <CalendarPlus data-icon="inline-start" />
          <span className="hidden sm:inline">Plan visit</span>
          <span className="sm:hidden">Visit</span>
        </Button>
      </div>
    </div>
  )
}

function VisitsSection({
  visits,
  onOpenVisit,
}: {
  visits: Visit[]
  onOpenVisit: (id: string) => void
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(5)
  const [sortColumn, setSortColumn] = React.useState<SortColumn>("startAt")
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc")

  if (visits.length === 0) {
    return null
  }

  // Filter visits
  const filteredVisits = visits.filter((visit) => {
    const query = searchQuery.toLowerCase()
    const dateTimeStr = formatDateTime(visit.startAt).toLowerCase()
    const prospectName = visit.prospectName.toLowerCase()
    const status = visit.status.toLowerCase()

    return (
      dateTimeStr.includes(query) ||
      prospectName.includes(query) ||
      status.includes(query)
    )
  })

  // Sort visits
  const sortedVisits = [...filteredVisits].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    let comparison = 0
    switch (sortColumn) {
      case "startAt":
        comparison = a.startAt.getTime() - b.startAt.getTime()
        break
      case "prospectName":
        comparison = a.prospectName.localeCompare(b.prospectName)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
    }

    return sortDirection === "desc" ? -comparison : comparison
  })

  // Paginate
  const totalPages = Math.ceil(sortedVisits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVisits = sortedVisits.slice(startIndex, endIndex)

  // Reset to page 1 when filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="size-3.5 text-muted-foreground/50" />
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="size-3.5" />
    }
    return <ArrowDown className="size-3.5" />
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          Visits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search visits…"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("startAt")}
                >
                  <div className="flex items-center gap-1">
                    Date & time
                    {getSortIcon("startAt")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("prospectName")}
                >
                  <div className="flex items-center gap-1">
                    Prospect
                    {getSortIcon("prospectName")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVisits.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    No matching visits
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVisits.map((visit) => (
                  <TableRow
                    key={visit.id}
                    onClick={() => onOpenVisit(visit.id)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-muted-foreground hidden sm:block" />
                        <span className="whitespace-nowrap">
                          {formatDateTime(visit.startAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="size-3.5 text-muted-foreground hidden sm:block" />
                        {visit.prospectName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          visit.status === "prepared"
                            ? "bg-primary/15 text-primary"
                            : visit.status === "planned"
                            ? "bg-muted text-muted-foreground"
                            : visit.status === "cancelled"
                            ? "bg-destructive/10 text-destructive"
                            : undefined
                        }
                      >
                        {visit.status.charAt(0).toUpperCase() +
                          visit.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {sortedVisits.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 order-2 sm:order-1">
              <p className="text-xs text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedVisits.length)}{" "}
                of {sortedVisits.length} visits
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Show:
                </span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </Button>
              <span className="text-xs min-w-[80px] text-center">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PicturesEmptyState({ onAddImages }: { onAddImages: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-border bg-muted/30 py-12 sm:py-16 px-4 sm:px-6 text-center">
      <div className="mb-4 rounded-none bg-muted p-4">
        <ImagePlus className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium mb-1">No pictures uploaded</h3>
      <p className="text-xs text-muted-foreground mb-4 max-w-xs">
        Upload room photos to generate staged concepts.
      </p>
      <Button onClick={onAddImages}>
        <Upload data-icon="inline-start" />
        Add images
      </Button>
    </div>
  )
}

function PictureCard({
  picture,
  onDelete,
}: {
  picture: Picture
  onDelete: (id: string) => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  return (
    <>
      <Dialog>
        <Card className="overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 pt-0 group">
          <DialogTrigger asChild>
            <div>
              <div className="relative aspect-video">
                <Image
                  src={picture.imageUrl}
                  alt={getRoomTypeLabel(picture.roomType)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="size-6 text-white drop-shadow-md" />
                  </div>
                </div>
              </div>
              <CardContent className="pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {getRoomTypeIcon(picture.roomType)}
                      {getRoomTypeLabel(picture.roomType)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded {formatDate(picture.createdAt)}
                    </p>
                  </div>
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setShowDeleteConfirm(true)
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </div>
          </DialogTrigger>
        </Card>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getRoomTypeIcon(picture.roomType)}
              {getRoomTypeLabel(picture.roomType)}
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full overflow-hidden rounded-none">
            <Image
              src={picture.imageUrl}
              alt={getRoomTypeLabel(picture.roomType)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this image from the property.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(picture.id)
                setShowDeleteConfirm(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function PicturesSection({
  pictures,
  onDeletePicture,
  onAddImages,
}: {
  pictures: Picture[]
  onDeletePicture: (id: string) => void
  onAddImages: () => void
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="size-4 text-muted-foreground" />
            Pictures
          </CardTitle>

          {/* Only show upload button when pictures exist */}
          {pictures.length > 0 && (
            <Button variant="outline" size="sm" onClick={onAddImages}>
              <Upload data-icon="inline-start" />
              <span className="hidden sm:inline">Add images</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {pictures.length === 0 ? (
          <PicturesEmptyState onAddImages={onAddImages} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {pictures.map((picture) => (
              <PictureCard
                key={picture.id}
                picture={picture}
                onDelete={onDeletePicture}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>
}) {
  const resolvedParams = React.use(params)

  const router = useRouter()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // State for all data
  const [visits, setVisits] = React.useState<Visit[]>(initialMockVisits)
  const [pictures, setPictures] = React.useState<Picture[]>(initialMockPictures)
  const [planVisitOpen, setPlanVisitOpen] = React.useState(false)

  // State for add images flow
  const [addImagesOpen, setAddImagesOpen] = React.useState(false)
  const [pendingImages, setPendingImages] = React.useState<PendingImage[]>([])

  // In a real app, we'd fetch data based on params.propertyId
  console.log("Property ID:", resolvedParams.propertyId)

  const handleMarkAsSold = () => {
    console.log("Mark as sold confirmed for property:", initialMockProperty.id)
  }

  const handleOpenVisit = (id: string) => {
    router.push(`/dashboard/${resolvedParams.propertyId}/${id}`)
  }

  const handleAddVisit = (visitData: VisitFormData) => {
    const newVisit: Visit = {
      ...visitData,
      id: generateId(),
      status: "planned",
    }
    setVisits((prev) => [...prev, newVisit])
    console.log("Added new visit:", newVisit)
  }

  const handleDeletePicture = (id: string) => {
    setPictures((prev) => prev.filter((p) => p.id !== id))
    console.log("Deleted picture:", id)
  }

  const handleAddImages = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: PendingImage[] = Array.from(files).map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: URL.createObjectURL(file),
      file,
      roomType: null,
    }))

    setPendingImages(newImages)
    setAddImagesOpen(true)

    // Reset input so same file can be selected again
    e.target.value = ""
  }

  const handleAddImagesSubmit = async (images: PendingImage[]) => {
    // Convert blob URLs to data URLs so they persist after blob URLs are revoked
    const newPictures: Picture[] = await Promise.all(
      images.map(async (img) => {
        // Read the file as a data URL instead of using the blob URL
        const dataUrl = await fileToDataUrl(img.file)
        return {
          id: img.id,
          imageUrl: dataUrl,
          roomType: img.roomType as RoomType,
          createdAt: new Date(),
        }
      })
    )

    setPictures((prev) => [...prev, ...newPictures])
    setPendingImages([])
    console.log("Added images:", newPictures)
  }

  const handleAddImagesOpenChange = (open: boolean) => {
    setAddImagesOpen(open)
    if (!open) {
      // Clean up blob URLs when closing
      pendingImages.forEach((img) => URL.revokeObjectURL(img.src))
      setPendingImages([])
    }
  }

  return (
    <>
      {/* Hidden file input for image selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="sr-only"
      />

      <div className="space-y-6 sm:space-y-8">
        {/* Back navigation */}
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/dashboard">
              <ArrowLeft data-icon="inline-start" />
              Back to properties
            </Link>
          </Button>
        </div>

        <TitleRow
          property={initialMockProperty}
          onMarkAsSold={handleMarkAsSold}
          onPlanVisit={() => setPlanVisitOpen(true)}
        />
        <VisitsSection visits={visits} onOpenVisit={handleOpenVisit} />
        <PicturesSection
          pictures={pictures}
          onDeletePicture={handleDeletePicture}
          onAddImages={handleAddImages}
        />
      </div>

      <VisitSheet
        open={planVisitOpen}
        onOpenChange={setPlanVisitOpen}
        mode="create"
        onSubmit={handleAddVisit}
      />

      <AddImagesSheet
        open={addImagesOpen}
        onOpenChange={handleAddImagesOpenChange}
        initialImages={pendingImages}
        onImagesChange={setPendingImages}
        onSubmit={handleAddImagesSubmit}
      />
    </>
  )
}
