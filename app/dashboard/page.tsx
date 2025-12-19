"use client"

import * as React from "react"
import Link from "next/link"
import { SearchIcon, FilterIcon, ChevronDownIcon, PlusIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
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
  _id: Id<"properties">
  address: string
  imageUrl: string | null
  status: "available" | "sold"
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showAvailable, setShowAvailable] = React.useState(true)
  const [showSold, setShowSold] = React.useState(false)

  // Fetch properties from Convex
  const properties = useQuery(api.properties.list.listProperties) ?? []

  const filteredProperties = properties.filter((property) => {
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
            <Link key={property._id} href={`/dashboard/${property._id}`}>
              <Card className="overflow-hidden pt-0 transition-all hover:ring-2 hover:ring-primary/50 cursor-pointer">
                {property.imageUrl ? (
                  <img
                    src={property.imageUrl}
                    alt={property.address}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No image</span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{property.address}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 ${
                        property.status === "available"
                          ? "bg-primary/15 text-primary"
                          : ""
                      }`}
                    >
                      {property.status === "available" ? "Available" : "Sold"}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

