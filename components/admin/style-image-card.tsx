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
import type {
  Style,
  ColorPalette,
  MaterialFocus,
  SpatialPhilosophy,
  RoomType,
} from "@/types/design";
import {
  STYLE_OPTIONS,
  COLOR_PALETTE_OPTIONS,
  MATERIAL_FOCUS_OPTIONS,
  SPATIAL_PHILOSOPHY_OPTIONS,
  ROOM_TYPE_OPTIONS,
} from "@/types/design";

type StyleImage = {
  _id: Id<"styleImages">;
  unsplashUrl: string;
  searchKeyword: string;
  style?: Style[];
  colorPalette?: ColorPalette[];
  materialFocus?: MaterialFocus[];
  spatialPhilosophy?: SpatialPhilosophy[];
  roomType?: RoomType;
};

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
            ? (Array.from(style) as Style[])
            : undefined,
        colorPalette:
          colorPalette.size > 0
            ? (Array.from(colorPalette) as ColorPalette[])
            : undefined,
        materialFocus:
          materialFocus.size > 0
            ? (Array.from(materialFocus) as MaterialFocus[])
            : undefined,
        spatialPhilosophy:
          spatialPhilosophy.size > 0
            ? (Array.from(spatialPhilosophy) as SpatialPhilosophy[])
            : undefined,
        roomType: roomType as RoomType | undefined,
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
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`style-${image._id}-${option.value}`}
                      checked={style.has(option.value)}
                      onCheckedChange={(checked) =>
                        handleStyleChange(option.value, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`style-${image._id}-${option.value}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {option.label}
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
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`color-${image._id}-${option.value}`}
                      checked={colorPalette.has(option.value)}
                      onCheckedChange={(checked) =>
                        handleColorPaletteChange(option.value, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`color-${image._id}-${option.value}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {option.label}
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
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`material-${image._id}-${option.value}`}
                      checked={materialFocus.has(option.value)}
                      onCheckedChange={(checked) =>
                        handleMaterialFocusChange(option.value, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`material-${image._id}-${option.value}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {option.label}
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
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`spatial-${image._id}-${option.value}`}
                      checked={spatialPhilosophy.has(option.value)}
                      onCheckedChange={(checked) =>
                        handleSpatialPhilosophyChange(option.value, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`spatial-${image._id}-${option.value}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {option.label}
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
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
