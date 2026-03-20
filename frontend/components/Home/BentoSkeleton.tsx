import React from "react";
import { PATTERN, GRID_CLASSES } from "@/lib/categoryStyles";

export default function BentoSkeleton({ idx }: { idx: number }) {
  const size = PATTERN[idx % PATTERN.length];
  return (
    <div className={`
      ${GRID_CLASSES[size]}
      h-[120px] rounded-2xl bg-slate-200 animate-pulse
    `} />
  );
}