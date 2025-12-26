"use client";

import * as React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLabel } from "@/types/design";

// ============================================================================
// TYPES
// ============================================================================
type StyleScores = {
  style: {
    modern: number;
    traditional: number;
    scandinavian: number;
    industrial: number;
    bohemian: number;
    coastal: number;
  };
  colorPalette: {
    lightAndAiry: number;
    darkAndMoody: number;
    earthTones: number;
    monochrome: number;
    boldAndVibrant: number;
    warmNeutrals: number;
  };
  materialFocus: {
    naturalWood: number;
    metalAndGlass: number;
    stoneAndConcrete: number;
    upholstered: number;
    rattanAndWicker: number;
    paintedAndLacquered: number;
  };
  spatialPhilosophy: {
    openAndFlowing: number;
    cozyAndDefined: number;
    minimalAndUncluttered: number;
    maximalistAndCollected: number;
    symmetricalAndFormal: number;
    functionalAndZoned: number;
  };
};

type StyleRadarChartProps = {
  scores: StyleScores;
  /** Show all 4 dimensions or just one */
  dimension?: keyof StyleScores;
  /** Custom className for the grid container when showing all dimensions */
  gridClassName?: string;
};

// ============================================================================
// HELPERS
// ============================================================================
function normalizeScores(scores: Record<string, number>): { name: string; value: number; label: string }[] {
  const entries = Object.entries(scores);
  const maxAbs = Math.max(...entries.map(([, v]) => Math.abs(v)), 1);
  
  return entries.map(([key, value]) => ({
    name: key,
    label: formatLabel(key),
    // Normalize to 0-100 scale where 50 is neutral
    value: 50 + (value / maxAbs) * 50,
  }));
}

const DIMENSION_LABELS: Record<keyof StyleScores, string> = {
  style: "Design Style",
  colorPalette: "Color Palette",
  materialFocus: "Materials",
  spatialPhilosophy: "Spatial Feel",
};

// ============================================================================
// CUSTOM TICK COMPONENT FOR MULTI-LINE LABELS
// ============================================================================
interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  cx?: number;
  cy?: number;
}

/**
 * Split a label into multiple lines for better display
 * - Labels with "And" split on "And"
 * - Long single words (>9 chars) get hyphenated
 * - Short labels stay as is
 */
function splitLabel(label: string): string[] {
  // If contains " And ", split there
  if (label.includes(" And ")) {
    return label.split(" And ").map((p, i) => i === 0 ? p + " &" : p);
  }
  
  // If it's a single long word (no spaces), hyphenate it
  if (!label.includes(" ") && label.length > 9) {
    const mid = Math.ceil(label.length / 2);
    return [label.slice(0, mid) + "-", label.slice(mid)];
  }
  
  // If multi-word but short enough, keep as is
  if (label.length <= 12) {
    return [label];
  }
  
  // Multi-word label that's long - split on space closest to middle
  const words = label.split(" ");
  if (words.length === 2) {
    return words;
  }
  
  // For 3+ words, find best split point
  const mid = label.length / 2;
  let splitIndex = 0;
  let bestDiff = Infinity;
  let pos = 0;
  
  for (let i = 0; i < words.length - 1; i++) {
    pos += words[i].length + 1;
    const diff = Math.abs(pos - mid);
    if (diff < bestDiff) {
      bestDiff = diff;
      splitIndex = i + 1;
    }
  }
  
  return [
    words.slice(0, splitIndex).join(" "),
    words.slice(splitIndex).join(" ")
  ];
}

function CustomTick({ x = 0, y = 0, payload, cx = 0, cy = 0 }: CustomTickProps) {
  if (!payload) return <g />;
  
  const label = payload.value;
  const parts = splitLabel(label);
  
  // Calculate angle from center to determine text anchor
  const dx = x - cx;
  const dy = y - cy;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Determine text anchor based on position
  let textAnchor: "start" | "middle" | "end" = "middle";
  if (angle > -60 && angle < 60) {
    textAnchor = "start";
  } else if (angle > 120 || angle < -120) {
    textAnchor = "end";
  }
  
  // Adjust y position for multi-line to center vertically
  const yOffset = parts.length > 1 ? -6 : 0;
  
  return (
    <text
      x={x}
      y={y + yOffset}
      textAnchor={textAnchor}
      fontSize={10}
      fill="currentColor"
      className="fill-muted-foreground"
    >
      {parts.map((part, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 12}>
          {part}
        </tspan>
      ))}
    </text>
  );
}

// ============================================================================
// SINGLE RADAR CHART
// ============================================================================
function SingleRadarChart({
  data,
  dimension,
}: {
  data: { name: string; value: number; label: string }[];
  dimension: keyof StyleScores;
}) {
  const chartConfig: ChartConfig = {
    value: {
      label: DIMENSION_LABELS[dimension],
      color: "var(--primary)",
    },
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[300px]"
    >
      <RadarChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 10}}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name, item) => (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.payload.label}</span>
                  <span className="font-medium">{Math.round(Number(value) - 50)}</span>
                </div>
              )}
            />
          }
        />
        <PolarGrid gridType="circle" />
        <PolarAngleAxis
          dataKey="label"
          tick={(props) => <CustomTick {...props} />}
          tickLine={false}
        />
        <Radar
          name={DIMENSION_LABELS[dimension]}
          dataKey="value"
          className="fill-primary/25 stroke-primary/50"
          fillOpacity={1}
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function StyleRadarChart({ scores, dimension, gridClassName }: StyleRadarChartProps) {
  // If a specific dimension is requested, show only that one
  if (dimension) {
    const data = normalizeScores(scores[dimension]);
    return (
      <div className="p-0">
        <h3 className="text-sm font-medium text-center pb-0 mb-0">
          {DIMENSION_LABELS[dimension]}
        </h3>
        <SingleRadarChart data={data} dimension={dimension} />
      </div>
    );
  }

  // Show all 4 dimensions in a grid
  const defaultGridClassName = "grid gap-4 grid-cols-1 sm:grid-cols-2";
  return (
    <div className={gridClassName || defaultGridClassName}>
      {(Object.keys(DIMENSION_LABELS) as Array<keyof StyleScores>).map((dim) => {
        const data = normalizeScores(scores[dim]);
        return (
          <Card key={dim}>
            <CardHeader className="px-0 pb-0 pt-0">
              <CardTitle className="text-sm text-center">
                {DIMENSION_LABELS[dim]}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 pt-0">
              <SingleRadarChart data={data} dimension={dim} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
