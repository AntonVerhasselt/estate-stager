"use client"

import * as React from "react"
import Link from "next/link"
import { SearchIcon, FilterIcon, ChevronDownIcon, PlusIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Property = {
  id: string
  address: string
  image: string
  status: "available" | "sold"
}

const mockProperties: Property[] = [
  {
    id: "1",
    address: "123 Oak Street, Brooklyn, NY 11201",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "2",
    address: "456 Maple Avenue, Los Angeles, CA 90001",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "3",
    address: "789 Pine Road, Miami, FL 33101",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop",
    status: "sold",
  },
  {
    id: "4",
    address: "321 Cedar Lane, Seattle, WA 98101",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "5",
    address: "654 Birch Boulevard, Chicago, IL 60601",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop",
    status: "sold",
  },
  {
    id: "6",
    address: "987 Elm Court, Austin, TX 73301",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop",
    status: "available",
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showAvailable, setShowAvailable] = React.useState(true)
  const [showSold, setShowSold] = React.useState(false)

  const filteredProperties = mockProperties.filter((property) => {
    // Filter by search query
    const matchesSearch = property.address
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus =
      (showAvailable && property.status === "available") ||
      (showSold && property.status === "sold")

    return matchesSearch && matchesStatus
  })

  const getStatusCount = () => {
    const count = (showAvailable ? 1 : 0) + (showSold ? 1 : 0)
    if (count === 0) return "None"
    if (count === 2) return "All"
    return count.toString()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
        <Button asChild>
          <Link href="/dashboard/new">
            <PlusIcon className="size-4" />
            New Property
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Status Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FilterIcon className="size-4" />
              Status
              <Badge variant="secondary" className="ml-1 px-1.5">
                {getStatusCount()}
              </Badge>
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showAvailable}
              onCheckedChange={setShowAvailable}
            >
              Available
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showSold}
              onCheckedChange={setShowSold}
            >
              Sold
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No properties found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden pt-0">
              <img
                src={property.image}
                alt={property.address}
                className="aspect-video w-full object-cover"
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{property.address}</CardTitle>
                  <Badge
                    variant={property.status === "available" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {property.status === "available" ? "Available" : "Sold"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

