"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StyleImageCard } from "@/components/admin/style-image-card";

export default function AdminStyleImagesPage() {
  const styleImages = useQuery(api.styleImages.list.listUnconfirmedStyleImages);

  if (styleImages === undefined) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Style Images Review
        </h1>
        <div className="text-center py-12 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Style Images Review
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {styleImages.length} image{styleImages.length !== 1 ? "s" : ""} to
            review
          </p>
        </div>
      </div>

      {styleImages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No unconfirmed style images to review.
        </div>
      ) : (
        <StyleImageCard key={styleImages[0]._id} image={styleImages[0]} />
      )}
    </div>
  );
}

