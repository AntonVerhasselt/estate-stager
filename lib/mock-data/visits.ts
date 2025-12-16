// ============================================================================
// TYPES
// ============================================================================
export type VisitStyleProfile = {
  hasStyleProfile: boolean
  swipeCount: number
}

export type MockVisit = {
  id: string
  propertyId: string
  prospectName: string
  styleProfile: VisitStyleProfile
}

// ============================================================================
// MOCK DATA
// ============================================================================
// Simulates visits with different style profile states
export const mockVisits: Record<string, MockVisit> = {
  // Visit with completed style profile
  "visit-123": {
    id: "visit-123",
    propertyId: "property-1",
    prospectName: "Sarah Johnson",
    styleProfile: {
      hasStyleProfile: true,
      swipeCount: 12,
    },
  },
  // Visit without style profile (new visitor)
  "visit-456": {
    id: "visit-456",
    propertyId: "property-1",
    prospectName: "Michael Chen",
    styleProfile: {
      hasStyleProfile: false,
      swipeCount: 0,
    },
  },
  // Visit with partial progress (swiped but not enough for profile)
  "visit-789": {
    id: "visit-789",
    propertyId: "property-2",
    prospectName: "Emily Davis",
    styleProfile: {
      hasStyleProfile: false,
      swipeCount: 3,
    },
  },
}

// ============================================================================
// HELPERS
// ============================================================================
/**
 * Simulates fetching a visit from the database.
 * Returns a default visit if not found (for demo purposes).
 */
export function getVisit(visitId: string): MockVisit {
  return (
    mockVisits[visitId] ?? {
      id: visitId,
      propertyId: "unknown",
      prospectName: "Guest",
      styleProfile: {
        hasStyleProfile: false,
        swipeCount: 0,
      },
    }
  )
}
