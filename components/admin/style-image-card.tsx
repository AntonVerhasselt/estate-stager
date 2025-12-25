"use client";

import * as React from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type StyleImage = {
  _id: Id<"styleImages">;
  unsplashUrl: string;
  searchKeyword: string;
  style?: Array<
    | "modern"
    | "traditional"
    | "scandinavian"
    | "industrial"
    | "bohemian"
    | "coastal"
  >;
  colorPalette?: Array<
    | "light-and-airy"
    | "dark-and-moody"
    | "earth-tones"
    | "monochrome"
    | "bold-and-vibrant"
    | "warm-neutrals"
  >;
  materialFocus?: Array<
    | "natural-wood"
    | "metal-and-glass"
    | "stone-and-concrete"
    | "upholstered"
    | "rattan-and-wicker"
    | "painted-and-lacquered"
  >;
  spatialPhilosophy?: Array<
    | "open-and-flowing"
    | "cozy-and-defined"
    | "minimal-and-uncluttered"
    | "maximalist-and-collected"
    | "symmetrical-and-formal"
    | "functional-and-zoned"
  >;
  roomType?:
    | "living-room"
    | "kitchen"
    | "bedroom"
    | "bathroom"
    | "garden"
    | "hall"
    | "desk-area"
    | "other";
};

const STYLE_OPTIONS = [
  "modern",
  "traditional",
  "scandinavian",
  "industrial",
  "bohemian",
  "coastal",
] as const;

const COLOR_PALETTE_OPTIONS = [
  "light-and-airy",
  "dark-and-moody",
  "earth-tones",
  "monochrome",
  "bold-and-vibrant",
  "warm-neutrals",
] as const;

const MATERIAL_FOCUS_OPTIONS = [
  "natural-wood",
  "metal-and-glass",
  "stone-and-concrete",
  "upholstered",
  "rattan-and-wicker",
  "painted-and-lacquered",
] as const;

const SPATIAL_PHILOSOPHY_OPTIONS = [
  "open-and-flowing",
  "cozy-and-defined",
  "minimal-and-uncluttered",
  "maximalist-and-collected",
  "symmetrical-and-formal",
  "functional-and-zoned",
] as const;

const ROOM_TYPE_OPTIONS = [
  "living-room",
  "kitchen",
  "bedroom",
  "bathroom",
  "garden",
  "hall",
  "desk-area",
  "other",
] as const;

function formatLabel(value: string): string {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface StyleImageCardProps {
  image: StyleImage;
  onConfirm?: () => void;
  onDelete?: () => void;
}

export function StyleImageCard({ image, onConfirm, onDelete }: StyleImageCardProps) {
  const confirmStyleImage = useMutation(api.styleImages.update.confirmStyleImage);
  const softDeleteStyleImage = useMutation(api.styleImages.update.softDeleteStyleImage);

  const [style, setStyle] = React.useState<Set<string>>(
    new Set(image.style || [])
  );
  const [colorPalette, setColorPalette] = React.useState<Set<string>>(
    new Set(image.colorPalette || [])
  );
  const [materialFocus, setMaterialFocus] = React.useState<Set<string>>(
    new Set(image.materialFocus || [])
  );
  const [spatialPhilosophy, setSpatialPhilosophy] = React.useState<Set<string>>(
    new Set(image.spatialPhilosophy || [])
  );
  const [roomType, setRoomType] = React.useState<string | undefined>(
    image.roomType
  );
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleStyleChange = (value: string, checked: boolean) => {
    const newStyle = new Set(style);
    if (checked) {
      newStyle.add(value);
    } else {
      newStyle.delete(value);
    }
    setStyle(newStyle);
  };

  const handleColorPaletteChange = (value: string, checked: boolean) => {
    const newColorPalette = new Set(colorPalette);
    if (checked) {
      newColorPalette.add(value);
    } else {
      newColorPalette.delete(value);
    }
    setColorPalette(newColorPalette);
  };

  const handleMaterialFocusChange = (value: string, checked: boolean) => {
    const newMaterialFocus = new Set(materialFocus);
    if (checked) {
      newMaterialFocus.add(value);
    } else {
      newMaterialFocus.delete(value);
    }
    setMaterialFocus(newMaterialFocus);
  };

  const handleSpatialPhilosophyChange = (value: string, checked: boolean) => {
    const newSpatialPhilosophy = new Set(spatialPhilosophy);
    if (checked) {
      newSpatialPhilosophy.add(value);
    } else {
      newSpatialPhilosophy.delete(value);
    }
    setSpatialPhilosophy(newSpatialPhilosophy);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await confirmStyleImage({
        id: image._id,
        style:
          style.size > 0
            ? (Array.from(style) as Array<
                | "modern"
                | "traditional"
                | "scandinavian"
                | "industrial"
                | "bohemian"
                | "coastal"
              >)
            : undefined,
        colorPalette:
          colorPalette.size > 0
            ? (Array.from(colorPalette) as Array<
                | "light-and-airy"
                | "dark-and-moody"
                | "earth-tones"
                | "monochrome"
                | "bold-and-vibrant"
                | "warm-neutrals"
              >)
            : undefined,
        materialFocus:
          materialFocus.size > 0
            ? (Array.from(materialFocus) as Array<
                | "natural-wood"
                | "metal-and-glass"
                | "stone-and-concrete"
                | "upholstered"
                | "rattan-and-wicker"
                | "painted-and-lacquered"
              >)
            : undefined,
        spatialPhilosophy:
          spatialPhilosophy.size > 0
            ? (Array.from(spatialPhilosophy) as Array<
                | "open-and-flowing"
                | "cozy-and-defined"
                | "minimal-and-uncluttered"
                | "maximalist-and-collected"
                | "symmetrical-and-formal"
                | "functional-and-zoned"
              >)
            : undefined,
        roomType: roomType as
          | "living-room"
          | "kitchen"
          | "bedroom"
          | "bathroom"
          | "garden"
          | "hall"
          | "desk-area"
          | "other"
          | undefined,
      });
      toast.success("Style image confirmed");
      onConfirm?.();
    } catch (error) {
      toast.error("Failed to confirm style image");
      console.error(error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await softDeleteStyleImage({ id: image._id });
      toast.success("Style image deleted");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete style image");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Section */}
          <div className="flex-shrink-0 lg:w-2/5">
            <div className="relative aspect-video w-full overflow-hidden rounded border">
              <Image
                src={image.unsplashUrl}
                alt="Style image"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="mt-3">
              <Badge variant="secondary">Keyword: {image.searchKeyword}</Badge>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-6">
            {/* Style */}
            <div className="space-y-3">
              <Label>Style</Label>
              <div className="flex flex-wrap gap-3">
                {STYLE_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`style-${image._id}-${option}`}
                      checked={style.has(option)}
                      onCheckedChange={(checked) =>
                        handleStyleChange(option, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`style-${image._id}-${option}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {formatLabel(option)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-3">
              <Label>Color Palette</Label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PALETTE_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`color-${image._id}-${option}`}
                      checked={colorPalette.has(option)}
                      onCheckedChange={(checked) =>
                        handleColorPaletteChange(option, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`color-${image._id}-${option}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {formatLabel(option)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Focus */}
            <div className="space-y-3">
              <Label>Material Focus</Label>
              <div className="flex flex-wrap gap-3">
                {MATERIAL_FOCUS_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`material-${image._id}-${option}`}
                      checked={materialFocus.has(option)}
                      onCheckedChange={(checked) =>
                        handleMaterialFocusChange(option, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`material-${image._id}-${option}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {formatLabel(option)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Spatial Philosophy */}
            <div className="space-y-3">
              <Label>Spatial Philosophy</Label>
              <div className="flex flex-wrap gap-3">
                {SPATIAL_PHILOSOPHY_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`spatial-${image._id}-${option}`}
                      checked={spatialPhilosophy.has(option)}
                      onCheckedChange={(checked) =>
                        handleSpatialPhilosophyChange(option, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`spatial-${image._id}-${option}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {formatLabel(option)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-3">
              <Label>Room Type</Label>
              <Select
                value={roomType || ""}
                onValueChange={(value) => setRoomType(value || undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {formatLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleConfirm}
                disabled={isConfirming || isDeleting}
                className="flex-1"
              >
                {isConfirming ? "Confirming..." : "Confirm"}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isConfirming || isDeleting}
                variant="destructive"
                className="flex-1"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
