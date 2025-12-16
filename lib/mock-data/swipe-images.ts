// ============================================================================
// TYPES
// ============================================================================
export type SwipeImage = {
  id: string
  imageUrl: string
  style: "modern" | "traditional" | "minimalist" | "bohemian" | "industrial" | "scandinavian"
  roomType: "living" | "kitchen" | "bedroom" | "bathroom" | "dining" | "office"
}

// ============================================================================
// MOCK DATA
// ============================================================================
// Interior design images with variety of styles and aspect ratios
export const mockSwipeImages: SwipeImage[] = [
  {
    id: "swipe-1",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
    style: "modern",
    roomType: "living",
  },
  {
    id: "swipe-2",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop",
    style: "scandinavian",
    roomType: "living",
  },
  {
    id: "swipe-3",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    style: "modern",
    roomType: "kitchen",
  },
  {
    id: "swipe-4",
    imageUrl: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&auto=format&fit=crop",
    style: "minimalist",
    roomType: "bedroom",
  },
  {
    id: "swipe-5",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
    style: "modern",
    roomType: "living",
  },
  {
    id: "swipe-6",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
    style: "traditional",
    roomType: "living",
  },
  {
    id: "swipe-7",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
    style: "bohemian",
    roomType: "bedroom",
  },
  {
    id: "swipe-8",
    imageUrl: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&auto=format&fit=crop",
    style: "industrial",
    roomType: "kitchen",
  },
  {
    id: "swipe-9",
    imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop",
    style: "modern",
    roomType: "bathroom",
  },
  {
    id: "swipe-10",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop",
    style: "scandinavian",
    roomType: "dining",
  },
  {
    id: "swipe-11",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop",
    style: "minimalist",
    roomType: "living",
  },
  {
    id: "swipe-12",
    imageUrl: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop",
    style: "modern",
    roomType: "office",
  },
  {
    id: "swipe-13",
    imageUrl: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop",
    style: "bohemian",
    roomType: "living",
  },
  {
    id: "swipe-14",
    imageUrl: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop",
    style: "traditional",
    roomType: "kitchen",
  },
  {
    id: "swipe-15",
    imageUrl: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&auto=format&fit=crop",
    style: "scandinavian",
    roomType: "bedroom",
  },
]

// ============================================================================
// CONSTANTS
// ============================================================================
export const MIN_SWIPES_FOR_PROFILE = 5
